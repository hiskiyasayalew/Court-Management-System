import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginImage from '../assets/polices.png';

const PoliceLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/police/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
      }

      const policeData = await response.json();
      localStorage.setItem('police', JSON.stringify(policeData));
      navigate('/police-home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4">
      <main className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-center gap-12">
        <section className="flex-shrink-0 max-w-md md:max-w-lg">
          <img src={loginImage} alt="Illustration" className="w-full h-auto" />
        </section>

        <section className="w-full max-w-sm">
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-6">Police Login</h1>
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
              className="w-full bg-[#f25c05] hover:bg-[#d14e00] text-white py-2 rounded mt-4 font-semibold transition"
            >
              Sign in
            </button>
          </form>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </section>
      </main>
    </div>
  );
};

export default PoliceLogin;
