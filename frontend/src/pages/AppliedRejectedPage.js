import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AppliedRejectedPage = () => {
  const navigate = useNavigate();
  const [approvedCases, setApprovedCases] = useState([]);
  const [rejectedCases, setRejectedCases] = useState([]);
  const [view, setView] = useState('approved'); // Track the current view

  useEffect(() => {
    // Fetch approved cases
    fetch("http://localhost:8080/api/police/approved-cases")
      .then(res => res.json())
      .then(setApprovedCases)
      .catch(err => console.error("Error loading approved cases:", err));

    // Fetch rejected cases
    fetch("http://localhost:8080/api/police/rejected-cases")
      .then(res => res.json())
      .then(setRejectedCases)
      .catch(err => console.error("Error loading rejected cases:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">Applied and Rejected Cases</h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setView('approved')}
          className={`mr-2 ${view === 'approved' ? 'bg-[#f25c05]' : 'bg-gray-300'} text-white px-4 py-2 rounded transition duration-300`}
        >
          Approved
        </button>
        <button
          onClick={() => setView('rejected')}
          className={`${view === 'rejected' ? 'bg-[#f25c05]' : 'bg-gray-300'} text-white px-4 py-2 rounded transition duration-300`}
        >
          Rejected
        </button>
      </div>

      {view === 'approved' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {approvedCases.length === 0 ? (
            <p className="text-center text-gray-600">No approved cases.</p>
          ) : (
            <div>
              {approvedCases.map((c) => (
                <motion.div
                  key={c.id}
                  className="bg-white p-4 rounded-lg shadow-md mb-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h2 className="text-xl font-bold">{c.fullName}</h2>
                  <p className="text-gray-600">{c.caseType}</p>
                  <p className="text-sm text-gray-500">{new Date(c.submittedAt).toLocaleString()}</p>
                </motion.div>
              ))}
              <motion.button
                onClick={() => navigate('/policeform')}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                whileHover={{ scale: 1.05 }}
              >
                Send to Prosecutor
              </motion.button>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {rejectedCases.length === 0 ? (
            <p className="text-center text-gray-600">No rejected cases.</p>
          ) : (
            <div>
              {rejectedCases.map((c) => (
                <motion.div
                  key={c.id}
                  className="bg-white p-4 rounded-lg shadow-md mb-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h2 className="text-xl font-bold">{c.fullName}</h2>
                  <p className="text-gray-600">{c.caseType}</p>
                  <p className="text-sm text-gray-500">{new Date(c.submittedAt).toLocaleString()}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AppliedRejectedPage;