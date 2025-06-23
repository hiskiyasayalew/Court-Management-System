import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const PoliceHome = () => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetch("http://localhost:8080/api/police/cases")
      .then(res => res.json())
      .then(setCases)
      .catch(err => console.error("Error loading cases:", err));
  }, []);

  const handleAction = async (action) => {
    const url = `http://localhost:8080/api/police/${action}/${selectedCase.id}?${action === "approve" ? "description" : "reason"}=${encodeURIComponent(description)}`;
    const response = await fetch(url, { method: "POST" });
    if (response.ok) {
      alert(`Case ${action}d successfully.`);
      setCases(prev => prev.filter(c => c.id !== selectedCase.id));
      setSelectedCase(null);
      setDescription('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">Police Dashboard</h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {cases.map((c) => (
          <motion.div
            key={c.id}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl cursor-pointer border border-gray-300"
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedCase(c)}
          >
            <h2 className="text-xl font-bold">{c.fullName}</h2>
            <p className="text-gray-600">{c.caseType}</p>
            <p className="text-sm text-gray-500">{new Date(c.submittedAt).toLocaleString()}</p>
            <p className="mt-2 font-semibold text-orange-600">{c.status}</p>
          </motion.div>
        ))}
      </motion.div>

      {selectedCase && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-2">{selectedCase.fullName}</h2>
            <p className="text-gray-700 mb-2">{selectedCase.caseDescription}</p>
            <textarea
              className="w-full h-24 p-2 border mt-2 rounded"
              placeholder="Write your review/feedback..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={() => handleAction('approve')}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction('reject')}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  setSelectedCase(null);
                  setDescription('');
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PoliceHome;
