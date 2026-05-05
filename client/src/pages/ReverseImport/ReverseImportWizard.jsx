import '../styles/Cards.css';
import '../styles/Forms.css';

import React, { useState } from 'react';

import ReverseCommitStep from './ReverseCommitStep';
import ReverseExportStep from './ReverseExportStep';
import ReverseReviewStep from './ReverseReviewStep';
import ReverseUploadStep from './ReverseUploadStep';

export default function ReverseImportWizard() {
  const [step, setStep] = useState(1);
  const [exported, setExported] = useState(null);
  const [reviewed, setReviewed] = useState(null);
  const [uploaded, setUploaded] = useState(null);

  const steps = [
    { id: 1, label: 'Export' },
    { id: 2, label: 'Review' },
    { id: 3, label: 'Upload' },
    { id: 4, label: 'Commit' }
  ];

  return (
    <div>
      <h1>Reverse Import Wizard</h1>

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
      {step === 1 && (
        <ReverseExportStep
          exported={exported}
          setExported={setExported}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <ReverseReviewStep
          exported={exported}
          reviewed={reviewed}
          setReviewed={setReviewed}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <ReverseUploadStep
          reviewed={reviewed}
          uploaded={uploaded}
          setUploaded={setUploaded}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && <ReverseCommitStep uploaded={uploaded} onBack={() => setStep(3)} />}
    </div>
  );
}
