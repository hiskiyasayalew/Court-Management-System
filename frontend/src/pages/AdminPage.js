import React, { useState } from 'react';
import { useTable } from 'react-table';

const AdminPage = () => {
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
  const [users, setUsers] = useState([]);
  const [loginRequests, setLoginRequests] = useState([]);
  const [showLoginRequests, setShowLoginRequests] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        id: users.length + 1,
        ...formData,
        role: selectedRole.replace(/Add|Edit/, '')
      };
      
      if (selectedRole.startsWith('Edit')) {
        setUsers(users.map(user => user.id === newUser.id ? newUser : user));
        alert("User updated successfully");
      } else {
        setUsers([...users, newUser]);
        alert("User added successfully");
      }
      
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
      
      setSelectedRole(selectedRole.replace(/Add|Edit/, ''));
    } catch (err) {
      console.error(err);
      setError("Failed to save user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setFormData({ ...formData, role });
    setShowLoginRequests(false);
  };

  const filteredUsers = users.filter(user =>
    (user.userName?.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (user.id?.toString().includes(searchTerm.toLowerCase()))
  );

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Username', accessor: 'userName' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Role', accessor: 'role' },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleEdit(row.values.id)} 
            className="text-blue-600 hover:text-blue-800 text-sm sm:text-base"
          >
            Edit
          </button>
          <button 
            onClick={() => handleDelete(row.values.id)} 
            className="text-red-600 hover:text-red-800 text-sm sm:text-base"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleEdit = (id) => {
    const userToEdit = users.find(user => user.id === id);
    if (userToEdit) {
      setFormData({ ...userToEdit, confirmPassword: userToEdit.password });
      setSelectedRole(`Edit${userToEdit.role}`);
    }
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
    setShowLoginRequests(true);
  };

  const handleApprove = (id) => {
    alert(`Approved request from user with ID: ${id}`);
    setLoginRequests(loginRequests.filter(request => request.id !== id));
  };

  const handleReject = (id) => {
    if (window.confirm("Are you sure you want to reject this request?")) {
      alert(`Rejected request from user with ID: ${id}`);
      setLoginRequests(loginRequests.filter(request => request.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          onClick={() => handleRoleChange('User')} 
          className={`px-3 py-2 text-sm sm:text-base rounded-md ${selectedRole === 'User' ? 'bg-[#d14e00]' : 'bg-[#f25c05]'} text-white hover:bg-[#d14e00] transition`}
        >
          Manage Users
        </button>
        <button 
          onClick={() => handleRoleChange('Police')} 
          className={`px-3 py-2 text-sm sm:text-base rounded-md ${selectedRole === 'Police' ? 'bg-[#d14e00]' : 'bg-[#f25c05]'} text-white hover:bg-[#d14e00] transition`}
        >
          Manage Police
        </button>
        <button 
          onClick={() => handleRoleChange('Prosecutor')} 
          className={`px-3 py-2 text-sm sm:text-base rounded-md ${selectedRole === 'Prosecutor' ? 'bg-[#d14e00]' : 'bg-[#f25c05]'} text-white hover:bg-[#d14e00] transition`}
        >
          Manage Prosecutors
        </button>
        <button 
          onClick={() => handleRoleChange('Judge')} 
          className={`px-3 py-2 text-sm sm:text-base rounded-md ${selectedRole === 'Judge' ? 'bg-[#d14e00]' : 'bg-[#f25c05]'} text-white hover:bg-[#d14e00] transition`}
        >
          Manage Judges
        </button>
        <button 
          onClick={viewLoginRequests} 
          className="px-3 py-2 text-sm sm:text-base bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
        >
          View Login Requests
        </button>
      </div>

      {selectedRole && !showLoginRequests && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
            {selectedRole.startsWith('Add') || selectedRole.startsWith('Edit') 
              ? `${selectedRole.startsWith('Add') ? 'Add' : 'Edit'} ${selectedRole.replace(/Add|Edit/, '')}` 
              : `Manage ${selectedRole}s`}
          </h2>

          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              placeholder="Search by name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f25c05]"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
              Search
            </button>
          </div>

          {(selectedRole.startsWith('Add') || selectedRole.startsWith('Edit')) && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input 
                    type="text" 
                    name="userName" 
                    value={formData.userName} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f25c05]" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f25c05]" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f25c05]" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword" 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f25c05]" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input 
                    type="text" 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f25c05]" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f25c05]" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phoneNumber" 
                    value={formData.phoneNumber} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f25c05]" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input 
                    type="text" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f25c05]" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub City</label>
                  <input 
                    type="text" 
                    name="subCity" 
                    value={formData.subCity} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f25c05]" 
                    required 
                  />
                </div>
                
                {['Police', 'Judge', 'Prosecutor'].includes(selectedRole.replace(/Add|Edit/, '')) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                    <select 
                      name="educationLevel" 
                      value={formData.educationLevel} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f25c05]" 
                      required
                    >
                      <option value="">Select Education Level</option>
                      <option value="BSc">BSc</option>
                      <option value="Masters">Masters</option>
                      <option value="PhD">PhD</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full bg-[#f25c05] text-white font-semibold py-2 rounded-md hover:bg-[#d14e00] transition flex justify-center items-center ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {selectedRole.startsWith('Add') ? 'Adding...' : 'Updating...'}
                  </>
                ) : (
                  selectedRole.startsWith('Add') ? 'Add User' : 'Update User'
                )}
              </button>
            </form>
          )}

          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">User List</h3>
              {!selectedRole.startsWith('Add') && !selectedRole.startsWith('Edit') && (
                <button 
                  onClick={() => setSelectedRole(`Add${selectedRole}`)} 
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  Add {selectedRole}
                </button>
              )}
            </div>
            
            <div className="overflow-x-auto">
              <Table columns={columns} data={filteredUsers} />
            </div>
          </div>
        </div>
      )}

      {showLoginRequests && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Login Requests</h2>
            <button 
              onClick={() => setShowLoginRequests(false)} 
              className="text-sm sm:text-base text-gray-600 hover:text-gray-800"
            >
              Back to Dashboard
            </button>
          </div>
          
          {loginRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <Table 
                columns={[
                  { Header: 'ID', accessor: 'id' },
                  { Header: 'Full Name', accessor: 'fullName' },
                  { Header: 'Email', accessor: 'email' },
                  { Header: 'Phone', accessor: 'phone' },
                  { Header: 'Role', accessor: 'role' },
                  { 
                    Header: 'Actions', 
                    Cell: ({ row }) => (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleApprove(row.values.id)} 
                          className="text-green-600 hover:text-green-800 text-sm sm:text-base"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReject(row.values.id)} 
                          className="text-red-600 hover:text-red-800 text-sm sm:text-base"
                        >
                          Reject
                        </button>
                      </div>
                    )
                  }
                ]} 
                data={loginRequests} 
              />
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No login requests found</p>
          )}
        </div>
      )}
    </div>
  );
};

const Table = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <div className="overflow-x-auto">
      <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th 
                  {...column.getHeaderProps()} 
                  className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
          {rows.length > 0 ? (
            rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="hover:bg-gray-50">
                  {row.cells.map(cell => (
                    <td 
                      {...cell.getCellProps()} 
                      className="px-4 py-3 whitespace-nowrap text-sm sm:text-base text-gray-700"
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-4 py-4 text-center text-sm text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;