import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import UploadStep from "./UploadStep";
import DetectStep from "./DetectStep";
import ClassifyStep from "./ClassifyStep";
import CommitStep from "./CommitStep";

export default function ImportWizard() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [detected, setDetected] = useState(null);
  const [classified, setClassified] = useState(null);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Import Wizard</h2>

      {step === 1 && (
        <UploadStep
          file={file}
          setFile={setFile}
          onNext={() => setStep(2)}
        />
      )}

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

      {step === 4 && (
        <CommitStep
          classified={classified}
          onBack={() => setStep(3)}
        />
      )}

      {/* Nested routes support (optional) */}
      <Outlet />
    </div>
  );
}