import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProsecutorHomePage = () => {
  const [cases, setCases] = useState([]);
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
        const res = await fetch(`http://localhost:8080/api/prosecutor/prosecutor-cases?username=${prosecutor.username}`);
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

  const deleteCase = async (caseId) => {
    if (!window.confirm("Are you sure you want to delete this case?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/cases/${caseId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete case");
      setCases((prev) => prev.filter((c) => c.id !== caseId));
      setSelectedCase(null);
    } catch (err) {
      alert("Failed to delete case");
    }
  };

  const handleProsecutorAction = async (action) => {
  try {
    let url = `http://localhost:8080/api/prosecutor/${action}/${selectedCase.id}`;
    if (action === "reject") {
      url += `?reason=No+reason`;
    }

    const res = await fetch(url, { method: "POST" });
    if (!res.ok) throw new Error("Failed to process case");

    alert(`Case ${action}d successfully`);
    setCases((prev) => prev.filter((c) => c.id !== selectedCase.id));
    if (action === "approve") {
      navigate("/send-to-judge", { state: { caseData: selectedCase } });
    } else {
      setSelectedCase(null);
    }
  } catch (err) {
    alert(err.message);
  }
};


  const statusColors = {
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };

  const filteredCases = cases.filter((caseItem) =>
    caseItem.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.caseType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.caseDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          {prosecutor ? `Welcome, Prosecutor ${prosecutor.name}` : "Prosecutor Dashboard"}
        </motion.h1>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, type, or description..."
            className="w-full max-w-md p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {!selectedCase ? (
          filteredCases.length > 0 ? (
            <motion.div
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {filteredCases.map((c) => (
                <motion.div
                  key={c.id}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer border border-gray-200"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedCase(c)}
                >
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold truncate">{c.fullName}</h2>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[c.status] || "bg-gray-100 text-gray-800"}`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{c.caseType}</p>
                  <p className="text-xs text-gray-500 mt-2">{new Date(c.submittedAt).toLocaleDateString()}</p>
                  <p className="mt-3 text-sm text-gray-700 line-clamp-2">{c.caseDescription}</p>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="bg-white p-8 rounded-xl shadow text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-500 text-lg">No cases found</p>
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
                <h2 className="text-xl font-bold mb-2">{selectedCase.fullName}</h2>

                <div className="mt-4 flex flex-wrap gap-2 justify-between">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleProsecutorAction("approve")}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition"
                    >
                      Approve & Forward
                    </button>
                    <button
                      onClick={() => handleProsecutorAction("reject")}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition"
                    >
                      Reject
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedCase(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => deleteCase(selectedCase.id)}
                      className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded font-semibold transition"
                    >
                      Delete
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
