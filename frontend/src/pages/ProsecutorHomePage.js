import React, { useEffect, useState } from "react";

const ProsecutorHomePage = () => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    const prosecutor = JSON.parse(localStorage.getItem('prosecutor'));
    if (!prosecutor) return;

    fetch(`http://localhost:8080/api/prosecutor/prosecutor-cases?username=${prosecutor.username}`)
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
  }, []);
  
    const deleteCase = async (caseId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/cases/${caseId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete case");
      setCases(cases.filter((c) => c.id !== caseId));
    } catch (err) {
      console.error("Error deleting case:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Prosecutor Dashboard</h1>

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
                <p className="text-sm text-gray-500">{new Date(c.submittedAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No cases found.</p>
        )
      ) : (
        <div className="bg-white p-6 rounded shadow-lg max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">{selectedCase.fullName}</h2>
          <p><strong>Email:</strong> {selectedCase.email}</p>
          <p><strong>Phone:</strong> {selectedCase.phone}</p>
          <p><strong>Incident Date:</strong> {selectedCase.dateOfIncident}</p>
          <p><strong>Case Type:</strong> {selectedCase.caseType}</p>
          <p><strong>Submitted At:</strong> {new Date(selectedCase.submittedAt).toLocaleString()}</p>
          <p className="whitespace-pre-wrap mt-3"><strong>Description:</strong> {selectedCase.caseDescription}</p>

          {selectedCase.idCardUploadName && (
            <p className="mt-2">
              <strong>ID Card:</strong>{" "}
              <a
                href={`http://localhost:8080/uploads/${encodeURIComponent(selectedCase.idCardUploadName)}`}
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

          <div className="mt-4">
            <button
              onClick={() => setSelectedCase(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProsecutorHomePage;
