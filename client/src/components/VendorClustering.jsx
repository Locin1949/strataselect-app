import React, { useEffect, useState } from 'react';

import { loadLearning, saveLearning } from '@/utils/learningStore';
import { normalizeVendor } from '@/utils/vendorUtils';

export default function VendorClustering() {
  const [store, setStore] = useState(loadLearning());
  const [newVendorName, setNewVendorName] = useState('');
  const [exportData, setExportData] = useState('');

  useEffect(() => {
    setStore(loadLearning());
  }, []);

  const refresh = () => setStore(loadLearning());

  // -----------------------------
  // MERGE RAW VENDOR INTO CLUSTER
  // -----------------------------
  const mergeVendor = (rawVendor, clusterKey) => {
    const updated = loadLearning();

    if (!updated.vendorClusters[clusterKey]) {
      updated.vendorClusters[clusterKey] = [];
    }

    if (!updated.vendorClusters[clusterKey].includes(rawVendor)) {
      updated.vendorClusters[clusterKey].push(rawVendor);
    }

    saveLearning(updated);
    refresh();
  };

  // -----------------------------
  // CREATE NEW CLUSTER
  // -----------------------------
  const createCluster = () => {
    if (!newVendorName.trim()) return;

    const updated = loadLearning();
    const norm = normalizeVendor(newVendorName);

    if (!updated.vendorClusters[norm]) {
      updated.vendorClusters[norm] = [newVendorName];
    }

    saveLearning(updated);
    setNewVendorName('');
    refresh();
  };

  // -----------------------------
  // DELETE CLUSTER
  // -----------------------------
  const deleteCluster = clusterKey => {
    const updated = loadLearning();
    delete updated.vendorClusters[clusterKey];
    saveLearning(updated);
    refresh();
  };

  // -----------------------------
  // EXPORT / IMPORT
  // -----------------------------
  const handleExport = () => {
    setExportData(JSON.stringify(store.vendorClusters, null, 2));
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(exportData);
      const updated = loadLearning();
      updated.vendorClusters = parsed;
      saveLearning(updated);
      refresh();
    } catch {
      alert('Invalid JSON');
    }
  };

  return (
    <div style={box}>
      <h2 style={title}>Vendor Clustering</h2>

      {/* CREATE NEW CLUSTER */}
      <div style={section}>
        <h3 style={subtitle}>Create New Vendor Cluster</h3>

        <div style={row}>
          <input
            style={input}
            placeholder="Vendor name"
            value={newVendorName}
            onChange={e => setNewVendorName(e.target.value)}
          />
          <button style={btnBlue} onClick={createCluster}>
            Create
          </button>
        </div>
      </div>

      {/* CLUSTER LIST */}
      <div style={section}>
        <h3 style={subtitle}>Existing Vendor Clusters</h3>

        {Object.keys(store.vendorClusters).length === 0 && <div>No vendor clusters yet.</div>}

        {Object.entries(store.vendorClusters).map(([clusterKey, vendors]) => (
          <div key={clusterKey} style={clusterBox}>
            <div style={clusterHeader}>
              <strong>{clusterKey}</strong>

              <button style={btnSmallRed} onClick={() => deleteCluster(clusterKey)}>
                Delete
              </button>
            </div>

            <div style={vendorList}>
              {vendors.map(v => (
                <div key={v} style={vendorItem}>
                  {v}
                </div>
              ))}
            </div>

            {/* MERGE RAW VENDOR */}
            <div style={row}>
              <input
                style={input}
                placeholder="Add raw vendor to this cluster"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    mergeVendor(e.target.value, clusterKey);
                    e.target.value = '';
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* EXPORT / IMPORT */}
      <div style={section}>
        <h3 style={subtitle}>Export / Import Vendor Clusters</h3>

        <button style={btnGreen} onClick={handleExport}>
          Export
        </button>

        <textarea
          style={textarea}
          value={exportData}
          onChange={e => setExportData(e.target.value)}
          placeholder="Paste JSON here to import"
        />

        <button style={btnBlue} onClick={handleImport}>
          Import
        </button>
      </div>
    </div>
  );
}

const box = {
  background: 'white',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb'
};

const title = { fontSize: '22px', fontWeight: 700, marginBottom: '16px' };
const subtitle = { fontSize: '16px', fontWeight: 600, marginBottom: '8px' };
const section = { marginBottom: '24px' };

const row = { display: 'flex', gap: '8px', marginBottom: '12px' };

const input = {
  flex: 1,
  padding: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px'
};

const textarea = {
  width: '100%',
  height: '120px',
  marginTop: '8px',
  padding: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px'
};

const clusterBox = {
  border: '1px solid #e5e7eb',
  borderRadius: '6px',
  padding: '12px',
  marginBottom: '12px'
};

const clusterHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '8px'
};

const vendorList = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
  marginBottom: '8px'
};

const vendorItem = {
  padding: '4px 8px',
  background: '#f3f4f6',
  borderRadius: '4px',
  fontSize: '12px'
};

const btnBlue = {
  padding: '8px 12px',
  background: '#2563eb',
  color: 'white',
  borderRadius: '4px',
  cursor: 'pointer'
};

const btnGreen = {
  padding: '8px 12px',
  background: '#059669',
  color: 'white',
  borderRadius: '4px',
  cursor: 'pointer',
  marginBottom: '8px'
};

const btnSmallRed = {
  padding: '4px 8px',
  background: '#dc2626',
  color: 'white',
  borderRadius: '4px',
  cursor: 'pointer'
};
