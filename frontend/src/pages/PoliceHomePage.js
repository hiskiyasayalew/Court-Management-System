import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PoliceHome = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [description, setDescription] = useState('');
  const [police, setPolice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/police/cases");
        setCases(response.data);
      } catch (err) {
        console.error("Error loading cases:", err);
        setError("Failed to load cases. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  useEffect(() => {
    const storedPolice = JSON.parse(localStorage.getItem("police"));
    if (storedPolice) {
      setPolice(storedPolice);
    }
  }, []);

 const handleAction = async (action) => {
  try {
    const baseUrl = `http://localhost:8080/api/police/${action}/${selectedCase.id}`;
    const param = action === "approve" ? "description" : "reason";
    const encodedDescription = encodeURIComponent(description);

    const url = `${baseUrl}?${param}=${encodedDescription}`;

    await axios.post(url); // No need to send JSON body

    alert(`Case ${action}d successfully.`);

    if (action === "approve") {
      navigate('/send-to-prosecutor', { state: { caseData: selectedCase } });
    } else {
      setCases(prev => prev.filter(c => c.id !== selectedCase.id));
      setSelectedCase(null);
      setDescription('');
    }
  } catch (err) {
    console.error(`Error ${action}ing case:`, err);
    alert(`Failed to ${action} case. Please try again.`);
  }
};


  const handleLogout = () => {
    localStorage.removeItem("police");
    navigate('/login/police');
  };

  const filteredCases = cases.filter(caseItem => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'approved' && caseItem.status === 'Approved') ||
                         (filter === 'rejected' && caseItem.status === 'Rejected');

    const matchesSearch = caseItem.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.caseType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.caseDescription.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const statusColors = {
    Approved: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800'
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f25c05] mx-auto mb-4"></div>
          <p className="text-gray-700">Loading cases...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#f25c05] hover:bg-[#d14e00] text-white font-semibold px-4 py-2 rounded transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-700">
              {police ? `Welcome, Officer ${police.officerName}` : "Police Dashboard"}
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredCases.length} {filteredCases.length === 1 ? 'case' : 'cases'} found
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate('/appliedandrejected')}
              className="bg-[#f25c05] hover:bg-[#d14e00] text-white px-4 py-2 rounded font-semibold transition text-sm sm:text-base"
            >
              Approved and Rejected 
            </button>
            <button
              onClick={handleLogout}
              className="bg-[#f25c05] hover:bg-[#d14e00] text-white px-4 py-2 rounded-lg shadow font-semibold transition"
            >
              Logout
            </button>
          </div>
        </motion.div>

        {/* Search and Filter Section */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search cases..."
              className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-3 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {['all'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  filter === f
                    ? 'bg-[#f25c05] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)} Cases
              </button>
            ))}
          </div>
        </div>

        {/* Case Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {filteredCases.map((c) => (
            <motion.div
              key={c.id}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg cursor-pointer border border-gray-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCase(c)}
              layout
            >
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-bold truncate">{c.fullName}</h2>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColors[c.status] || 'bg-gray-100 text-gray-800'}`}>
                  {c.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-1">{c.caseType}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(c.submittedAt).toLocaleDateString()}
              </p>
              <p className="mt-3 text-sm text-gray-700 line-clamp-2">
                {c.caseDescription}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Case Modal */}
        <AnimatePresence>
          {selectedCase && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">
                      {selectedCase.fullName}
                      <span className={`ml-3 text-xs sm:text-sm px-2 py-1 rounded-full ${statusColors[selectedCase.status] || 'bg-gray-100 text-gray-800'}`}>
                        {selectedCase.status}
                      </span>
                    </h2>
                    <button
                      onClick={() => {
                        setSelectedCase(null);
                        setDescription('');
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="text-gray-800">{selectedCase.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="text-gray-800">{selectedCase.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Incident Date</p>
                      <p className="text-gray-800">{selectedCase.dateOfIncident}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Case Type</p>
                      <p className="text-gray-800">{selectedCase.caseType}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-gray-500">Submitted At</p>
                      <p className="text-gray-800">
                        {new Date(selectedCase.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-gray-500">Case Description</p>
                    <p className="text-gray-800 whitespace-pre-wrap mt-1 p-3 bg-gray-50 rounded">
                      {selectedCase.caseDescription}
                    </p>
                  </div>

                  {(selectedCase.idCardUploadName || selectedCase.additionalFileNames?.length > 0) && (
                    <div className="mt-4">
                      <p className="text-gray-500 mb-2">Attachments</p>
                      <div className="space-y-2">
                        {selectedCase.idCardUploadName && (
                          <div className="flex items-center p-2 bg-gray-50 rounded">
                            <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <a
                              href={`http://localhost:8080/uploads/${encodeURIComponent(selectedCase.idCardUploadName)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline truncate"
                            >
                              {selectedCase.idCardUploadName}
                            </a>
                          </div>
                        )}
                        {selectedCase.additionalFileNames?.map((file, index) => (
                          <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                            <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <a
                              href={`http://localhost:8080/uploads/${file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline truncate"
                            >
                              {file}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <label className="block text-gray-700 mb-2">
                      Review Comments
                    </label>
                    <textarea
                      className="w-full h-24 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your review comments..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3 justify-end">
                    <button
                      onClick={() => handleAction('approve')}
                      className="bg-[#f25c05] hover:bg-[#d14e00] text-white px-4 py-2 rounded font-semibold transition"
                      disabled={!description.trim()}
                    >
                      Approve Case
                    </button>
                    <button
                      onClick={() => handleAction('reject')}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition"
                      disabled={!description.trim()}
                    >
                      Reject Case
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCase(null);
                        setDescription('');
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PoliceHome;
