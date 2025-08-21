import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AppealForm = () => {
  const { caseId } = useParams();
  const [reason, setReason] = useState('');
  const [caseData, setCaseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCase = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`http://localhost:8080/api/cases/${caseId}`);
        if (res.ok) {
          const data = await res.json();
          setCaseData(data);
        }
      } catch (error) {
        console.error('Error fetching case:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCase();
  }, [caseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const appeal = {
      caseId: parseInt(caseId),
      userName: user.userName,
      reason
    };

    try {
      const response = await fetch("http://localhost:8080/api/appeals/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appeal)
      });

      if (response.ok) {
        alert("Appeal submitted successfully!");
        navigate('/appeal');
      } else {
        alert("Failed to submit appeal.");
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert("An error occurred while submitting your appeal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-3 xs:p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-4 xs:p-5 sm:p-6 md:p-8 rounded-lg sm:rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold mb-4 text-gray-800 text-center">Submit Appeal</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : caseData ? (
          <div className="mb-5 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Case Information</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><span className="font-medium">Case:</span> {caseData.fullName}</p>
              <p><span className="font-medium">Type:</span> {caseData.caseType}</p>
              <p><span className="font-medium">Status:</span> <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs">{caseData.status}</span></p>
            </div>
          </div>
        ) : (
          <div className="mb-5 p-3 bg-yellow-50 text-yellow-700 rounded-lg text-center">
            Could not load case details
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Appeal Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reason"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Please explain in detail why you are appealing this decision..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={6}
              required
            />
          </div>
          
          <div className="flex flex-col xs:flex-row gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-70 transition flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Appeal'
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-6 pt-5 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            By submitting this appeal, you agree to our terms of service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppealForm;