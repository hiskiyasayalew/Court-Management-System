import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const JudgeLogin= () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement login logic or API call here
    alert(`Username: ${username}, Password: ${password}`);
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4">
      <main className="max-w-md w-full">
        <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-6">
          Judge Login
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full border-b border-gray-300 pb-2"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border-b border-gray-300 pb-2"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-400 text-white py-2 rounded mt-4 hover:bg-blue-500 transition"
          >
            Sign in
          </button>
        </form>
        <p className="text-xs text-gray-700 mt-6">
          No account?{' '}
          <Link to="/applyform" className="text-blue-500 font-semibold hover:underline">
            Contact Admin
          </Link>
        </p>
      </main>
    </div>
  );
};

export default JudgeLogin;
