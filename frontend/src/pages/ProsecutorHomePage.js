import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProsecutorHomePage = () => {
  const [cases, setCases] = useState([]);
  const [appealedCases, setAppealedCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [prosecutor, setProsecutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("prosecutor"));
    if (stored) setProsecutor(stored);
  }, []);

  useEffect(() => {
    if (!prosecutor) return;

    const fetchCases = async () => {
      try {
        const [casesRes, appealsRes] = await Promise.all([
          fetch(`http://localhost:8080/api/prosecutor/prosecutor-cases?username=${prosecutor.username}`),
          fetch(`http://localhost:8080/api/prosecutor/appeals?username=${prosecutor.username}`)
        ]);

        const caseData = await casesRes.json();
        const appealData = await appealsRes.json();

        if (!casesRes.ok || !appealsRes.ok) throw new Error("Error loading data");

        const normalCases = caseData.filter(
          c => c.status === "SUBMITTED_TO_PROCESS" || c.status === "SENT_TO_PROSECUTOR"
        );

        setCases(normalCases);
        setAppealedCases(appealData);
      } catch (error) {
        console.error("Failed to load cases or appeals:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [prosecutor]);

  const deleteCase = async (caseId) => {
    if (!window.confirm("Are you sure you want to delete this case?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/cases/${caseId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete case");

      setCases(prev => prev.filter(c => c.id !== caseId));
      setAppealedCases(prev => prev.filter(c => c.id !== caseId));
      setSelectedCase(null);
    } catch (err) {
      alert("Failed to delete case");
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("prosecutor");
    navigate("/login/prosecutor");
  };
  
  const handleProsecutorAction = async (action) => {
    try {
      let url;

      if (selectedCase.caseId) {
        url = `http://localhost:8080/api/appeals/${selectedCase.id}/${action}`;
        if (action === "reject") url += `?reason=No+reason`;
        if (action === "approve") url += `?description=Approved`;
      } else {
        url = `http://localhost:8080/api/prosecutor/${action}/${selectedCase.id}`;
        if (action === "reject") url += `?reason=No+reason`;
        if (action === "approve") url += `?description=Approved`;
      }

      const res = await fetch(url, { method: "POST" });
      if (!res.ok) throw new Error("Failed to process case");

      alert(`Case ${action}d successfully`);

      setCases(prev => prev.filter(c =>
        c.id !== selectedCase.id && c.id !== selectedCase.caseId
      ));
      setAppealedCases(prev => prev.filter(c => c.id !== selectedCase.id));

      if (action === "approve") {
        if (selectedCase.caseId) {
          navigate("/send-to-judge", {
            state: { caseData: { ...selectedCase, id: selectedCase.caseId } }
          });
        } else {
          navigate("/send-to-judge", { state: { caseData: selectedCase } });
        }
      } else {
        setSelectedCase(null);
      }

    } catch (err) {
      alert(err.message);
    }
  };

  const filteredCases = cases.filter(c =>
    c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.caseType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.caseDescription?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAppealedCases = appealedCases.filter(a =>
    a.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.caseId + "").includes(searchTerm)
  );

  const statusColors = {
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
    SENT_TO_PROSECUTOR: "bg-yellow-100 text-yellow-800"
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <motion.h1
            className="text-2xl sm:text-3xl font-bold text-blue-700"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {prosecutor ? `Welcome, Prosecutor ${prosecutor.name}` : "Prosecutor Dashboard"}
          </motion.h1>

          <button
            onClick={handleLogout}
            className="bg-[#f25c05] hover:bg-[#d14e00] text-white px-4 py-2 rounded font-semibold transition text-sm sm:text-base"
          >
            Logout
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, type, description, or ID..."
            className="w-full max-w-md p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Submitted Cases */}
        <h2 className="text-xl font-bold mb-4 text-gray-800">Submitted Cases</h2>
        {filteredCases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {filteredCases.map(c => (
              <motion.div
                key={c.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer border border-gray-200"
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedCase(c)}
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-base sm:text-lg font-semibold truncate">{c.fullName}</h2>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColors[c.status] || "bg-gray-100 text-gray-800"}`}>
                    {c.status}
                  </span>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">{c.caseType}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {c.submittedAt ? new Date(c.submittedAt).toLocaleDateString() : "—"}
                </p>
                <p className="mt-3 text-xs sm:text-sm text-gray-700 line-clamp-2">{c.caseDescription}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 italic mb-10">No submitted cases found</div>
        )}

        {/* Appealed Cases */}
        <h2 className="text-xl font-bold mb-4 text-gray-800">Appealed Cases</h2>
        {filteredAppealedCases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAppealedCases.map(appeal => (
              <motion.div
                key={appeal.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer border border-yellow-300"
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedCase(appeal)}
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-base sm:text-lg font-semibold truncate">{appeal.userName}</h2>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColors[appeal.status] || "bg-gray-100 text-gray-800"}`}>
                    {appeal.status}
                  </span>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">Appealed Case ID: {appeal.caseId}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {appeal.submittedAt ? new Date(appeal.submittedAt).toLocaleDateString() : "—"}
                </p>
                <p className="mt-3 text-xs sm:text-sm text-gray-700 line-clamp-2">{appeal.reason}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 italic">No appealed cases found</div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {selectedCase && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-4 sm:p-6 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <h2 className="text-xl font-bold mb-2">{selectedCase.fullName || selectedCase.userName}</h2>
                <p className="text-sm text-gray-600 mb-2">{selectedCase.caseType || `Appealed Case ID: ${selectedCase.caseId}`}</p>
                <p className="text-sm text-gray-700 mb-4">{selectedCase.caseDescription || selectedCase.reason}</p>

                <div className="mt-4 flex flex-col sm:flex-row flex-wrap gap-2 justify-between">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleProsecutorAction("approve")}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded font-semibold transition text-xs sm:text-sm"
                    >
                      Approve & Forward
                    </button>
                    <button
                      onClick={() => handleProsecutorAction("reject")}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded font-semibold transition text-xs sm:text-sm"
                    >
                      Reject
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => setSelectedCase(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded font-semibold transition text-xs sm:text-sm"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => deleteCase(selectedCase.id)}
                      className="bg-red-700 hover:bg-red-800 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded font-semibold transition text-xs sm:text-sm"
                    >
                      Delete
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

export default ProsecutorHomePage;