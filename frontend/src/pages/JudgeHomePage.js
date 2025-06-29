import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JudgeHomePage = () => {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);

  useEffect(() => {
    // Assuming judge info is stored in localStorage after login
    const judge = JSON.parse(localStorage.getItem('judge'));
    if (!judge) return;

    axios.get(`http://localhost:8080/api/judge/forms?judgeId=${judge.id}`)
      .then(res => setForms(res.data))
      .catch(err => console.error('Failed to fetch forms', err));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Assigned Cases for Review</h1>

      {!selectedForm ? (
        <ul className="space-y-4">
          {forms.map(f => (
            <li
              key={f.id}
              onClick={() => setSelectedForm(f)}
              className="cursor-pointer p-4 border rounded hover:bg-gray-100"
            >
              <strong>Case ID:</strong> {f.caseEntity.id} - <strong>Details:</strong> {f.details.substring(0, 50)}...
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <button
            onClick={() => setSelectedForm(null)}
            className="mb-4 bg-gray-200 px-3 py-1 rounded"
          >
            Back to List
          </button>
          <h2 className="text-xl font-semibold mb-2">Case Details</h2>
          <p><strong>Case ID:</strong> {selectedForm.caseEntity.id}</p>
          <p><strong>Details:</strong> {selectedForm.details}</p>
          <p><strong>Evidence Summary:</strong> {selectedForm.evidenceSummary}</p>
          <p><strong>Witnesses:</strong> {selectedForm.witnesses}</p>

          <h3 className="mt-4 font-semibold">Case Files:</h3>
          <ul>
            {selectedForm.caseFiles.map((file, i) => (
              <li key={i}>
                <a href={`http://localhost:8080/uploads/${file}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{file}</a>
              </li>
            ))}
          </ul>

          <h3 className="mt-4 font-semibold">Evidence Files:</h3>
          <ul>
            {selectedForm.evidenceFiles.map((file, i) => (
              <li key={i}>
                <a href={`http://localhost:8080/uploads/${file}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{file}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default JudgeHomePage;
