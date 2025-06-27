import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { register } from '../api'; // Keep your existing imports
import { useTable } from 'react-table';
import ApplyForm from './ApplyForm'; // Import your ApplyForm component

const AdminPage = () => {
  const { t } = useLanguage();
  const [selectedRole, setSelectedRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    city: '',
    subCity: '',
    role: '',
    educationLevel: ''
  });
  const [users, setUsers] = useState([]); // Replace with actual user data
  const [loginRequests, setLoginRequests] = useState([]); // For storing login requests
  const [showLoginRequests, setShowLoginRequests] = useState(false); // State for controlling login requests view

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert(t.passwordMismatch);
      return;
    }

    try {
      await register(formData);
      alert(t.signupSuccess);
      setFormData({
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        city: '',
        subCity: '',
        role: '',
        educationLevel: ''
      });
    } catch (err) {
      console.error(err);
      alert(t.signupFail);
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setFormData({ ...formData, role });
    setShowLoginRequests(false); // Hide login requests when changing roles
  };

  const filteredUsers = users.filter(user =>
    user.userName.includes(searchTerm) || user.id.includes(searchTerm)
  );

  const columns = [
    {
      Header: 'User Name',
      accessor: 'userName',
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        <button onClick={() => handleDelete(row.values.id)} className="text-red-600">Delete</button>
      ),
    },
  ];

  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const viewLoginRequests = () => {
    const requests = [
      {
        id: 1,
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        address: '123 Main St',
        role: 'Police',
        reason: 'To serve and protect',
        education: 'BSc in Criminal Justice',
        workExperience: '5 years in law enforcement',
        additionalInfo: 'N/A'
      },
      {
        id: 2,
        fullName: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '987-654-3210',
        address: '456 Elm St',
        role: 'Judge',
        reason: 'To uphold justice',
        education: 'JD from XYZ University',
        workExperience: '10 years as a lawyer',
        additionalInfo: 'N/A'
      }
    ];
    setLoginRequests(requests);
    setShowLoginRequests(true); // Show the login requests table
  };

  const handleApprove = (id) => {
    alert(`Approved request from user with ID: ${id}`);
    setLoginRequests(loginRequests.filter(request => request.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <LanguageSwitcher />
      <h1 className="text-4xl font-bold mb-6">Admin Page</h1>

      <div className="flex mb-4">
        <button onClick={() => handleRoleChange('User')} className="mr-4 bg-[#f25c05] text-white px-4 py-2 rounded hover:bg-[#d14e00]">Manage Users</button>
        <button onClick={() => handleRoleChange('Police')} className="mr-4 bg-[#f25c05] text-white px-4 py-2 rounded hover:bg-[#d14e00]">Manage Police</button>
        <button onClick={() => handleRoleChange('Prosecutor')} className="mr-4 bg-[#f25c05] text-white px-4 py-2 rounded hover:bg-[#d14e00]">Manage Prosecutors</button>
        <button onClick={() => handleRoleChange('Judge')} className="bg-[#f25c05] text-white px-4 py-2 rounded hover:bg-[#d14e00]">Manage Judges</button>
        <button onClick={viewLoginRequests} className="ml-4 bg-purple-500 text-white px-4 py-2 rounded">View Login Requests</button>
      </div>

      {selectedRole && !showLoginRequests && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Manage {selectedRole}s</h2>

          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Search by name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 w-full"
            />
            <button className="bg-blue-400 text-white ml-2 px-4 py-2 rounded">Search</button>
          </div>

          <button onClick={() => setSelectedRole(`Add${selectedRole}`)} className="mb-4 bg-blue-400 text-white px-4 py-2 rounded">Add {selectedRole}</button>

          {selectedRole.startsWith('Add') && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-4">
              <input type="text" name="userName" value={formData.userName} onChange={handleChange} placeholder="Username" className="w-full border-b pb-2" required />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full border-b pb-2" required />
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full border-b pb-2" required />
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className="w-full border-b pb-2" required />
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="w-full border-b pb-2" required />
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="w-full border-b pb-2" required />
              <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" className="w-full border-b pb-2" required />
              <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full border-b pb-2" required />
              <input type="text" name="subCity" value={formData.subCity} onChange={handleChange} placeholder="Sub City" className="w-full border-b pb-2" required />
              
              {/* Dropdown for Education Level */}
              {['Police', 'Judge', 'Prosecutor'].includes(selectedRole.replace('Add', '')) && (
                <select name="educationLevel" value={formData.educationLevel} onChange={handleChange} className="w-full border-b pb-2" required>
                  <option value="">Select Education Level</option>
                  <option value="BSc">BSc</option>
                  <option value="Masters">Masters</option>
                  <option value="PhD">PhD</option>
                  <option value="Other">Other</option>
                </select>
              )}

              <button type="submit" className="w-full bg-blue-400 text-white font-semibold py-2 rounded mt-4">Add {selectedRole.replace('Add', '')}</button>
            </form>
          )}

          <div className="mt-4">
            <h3 className="text-xl font-bold mb-2">User List</h3>
            <Table columns={columns} data={filteredUsers} />
          </div>
        </div>
      )}

      {/* Login Requests Section */}
      {showLoginRequests && loginRequests.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-2xl font-bold mb-4">Login Requests</h2>
          <Table columns={[
            { Header: 'Full Name', accessor: 'fullName' },
            { Header: 'Email', accessor: 'email' },
            { Header: 'Phone', accessor: 'phone' },
            { Header: 'Address', accessor: 'address' },
            { Header: 'Role', accessor: 'role' },
            { Header: 'Actions', Cell: ({ row }) => <button onClick={() => handleApprove(row.values.id)}>Approve</button> }
          ]} data={loginRequests} />
        </div>
      )}
    </div>
  );
};

// Table component
const Table = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <table {...getTableProps()} className="w-full border-collapse border border-gray-300">
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()} className="border border-gray-300 p-2 bg-gray-200">{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()} className="border border-gray-300 p-2">{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default AdminPage;