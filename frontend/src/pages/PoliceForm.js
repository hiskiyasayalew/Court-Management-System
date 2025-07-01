import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const PoliceForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const passedCase = location.state?.caseData;

  const [formData, setFormData] = useState({
    caseId: '',
    prosecutorId: '',
    details: '',
    evidence: '',
    witnesses: ''
  });
  const [prosecutors, setProsecutors] = useState([]);
  const [caseFiles, setCaseFiles] = useState([]);
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [fileUploadProgress, setFileUploadProgress] = useState(0);

  useEffect(() => {
    if (passedCase?.id) {
      setFormData(prev => ({ ...prev, caseId: passedCase.id }));
    }
  }, [passedCase]);

  useEffect(() => {
    const fetchProsecutors = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/prosecutor');
        if (Array.isArray(response.data)) {
          setProsecutors(response.data);
        } else {
          console.error("Expected array but got:", response.data);
          throw new Error("Invalid prosecutors data format");
        }
      } catch (error) {
        console.error('Failed to fetch prosecutors:', error);
        setMessage({ 
          text: 'Failed to load prosecutors. Please try again later.', 
          type: 'error' 
        });
      }
    };
    fetchProsecutors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, setter) => {
    const files = Array.from(e.target.files);
    // Basic validation - check file types and sizes
    const validFiles = files.filter(file => 
      file.size <= 10 * 1024 * 1024 && // 10MB max
      ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)
    );
    
    if (validFiles.length !== files.length) {
      setMessage({
        text: 'Some files were skipped. Only PDF, JPG, PNG files under 10MB are allowed.',
        type: 'warning'
      });
    }
    setter(validFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    caseFiles.forEach(file => formDataToSend.append('caseFiles', file));
    evidenceFiles.forEach(file => formDataToSend.append('evidenceFiles', file));

    try {
      const res = await axios.post(
        'http://localhost:8080/api/police/send-to-prosecutor', 
        formDataToSend,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setFileUploadProgress(progress);
          }
        }
      );

      setMessage({ 
        text: '✅ Case successfully forwarded to prosecutor.', 
        type: 'success' 
      });
      
      // Reset form after successful submission
      setFormData({
        caseId: passedCase?.id || '',
        prosecutorId: '',
        details: '',
        evidence: '',
        witnesses: ''
      });
      setCaseFiles([]);
      setEvidenceFiles([]);
      setFileUploadProgress(0);

      // Redirect after 2 seconds
      setTimeout(() => navigate('/police-dashboard'), 2000);
    } catch (err) {
      console.error(err);
      setMessage({ 
        text: `❌ Failed to send case: ${err.response?.data?.message || err.message}`, 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const messageClasses = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-blue-700 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Forward Case to Prosecutor</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Case ID */}
            <div>
              <label htmlFor="caseId" className="block text-sm font-medium text-gray-700">
                Case ID
              </label>
              <input
                id="caseId"
                name="caseId"
                type="text"
                value={formData.caseId}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Prosecutor Selection */}
            <div>
              <label htmlFor="prosecutorId" className="block text-sm font-medium text-gray-700">
                Select Prosecutor
              </label>
              <select
                id="prosecutorId"
                name="prosecutorId"
                value={formData.prosecutorId}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Select Prosecutor --</option>
                {prosecutors.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.department})
                  </option>
                ))}
              </select>
            </div>

            {/* Details */}
            <div>
              <label htmlFor="details" className="block text-sm font-medium text-gray-700">
                Case Details
              </label>
              <textarea
                id="details"
                name="details"
                rows={4}
                value={formData.details}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Provide detailed information about the case..."
              />
            </div>

            {/* Evidence Summary */}
            <div>
              <label htmlFor="evidence" className="block text-sm font-medium text-gray-700">
                Evidence Summary
              </label>
              <textarea
                id="evidence"
                name="evidence"
                rows={4}
                value={formData.evidence}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the evidence collected..."
              />
            </div>

            {/* Witnesses */}
            <div>
              <label htmlFor="witnesses" className="block text-sm font-medium text-gray-700">
                Witness Information
              </label>
              <textarea
                id="witnesses"
                name="witnesses"
                rows={4}
                value={formData.witnesses}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="List witnesses and their contact information..."
              />
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Case Files (PDF, JPG, PNG)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="caseFiles"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Upload files</span>
                        <input
                          id="caseFiles"
                          name="caseFiles"
                          type="file"
                          multiple
                          onChange={(e) => handleFileChange(e, setCaseFiles)}
                          className="sr-only"
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      Up to 10MB per file
                    </p>
                  </div>
                </div>
                {caseFiles.length > 0 && (
                  <div className="mt-2 text-sm text-gray-700">
                    Selected: {caseFiles.map(f => f.name).join(', ')}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Evidence Files (PDF, JPG, PNG)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="evidenceFiles"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Upload files</span>
                        <input
                          id="evidenceFiles"
                          name="evidenceFiles"
                          type="file"
                          multiple
                          onChange={(e) => handleFileChange(e, setEvidenceFiles)}
                          className="sr-only"
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      Up to 10MB per file
                    </p>
                  </div>
                </div>
                {evidenceFiles.length > 0 && (
                  <div className="mt-2 text-sm text-gray-700">
                    Selected: {evidenceFiles.map(f => f.name).join(', ')}
                  </div>
                )}
              </div>
            </div>

            {/* Upload Progress */}
            {isLoading && fileUploadProgress > 0 && (
              <div className="pt-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Uploading files...</span>
                  <span>{fileUploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${fileUploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#f25c05] hover:bg-[#d14e00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Send to Prosecutor'}
              </button>
            </div>

            {/* Status Message */}
            {message.text && (
              <div className={`mt-4 p-4 border rounded ${messageClasses[message.type] || messageClasses.info}`}>
                {message.text}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PoliceForm;