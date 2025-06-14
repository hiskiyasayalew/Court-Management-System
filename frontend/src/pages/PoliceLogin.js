import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import loginImage from '../assets/polices.png'; // Adjust the path to your image

const PoliceLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement login logic or API call here
    alert(`Username: ${username}, Password: ${password}`);
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4 relative">
      <main className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-center gap-12">
        <section className="flex-shrink-0 max-w-md md:max-w-lg">
          <img src={loginImage} alt="Illustration" className="w-full h-auto" />
        </section>

        <section className="w-full max-w-sm">
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-6">
            Police Login
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
        </section>
      </main>
    </div>
  );
};

export default PoliceLogin;
