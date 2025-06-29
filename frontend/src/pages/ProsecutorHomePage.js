import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProsecutorHomePage = () => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [description, setDescription] = useState("");
  const [prosecutor, setProsecutor] = useState(null);
  const navigate = useNavigate();

  // Load prosecutor info from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("prosecutor"));
    if (stored) setProsecutor(stored);
  }, []);

  // Load cases assigned to prosecutor
  useEffect(() => {
    if (!prosecutor) return;
    fetch(
      `http://localhost:8080/api/prosecutor/prosecutor-cases?username=${prosecutor.username}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCases(data);
        } else {
          setCases([]);
        }
      })
      .catch((error) => {
        console.error("Failed to load cases:", error);
      });
  }, [prosecutor]);

  // Delete case
  const deleteCase = async (caseId) => {
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

    const queryParam = action === "approve" ? "description" : "reason";
    const endpoint = `http://localhost:8080/api/prosecutor/${action}/${selectedCase.id}?${queryParam}=${encodeURIComponent(
      description
    )}`;

    try {
      const res = await fetch(endpoint, { method: "POST" });
      if (res.ok) {
        alert(`Case ${action}d successfully.`);
        // Remove the case from local list
        setCases((cases) => cases.filter((c) => c.id !== selectedCase.id));
        // If approve, redirect to send-to-judge form
        if (action === "approve") {
          navigate("/send-to-judge", { state: { caseData: selectedCase } });
        }
        setSelectedCase(null);
        setDescription("");
      } else {
        throw new Error("Failed to process case.");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        {prosecutor
          ? `Welcome, Prosecutor ${prosecutor.name}`
          : "Prosecutor Dashboard"}
      </h1>

      {!selectedCase ? (
        cases.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {cases.map((c) => (
              <div
                key={c.id}
                className="bg-white p-4 rounded shadow hover:shadow-lg cursor-pointer border"
                onClick={() => setSelectedCase(c)}
              >
                <h2 className="text-xl font-semibold">{c.fullName}</h2>
                <p className="text-gray-600">{c.caseType}</p>
                <p className="text-sm text-gray-500">
                  {new Date(c.submittedAt).toLocaleString()}
                </p>
                <p className="mt-2 font-semibold text-orange-600">{c.status}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No cases found.</p>
        )
      ) : (
        <div className="bg-white p-6 rounded shadow-lg max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">{selectedCase.fullName}</h2>
          <p>
            <strong>Email:</strong> {selectedCase.email}
          </p>
          <p>
            <strong>Phone:</strong> {selectedCase.phone}
          </p>
          <p>
            <strong>Incident Date:</strong> {selectedCase.dateOfIncident}
          </p>
          <p>
            <strong>Case Type:</strong> {selectedCase.caseType}
          </p>
          <p>
            <strong>Submitted At:</strong>{" "}
            {new Date(selectedCase.submittedAt).toLocaleString()}
          </p>
          <p className="whitespace-pre-wrap mt-3">
            <strong>Description:</strong> {selectedCase.caseDescription}
          </p>

          {selectedCase.idCardUploadName && (
            <p className="mt-2">
              <strong>ID Card:</strong>{" "}
              <a
                href={`http://localhost:8080/uploads/${encodeURIComponent(
                  selectedCase.idCardUploadName
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {selectedCase.idCardUploadName}
              </a>
            </p>
          )}

          {selectedCase.additionalFileNames?.length > 0 && (
            <div className="mt-2">
              <strong>Additional Files:</strong>
              <ul className="list-disc ml-5">
                {selectedCase.additionalFileNames.map((file, index) => (
                  <li key={index}>
                    <a
                      href={`http://localhost:8080/uploads/${file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {file}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <textarea
            className="w-full h-24 p-2 border mt-4 rounded"
            placeholder="Write your formal feedback or reason..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={() => handleProsecutorAction("approve")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
            >
              Approve & Forward
            </button>
            <button
              onClick={() => handleProsecutorAction("reject")}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
            >
              Reject
            </button>
          </div>

          <div className="mt-6 flex justify-between">
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
      )}
    </div>
  );
};

export default ProsecutorHomePage;
