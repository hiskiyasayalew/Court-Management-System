import React from 'react';

const ProsecutorHome = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded shadow-lg text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Welcome, Prosecutor</h1>
        <p className="text-gray-700 text-md">
          This is your home page. Future functionality like viewing cases forwarded by police will be shown here.
        </p>
      </div>
    </div>
  );
};

export default ProsecutorHome;
