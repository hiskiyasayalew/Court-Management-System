import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';

const roleApiMap = {
  User: 'users',
  Police: 'police',
  Prosecutor: 'prosecutor',
  Judge: 'judge',
  Applications: 'applications',
};

const initialFormData = {
  id: '',
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  phoneNumber: '',
  firstName: '',
  lastName: '',
  city: '',
  subCity: '',
  officerName: '',
  position: '',
  name: '',
  status: 'ACTIVE',
};

const AdminPage = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState(initialFormData);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedRole) {
      fetchUsers(selectedRole);
      setFormData(initialFormData);
      setError('');
    }
  }, [selectedRole]);

  const fetchUsers = async (role) => {
    try {
      const apiPath = roleApiMap[role];
      const res = await axios.get(`http://localhost:8080/api/admin/${apiPath}`);
      setUsers(res.data);
      setError('');
    } catch {
      setError("Failed to fetch users");
      setUsers([]);
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.id && (!formData.password || formData.password !== formData.confirmPassword)) {
    setError("Passwords don't match or are empty");
    return;
  }

  setIsLoading(true);
  const role = selectedRole;
  const isEdit = formData.id !== '';
  const url = `http://localhost:8080/api/admin/${roleApiMap[role]}/${isEdit ? 'update' : 'create'}`;

  const payload = { ...formData };
  delete payload.confirmPassword;
  if (!payload.password) delete payload.password;
  if (!isEdit) delete payload.id;

  try {
    if (isEdit) {
      await axios.put(url, payload);
    } else {
      await axios.post(url, payload); // ✅ Correct for create!
    }
    fetchUsers(role);
    setFormData(initialFormData);
    setError('');
  } catch {
    setError("Failed to save user");
  } finally {
    setIsLoading(false);
  }
};


  const handleEdit = (user) => {
    switch (selectedRole) {
      case 'User':
        setFormData({
          id: user.id,
          username: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          city: user.city,
          subCity: user.subCity,
          email: user.email,
          password: '',
          confirmPassword: '',
        });
        break;
      case 'Police':
        setFormData({
          id: user.id,
          officerName: user.officerName,
          position: user.position,
          email: user.email,
          phoneNumber: user.phoneNumber,
          username: user.username,
          password: '',
          confirmPassword: '',
        });
        break;
      case 'Prosecutor':
      case 'Judge':
        setFormData({
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber || '',
          status: user.status || 'ACTIVE',
          password: '',
          confirmPassword: '',
        });
        break;
      default:
        setFormData(initialFormData);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/admin/${roleApiMap[selectedRole]}/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      setError("Failed to delete user");
    }
  };

  const columns = useMemo(() => {
    if (selectedRole === 'Applications') {
      return [
        { Header: 'ID', accessor: 'id' },
        { Header: 'Full Name', accessor: 'fullName' },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Phone', accessor: 'phone' },
        { Header: 'Role', accessor: 'role' },
        { Header: 'Reason', accessor: 'reason' },
        { Header: 'Education', accessor: 'education' },
        { Header: 'Work Experience', accessor: 'workExperience' },
        { Header: 'Additional Info', accessor: 'additionalInfo' },
        {
          Header: 'Files',
          Cell: ({ row }) => (
            <div className="flex flex-col">
              {row.original.educationFiles?.map((file, idx) => (
                <a
                  key={idx}
                  href={`http://localhost:8080/${file}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  File {idx + 1}
                </a>
              ))}
            </div>
          ),
        },
      ];
    }

    return [
      { Header: 'ID', accessor: 'id' },
      {
        Header: 'Name',
        accessor: (row) => {
          if (selectedRole === 'User') return `${row.firstName || ''} ${row.lastName || ''}`.trim();
          if (selectedRole === 'Police') return row.officerName || '';
          return row.name || '';
        },
        id: 'name',
      },
      { Header: 'Username', accessor: selectedRole === 'Police' ? 'username' : 'userName' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Status', accessor: 'status' },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <button onClick={() => handleEdit(row.original)} className="text-blue-500">Edit</button>
            <button onClick={() => handleDelete(row.original.id)} className="text-red-500">Delete</button>
          </div>
        ),
      },
    ];
  }, [users, selectedRole]);

  const renderForm = () => {
    switch (selectedRole) {
      case 'User':
        return (
          <>
            <input name="username" value={formData.username || ''} onChange={handleChange} placeholder="Username" className="w-full border p-2" required />
            <input name="firstName" value={formData.firstName || ''} onChange={handleChange} placeholder="First Name" className="w-full border p-2" required />
            <input name="lastName" value={formData.lastName || ''} onChange={handleChange} placeholder="Last Name" className="w-full border p-2" required />
            <input name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleChange} placeholder="Phone Number" className="w-full border p-2" required />
            <input name="city" value={formData.city || ''} onChange={handleChange} placeholder="City" className="w-full border p-2" required />
            <input name="subCity" value={formData.subCity || ''} onChange={handleChange} placeholder="Sub City" className="w-full border p-2" required />
            <input name="email" type="email" value={formData.email || ''} onChange={handleChange} placeholder="Email" className="w-full border p-2" required />
          </>
        );
      case 'Police':
        return (
          <>
            <input name="officerName" value={formData.officerName || ''} onChange={handleChange} placeholder="Officer Name" className="w-full border p-2" required />
            <input name="position" value={formData.position || ''} onChange={handleChange} placeholder="Position" className="w-full border p-2" required />
            <input name="email" type="email" value={formData.email || ''} onChange={handleChange} placeholder="Email" className="w-full border p-2" required />
            <input name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleChange} placeholder="Phone Number" className="w-full border p-2" required />
            <input name="username" value={formData.username || ''} onChange={handleChange} placeholder="Username" className="w-full border p-2" required />
          </>
        );
      case 'Prosecutor':
      case 'Judge':
        return (
          <>
            <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Full Name" className="w-full border p-2" required />
            <input name="username" value={formData.username || ''} onChange={handleChange} placeholder="Username" className="w-full border p-2" required />
            <input name="email" type="email" value={formData.email || ''} onChange={handleChange} placeholder="Email" className="w-full border p-2" required />
            <input name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleChange} placeholder="Phone Number" className="w-full border p-2" />
            <select name="status" value={formData.status} onChange={handleChange} className="w-full border p-2">
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-4 flex gap-3 flex-wrap">
        {['User', 'Police', 'Prosecutor', 'Judge', 'Applications'].map((role) => (
          <button
            key={role}
            onClick={() => handleRoleChange(role)}
            className={`px-4 py-2 rounded ${selectedRole === role ? 'bg-orange-600 text-white' : 'bg-orange-300 text-black'}`}
          >
            Manage {role}
          </button>
        ))}
      </div>

      {selectedRole && selectedRole !== 'Applications' && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow-md mb-6">
          {error && <p className="text-red-600">{error}</p>}
          {renderForm()}
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border p-2"
            required={!formData.id}
          />
          <input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full border p-2"
            required={!formData.id}
          />
          <button type="submit" disabled={isLoading} className="w-full bg-orange-500 text-white py-2">
            {isLoading ? 'Processing...' : formData.id ? `Update ${selectedRole}` : `Create ${selectedRole}`}
          </button>
        </form>
      )}

      {users.length > 0 && <DataTable columns={columns} data={users} />}
    </div>
  );
};

function DataTable({ columns, data }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  return (
    <table {...getTableProps()} className="w-full border border-collapse">
      <thead className="bg-gray-100">
        {headerGroups.map((hg, i) => (
          <tr {...hg.getHeaderGroupProps()} key={i}>
            {hg.headers.map((col, j) => (
              <th {...col.getHeaderProps()} key={j} className="border p-2">{col.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={i}>
              {row.cells.map((cell, j) => (
                <td {...cell.getCellProps()} key={j} className="border p-2">
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default AdminPage;
