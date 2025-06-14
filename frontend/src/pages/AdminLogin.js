import React, { useState } from 'react';

const AdminLogin= () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Replace with real authentication logic
    alert(`Admin Login Attempt:\nUsername: ${username}\nPassword: ${password}`);
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-6">
      <main className="max-w-md w-full">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Admin Login</h1>
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="username" className="block font-medium text-gray-700 mb-1">
              Username <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-medium text-gray-700 mb-1">
              Password <span className="text-red-600">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md text-lg font-semibold hover:bg-indigo-700 transition"
          >
           Log In
          </button>
        </form>
      </main>
    </div>
  );
};

export default AdminLogin;
