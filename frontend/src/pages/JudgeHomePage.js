import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JudgeHomePage = () => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);

  const judge = JSON.parse(localStorage.getItem('judge'));
  const judgeName = judge ? judge.name : 'Judge';

  useEffect(() => {
    if (!judge) return;

    axios
      .get(`http://localhost:8080/api/judge/cases?judgeId=${judge.id}`)
      .then(res => setCases(res.data))
      .catch(err => console.error('Failed to fetch cases', err));
  }, []);

  const handleApprove = () => {
    alert(`✅ Case ${selectedCase.caseId} approved!`);
    // TODO: Call backend API to mark approved
  };

  const handleReject = () => {
    alert(`❌ Case ${selectedCase.caseId} rejected.`);
    // TODO: Call backend API to mark rejected
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-2 animate-fade-in">
        Welcome, {judgeName}!
      </h1>
      <p className="text-gray-700 mb-8 text-lg">
        Here are your assigned cases for review.
      </p>

      {!selectedCase ? (
        <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {cases.map(c => (
            <li
              key={c.id}
              onClick={() => setSelectedCase(c)}
              className="cursor-pointer p-6 border rounded-xl shadow hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 ease-in-out bg-white"
            >
              <p className="text-lg font-semibold mb-2">
                📁 Case ID: {c.caseId}
              </p>
              <p className="text-gray-600">
                {c.details.length > 100
                  ? `${c.details.substring(0, 100)}...`
                  : c.details}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="border rounded-xl shadow-lg p-8 bg-white animate-fade-in">
          <button
            onClick={() => setSelectedCase(null)}
            className="mb-6 inline-block bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded transition"
          >
            ⬅️ Back to Cases
          </button>

          <h2 className="text-2xl font-bold mb-4">Case Details</h2>
          <div className="space-y-2">
            <p>
              <strong>Case ID:</strong> {selectedCase.caseId}
            </p>
            <p>
              <strong>Details:</strong> {selectedCase.details}
            </p>
            <p>
              <strong>Evidence Summary:</strong> {selectedCase.evidenceSummary}
            </p>
            <p>
              <strong>Witnesses:</strong> {selectedCase.witnesses}
            </p>
          </div>

          <h3 className="mt-6 font-semibold text-lg">Case Files:</h3>
          <ul className="list-disc ml-5">
            {selectedCase.caseFileNames.map((file, i) => (
              <li key={i}>
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

          <h3 className="mt-4 font-semibold text-lg">Evidence Files:</h3>
          <ul className="list-disc ml-5">
            {selectedCase.evidenceFileNames.map((file, i) => (
              <li key={i}>
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

          <div className="flex gap-4 mt-8">
            <button
              onClick={handleApprove}
              className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              ✅ Approve
            </button>
            <button
              onClick={handleReject}
              className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              ❌ Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JudgeHomePage;
