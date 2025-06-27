import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginimage from '../assets/lawsymbol2.webp';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { login } from '../api'; // Make sure this calls your backend login API and returns full user data

const Login = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await login(username, password); // Assumes API returns user object like { userName, email, ... }
      localStorage.setItem("user", JSON.stringify(user)); // ✅ Store full user object
      alert(t.loginsucess);
      navigate('/Home');
    } catch (error) {
      console.error("Login failed:", error);
      alert(t.invalidlogin);
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4 relative">
      <LanguageSwitcher />
      <main className="max-w-6xl w-full flex flex-col md:flex-row items-center md:items-start justify-center gap-12 md:gap-24">
        {/* Left side image */}
        <section className="flex-shrink-0 max-w-md md:max-w-lg">
          <img src={loginimage} alt="Illustration" className="w-full h-auto" />
        </section>

        {/* Right side login form */}
        <section className="w-full max-w-sm">
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-6">
            {t.loginTitle}
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t.usernameOrEmail}
              className="w-full border-b border-gray-300 pb-2"
              required
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.password}
              className="w-full border-b border-gray-300 pb-2"
              required
            />

            <div className="flex justify-between text-sm text-blue-500">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                {t.rememberMe}
              </label>
              {/* <Link to="/forgot-password" className="hover:underline">
                {t.forgotPassword}
              </Link> */}
            </div>

            {/* ✅ Updated button style to match AdminLogin */}
            <button
              type="submit"
              className="w-full bg-[#f25c05] text-white py-2 rounded mt-4 text-lg font-semibold hover:bg-[#d14e00] transition"
            >
              {t.login}
            </button>
          </form>

          <p className="text-xs text-gray-700 mt-6">
            {t.dontHaveAccount}{' '}
            <Link to="/signup" className="text-blue-500 font-semibold hover:underline">
              {t.signup}
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
};

export default Login;
