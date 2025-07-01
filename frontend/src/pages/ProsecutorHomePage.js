import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProsecutorHomePage = () => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [description, setDescription] = useState("");
  const [prosecutor, setProsecutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load prosecutor info from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("prosecutor"));
    if (stored) setProsecutor(stored);
  }, []);

  // Load cases assigned to prosecutor
  useEffect(() => {
    if (!prosecutor) return;
    
    const fetchCases = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/prosecutor/prosecutor-cases?username=${prosecutor.username}`
        );
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message || "Failed to load cases");
        
        setCases(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load cases:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCases();
  }, [prosecutor]);

  // Delete case
  const deleteCase = async (caseId) => {
    if (!window.confirm("Are you sure you want to delete this case?")) return;
    
    try {
      const res = await fetch(`http://localhost:8080/api/cases/${caseId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete case");
      setCases((cases) => cases.filter((c) => c.id !== caseId));
      setSelectedCase(null);
    } catch (err) {
      console.error("Error deleting case:", err);
      alert("Failed to delete case");
    }
  };

  // Approve or reject case handler
  const handleProsecutorAction = async (action) => {
    if (!selectedCase) return;
    if (!description.trim()) {
      alert("Please provide your feedback or reason.");
      return;
    }

    try {
      const queryParam = action === "approve" ? "description" : "reason";
      const endpoint = `http://localhost:8080/api/prosecutor/${action}/${selectedCase.id}?${queryParam}=${encodeURIComponent(
        description
      )}`;

      const res = await fetch(endpoint, { method: "POST" });
      if (!res.ok) throw new Error("Failed to process case");

      alert(`Case ${action}d successfully.`);
      setCases((cases) => cases.filter((c) => c.id !== selectedCase.id));
      
      if (action === "approve") {
        navigate("/send-to-judge", { state: { caseData: selectedCase } });
      } else {
        setSelectedCase(null);
        setDescription("");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800"
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f25c05] mx-auto mb-4"></div>
          <p className="text-gray-700">Loading cases...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#f25c05] hover:bg-[#d14e00] text-white font-semibold px-4 py-2 rounded transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          className="text-2xl sm:text-3xl font-bold mb-6 text-center text-blue-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {prosecutor
            ? `Welcome, Prosecutor ${prosecutor.name}`
            : "Prosecutor Dashboard"}
        </motion.h1>

        {!selectedCase ? (
          cases.length > 0 ? (
            <motion.div
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {cases.map((c) => (
                <motion.div
                  key={c.id}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer border border-gray-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCase(c)}
                  layout
                >
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold truncate">{c.fullName}</h2>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[c.status] || "bg-gray-100 text-gray-800"}`}>
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
          ) : (
            <motion.div
              className="bg-white p-8 rounded-xl shadow text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-500 text-lg">No cases assigned to you</p>
            </motion.div>
          )
        ) : (
          <AnimatePresence>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">
                    {selectedCase.fullName}
                    <span className={`ml-3 text-xs sm:text-sm px-2 py-1 rounded-full ${statusColors[selectedCase.status] || "bg-gray-100 text-gray-800"}`}>
                      {selectedCase.status}
                    </span>
                  </h2>
                  <button
                    onClick={() => setSelectedCase(null)}
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

                {/* File Attachments */}
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

                {/* Review Textarea */}
                <div className="mt-6">
                  <label className="block text-gray-700 mb-2">
                    {selectedCase.status === 'Pending' ? 'Review Comments' : 'Additional Notes'}
                  </label>
                  <textarea
                    className="w-full h-24 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={
                      selectedCase.status === 'Pending' 
                        ? 'Enter your review comments...' 
                        : 'Enter additional notes...'
                    }
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-wrap gap-3 justify-between">
                  <div className="flex gap-3">
                    {selectedCase.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleProsecutorAction("approve")}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition"
                          disabled={!description.trim()}
                        >
                          Approve & Forward
                        </button>
                        <button
                          onClick={() => handleProsecutorAction("reject")}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition"
                          disabled={!description.trim()}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedCase(null)}
                      className="bg-[#f25c05] hover:bg-[#d14e00] text-white px-4 py-2 rounded font-semibold transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => deleteCase(selectedCase.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition"
                    >
                      Delete Case
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default ProsecutorHomePage;