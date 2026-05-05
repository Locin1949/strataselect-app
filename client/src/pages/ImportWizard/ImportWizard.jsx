import '../styles/Cards.css';
import '../styles/Forms.css';

import React, { useState } from 'react';

import ClassifyStep from '../pages/ImportWizard/ClassifyStep';
import CommitStep from '../pages/ImportWizard/CommitStep';
import DetectStep from '../pages/ImportWizard/DetectStep';
import UploadStep from '../pages/ImportWizard/UploadStep';

export default function ImportWizard() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [detected, setDetected] = useState(null);
  const [classified, setClassified] = useState(null);

  const steps = [
    { id: 1, label: 'Upload' },
    { id: 2, label: 'Detect' },
    { id: 3, label: 'Classify' },
    { id: 4, label: 'Commit' }
  ];

  return (
    <div>
      <h1>Import Wizard</h1>

      {/* PREMIUM STEPPER */}
      <div className="premium-stepper">
        {steps.map((s, index) => {
          const isActive = s.id === step;
          const isCompleted = s.id < step;

          return (
            <div key={s.id} className="stepper-item">
              <div
                className={`stepper-circle ${isActive ? 'active' : isCompleted ? 'completed' : ''}`}
              >
                {s.id}
              </div>
              <div className="stepper-label">{s.label}</div>

              {index < steps.length - 1 && (
                <div className={`stepper-line ${isCompleted ? 'completed' : ''}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* STEP CONTENT */}
      {step === 1 && <UploadStep file={file} setFile={setFile} onNext={() => setStep(2)} />}

      {step === 2 && (
        <DetectStep
          file={file}
          detected={detected}
          setDetected={setDetected}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <ClassifyStep
          detected={detected}
          classified={classified}
          setClassified={setClassified}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && <CommitStep classified={classified} onBack={() => setStep(3)} />}
    </div>
  );
}
