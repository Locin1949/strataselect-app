import '../styles/Cards.css';
import '../styles/Forms.css';

import React from 'react';

export default function UploadStep({ file, setFile, onNext }) {
  return (
    <div className="dash-card" style={{ padding: '25px' }}>
      <h2>Upload File</h2>
      <p>Select a CSV or Excel file to begin the import process.</p>

      <input type="file" onChange={e => setFile(e.target.files[0])} style={{ marginTop: '15px' }} />

      <button disabled={!file} onClick={onNext} style={{ marginTop: '20px' }}>
        Next
      </button>
    </div>
  );
}
