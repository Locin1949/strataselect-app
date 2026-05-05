import React, { useState } from 'react';

import { runAutomation } from '../automation/orchestrator';
import { loadAutomationSettings } from '../utils/automationSettingsStore';
import { addException } from '../utils/exceptionStore';
import AutomationLogPanel from './AutomationLogPanel';
import ClassifyStep from './ClassifyStep';
import CommitStep from './CommitStep';
import DetectStep from './DetectStep';
import UploadStep from './UploadStep';

export default function ImportWizard({
  detectMutation,
  classifyMutation,
  commitMutation,
  categoryList
}) {
  const settings = loadAutomationSettings();

  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [detected, setDetected] = useState(null);
  const [classified, setClassified] = useState(null);
  const [selectedLogs, setSelectedLogs] = useState(null);

  const handleUploadNext = () => setStep(2);

  const handleDetectNext = async () => {
    if (!file) return;
    const result = await detectMutation.mutateAsync({ file });
    setDetected(result);
    setStep(3);
  };

  const handleClassifyNext = async () => {
    if (!detected) return;

    const parsed = await classifyMutation.mutateAsync({
      file,
      detected
    });

    const enriched = parsed.rows.map(row => {
      const auto = runAutomation(
        {
          description: row.description,
          amount: row.amount,
          vendor: row.vendor,
          date: row.date,
          fund: row.fund
        },
        settings
      );

      const isException =
        auto.confidence < settings.exceptionThreshold || (auto.split && auto.split.length > 0);

      if (isException) {
        addException({
          ...row,
          suggestedCategory: auto.category,
          automationConfidence: auto.confidence,
          automationLogs: auto.logs,
          splitSuggestion: auto.split
        });
      }

      return {
        ...row,
        suggestedCategory: auto.category,
        automationSource: auto.source,
        automationConfidence: auto.confidence,
        automationLogs: auto.logs,
        splitSuggestion: auto.split
      };
    });

    setClassified({
      ...parsed,
      rows: enriched
    });

    setStep(4);
  };

  const handleCommit = async () => {
    if (!classified) return;

    await commitMutation.mutateAsync({
      rows: classified.rows
    });

    setStep(1);
    setFile(null);
    setDetected(null);
    setClassified(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '10px' }}>Import Wizard</h2>

      {step === 1 && <UploadStep file={file} setFile={setFile} onNext={handleUploadNext} />}

      {step === 2 && (
        <DetectStep
          file={file}
          detected={detected}
          setDetected={setDetected}
          onNext={handleDetectNext}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <ClassifyStep
          detected={detected}
          classified={classified}
          onNext={handleClassifyNext}
          onBack={() => setStep(2)}
          categoryList={categoryList}
          onViewLogs={logs => setSelectedLogs(logs)}
        />
      )}

      {step === 4 && (
        <CommitStep classified={classified} onBack={() => setStep(3)} onCommit={handleCommit} />
      )}

      {selectedLogs && (
        <AutomationLogPanel logs={selectedLogs} onClose={() => setSelectedLogs(null)} />
      )}
    </div>
  );
}
