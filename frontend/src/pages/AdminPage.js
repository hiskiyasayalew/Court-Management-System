import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
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
  });
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const roleApiMap = {
    User: 'users',
    Police: 'police',
    Prosecutor: 'prosecutor',
    Judge: 'judge',
    Applications: 'applications',
  };

  const roleIcons = {
    User: '👤',
    Police: '👮',
    Prosecutor: '⚖️',
    Judge: '👨‍⚖️',
    Applications: '📩',
  };

  // Check if admin is logged in
useEffect(() => {
  setMessage('✅ Welcome, Admin! You are logged in.');
}, []);


  // Fetch users when role changes
  useEffect(() => {
    if (selectedRole) {
      fetchUsers(selectedRole);
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
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
      setError('Failed to fetch users');
      setUsers([]);
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
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
    const isEdit = formData.id !== '';
    const url = `http://localhost:8080/api/admin/${roleApiMap[selectedRole]}/${isEdit ? 'update' : 'create'}`;

    const payload = { ...formData };
    delete payload.confirmPassword;
    if (!payload.password) delete payload.password;
    if (!isEdit) delete payload.id;

    try {
      if (isEdit) {
        await axios.put(url, payload);
      } else {
        await axios.post(url, payload);
      }
      fetchUsers(selectedRole);
      setFormData({
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
      });
      setError('');
    } catch {
      setError('Failed to save user');
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
        setFormData({
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
        });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/admin/${roleApiMap[selectedRole]}/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      setError('Failed to delete user');
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
        { Header: 'Experience', accessor: 'workExperience' },
        {
          Header: 'Files',
          Cell: ({ row }) => (
            <div className="flex flex-col">
              {row.original.educationFiles?.map((file, idx) => (
                <a
                  key={idx}
                  href={`http://localhost:8080/uploads/${file}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline text-xs sm:text-sm"
                >
                  File {idx + 1}
                </a>
              ))}
            </div>
          ),
        },
      ];
    }

    const baseColumns = [
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
    ];

    // Don't show actions column for Applications
    if (selectedRole !== 'Applications') {
      baseColumns.push({
        Header: 'Actions',
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <button onClick={() => handleEdit(row.original)} className="text-blue-500 hover:underline">
              Edit
            </button>
            <button onClick={() => handleDelete(row.original.id)} className="text-red-500 hover:underline">
              Delete
            </button>
          </div>
        ),
      });
    }

    return baseColumns;
  }, [users, selectedRole]);

  const renderForm = () => {
    const inputClass = 'w-full border p-2 rounded';
    const fields = {
      User: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" className={inputClass} />
          <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className={inputClass} />
          <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className={inputClass} />
          <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" className={inputClass} />
          <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className={inputClass} />
          <input name="subCity" value={formData.subCity} onChange={handleChange} placeholder="Sub City" className={inputClass} />
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="sm:col-span-2" />
        </div>
      ),
      Police: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="officerName" value={formData.officerName} onChange={handleChange} placeholder="Officer Name" className={inputClass} />
          <input name="position" value={formData.position} onChange={handleChange} placeholder="Position" className={inputClass} />
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className={inputClass} />
          <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" className={inputClass} />
          <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" className="sm:col-span-2" />
        </div>
      ),
      Prosecutor: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className={inputClass} />
          <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" className={inputClass} />
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className={inputClass} />
          <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" className={inputClass} />
          <select name="status" value={formData.status} onChange={handleChange} className="sm:col-span-2">
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
      ),
      Judge: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className={inputClass} />
          <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" className={inputClass} />
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className={inputClass} />
          <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" className={inputClass} />
          <select name="status" value={formData.status} onChange={handleChange} className="sm:col-span-2">
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
      ),
    };
    return fields[selectedRole] || null;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-md">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isSidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/adminlogin');
          }}
          className="bg-red-500 text-white px-4 py-2 rounded mb-4"
        >
          Logout
        </button>
        <div className="space-y-2">
          {Object.keys(roleApiMap).map((role) => (
            <button
              key={role}
              onClick={() => handleRoleChange(role)}
              className={`w-full flex items-center px-4 py-2 rounded transition ${
                selectedRole === role ? 'bg-orange-500 text-white' : 'hover:bg-orange-100'
              }`}
            >
              <span className="mr-2">{roleIcons[role]}</span> {role}
            </button>
          ))}
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">{selectedRole ? `Manage ${selectedRole}` : 'Select a Role'}</h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {selectedRole && selectedRole !== 'Applications' && (
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4 mb-6">
            {renderForm()}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full border p-2 rounded text-sm sm:text-base"
                required={!formData.id}
              />
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full border p-2 rounded text-sm sm:text-base"
                required={!formData.id}
              />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:opacity-70">
              {isLoading ? 'Processing...' : formData.id ? `Update ${selectedRole}` : `Create ${selectedRole}`}
            </button>
          </form>
        )}

        {users.length > 0 && <DataTable columns={columns} data={users} />}
      </div>
    </div>
  );
};

const DataTable = ({ columns, data }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table {...getTableProps()} className="w-full border-collapse">
        <thead className="bg-gray-100">
          {headerGroups.map((hg, i) => (
            <tr {...hg.getHeaderGroupProps()} key={i}>
              {hg.headers.map((col, j) => (
                <th {...col.getHeaderProps()} key={j} className="p-2 border">
                  {col.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={i} className="hover:bg-gray-50 even:bg-gray-50">
                {row.cells.map((cell, j) => (
                  <td {...cell.getCellProps()} key={j} className="p-2 border text-xs sm:text-sm">
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;