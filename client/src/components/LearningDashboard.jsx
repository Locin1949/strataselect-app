import React, { useState } from 'react';

import LearningRuleEditor from '@/components/LearningRuleEditor';
import LearningRuleTable from '@/components/LearningRuleTable';
import SplitRuleEditor from '@/components/SplitRuleEditor';
import VendorMergeTool from '@/components/VendorMergeTool';
import { loadLearning, saveLearning } from '@/utils/learningStore';

export default function LearningDashboard() {
  const [learning, setLearning] = useState(loadLearning());

  const [editRule, setEditRule] = useState(null);
  const [editSplit, setEditSplit] = useState(null);

  function updateLearning(newLearning) {
    setLearning(newLearning);
    saveLearning(newLearning);
  }

  return (
    <div className="space-y-10 p-6">
      <h1 className="text-3xl font-bold text-slate-900">Learning Dashboard</h1>
      <p className="text-slate-600">Manage learned rules, vendor mappings, and split patterns.</p>

      {/* Vendor Rules */}
      <LearningRuleTable
        title="Vendor Rules"
        data={learning.vendorMap}
        onEdit={(key, value) => setEditRule({ type: 'vendor', key, value })}
        onDelete={key => {
          const updated = { ...learning };
          delete updated.vendorMap[key];
          updateLearning(updated);
        }}
      />

      {/* Description Rules */}
      <LearningRuleTable
        title="Description Rules"
        data={learning.descriptionMap}
        onEdit={(key, value) => setEditRule({ type: 'description', key, value })}
        onDelete={key => {
          const updated = { ...learning };
          delete updated.descriptionMap[key];
          updateLearning(updated);
        }}
      />

      {/* Amount Rules */}
      <LearningRuleTable
        title="Amount Rules"
        data={learning.amountMap}
        onEdit={(key, value) => setEditRule({ type: 'amount', key, value })}
        onDelete={key => {
          const updated = { ...learning };
          delete updated.amountMap[key];
          updateLearning(updated);
        }}
      />

      {/* Split Rules */}
      <LearningRuleTable
        title="Split Rules"
        data={learning.splitRules}
        onEdit={(key, value) => setEditSplit({ key, value })}
        onDelete={key => {
          const updated = { ...learning };
          delete updated.splitRules[key];
          updateLearning(updated);
        }}
      />

      {/* Vendor Merge Tool */}
      <VendorMergeTool
        vendorMap={learning.vendorMap}
        onMerge={(from, to) => {
          const updated = { ...learning };
          updated.vendorMap[from] = to;
          updateLearning(updated);
        }}
      />

      {/* Rule Editor Modal */}
      {editRule && (
        <LearningRuleEditor
          rule={editRule}
          onClose={() => setEditRule(null)}
          onSave={newCategory => {
            const updated = { ...learning };
            if (editRule.type === 'vendor') {
              updated.vendorMap[editRule.key] = newCategory;
            } else if (editRule.type === 'description') {
              updated.descriptionMap[editRule.key] = newCategory;
            } else if (editRule.type === 'amount') {
              updated.amountMap[editRule.key] = newCategory;
            }
            updateLearning(updated);
            setEditRule(null);
          }}
        />
      )}

      {/* Split Editor Modal */}
      {editSplit && (
        <SplitRuleEditor
          rule={editSplit}
          onClose={() => setEditSplit(null)}
          onSave={newSplit => {
            const updated = { ...learning };
            updated.splitRules[editSplit.key] = newSplit;
            updateLearning(updated);
            setEditSplit(null);
          }}
        />
      )}
    </div>
  );
}
