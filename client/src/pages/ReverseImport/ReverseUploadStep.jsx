import '../styles/Cards.css';
import '../styles/Forms.css';

import React, { useState } from 'react';

export default function ReverseUploadStep({ setUploaded, onNext, onBack }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  function handleFileChange(e) {
    const selected = e.target.files[0];
    setError('');

    if (!selected) {
      setFile(null);
      return;
    }

    // Premium-grade validation: CSV only
    if (!selected.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      setFile(null);
      return;
    }

    setFile(selected);
  }

  function handleNext() {
    if (!file) return;
    setUploaded(file);
    onNext();
  }

  return (
    <div className="dash-card" style={{ padding: '25px' }}>
      <h2 className="text-xl font-semibold mb-2">Upload Modified File</h2>
      <p className="text-slate-600">
        Upload the CSV file you edited to apply your reverse import changes.
      </p>

      {/* FILE INPUT */}
      <div style={{ marginTop: '20px' }}>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-slate-700
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-600 file:text-white
                     hover:file:bg-blue-700 transition"
        />
      </div>

      {/* ERROR MESSAGE */}
      {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}

      {/* ACTION BUTTONS */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50 transition"
        >
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={!file}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm
                     hover:bg-blue-700 transition disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
