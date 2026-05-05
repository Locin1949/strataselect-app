import React, { useMemo } from 'react';

// FIXED IMPORTS — removed alias paths
import { loadLearning } from '../utils/learningStore';
import { mapRawVendorToCluster, normalizeVendor } from '../utils/vendorUtils';

export default function VendorIntelligenceDashboard({ transactions }) {
  const learning = loadLearning();

  const analytics = useMemo(() => {
    const vendorStats = {};
    const clusterStats = {};

    transactions.forEach(t => {
      const rawVendor = t.vendor || '';
      const clusterKey = mapRawVendorToCluster(rawVendor);
      const norm = normalizeVendor(rawVendor);

      if (!vendorStats[norm]) {
        vendorStats[norm] = {
          rawNames: new Set(),
          count: 0,
          categories: {},
          splits: 0,
          totalAmount: 0
        };
      }

      vendorStats[norm].rawNames.add(rawVendor);
      vendorStats[norm].count += 1;
      vendorStats[norm].totalAmount += Number(t.amount || 0);

      const cat = t.category || 'Uncategorised';
      vendorStats[norm].categories[cat] = (vendorStats[norm].categories[cat] || 0) + 1;

      if (t.isSplitChild) {
        vendorStats[norm].splits += 1;
      }

      if (!clusterStats[clusterKey]) {
        clusterStats[clusterKey] = {
          vendors: new Set(),
          count: 0,
          categories: {},
          totalAmount: 0
        };
      }

      clusterStats[clusterKey].vendors.add(rawVendor);
      clusterStats[clusterKey].count += 1;
      clusterStats[clusterKey].totalAmount += Number(t.amount || 0);

      clusterStats[clusterKey].categories[cat] =
        (clusterStats[clusterKey].categories[cat] || 0) + 1;
    });

    return { vendorStats, clusterStats };
  }, [transactions]);

  return (
    <div style={box}>
      <h2 style={title}>Vendor Intelligence Dashboard</h2>

      {/* CLUSTER ANALYTICS */}
      <section style={section}>
        <h3 style={subtitle}>Vendor Clusters</h3>

        {Object.entries(analytics.clusterStats).map(([clusterKey, data]) => (
          <div key={clusterKey} style={card}>
            <h4 style={cardTitle}>{clusterKey}</h4>

            <div style={row}>
              <strong>Total Transactions:</strong> {data.count}
            </div>

            <div style={row}>
              <strong>Total Amount:</strong> ${data.totalAmount.toFixed(2)}
            </div>

            <div style={row}>
              <strong>Vendors:</strong> {[...data.vendors].join(', ') || '—'}
            </div>

            <div style={{ marginTop: '8px' }}>
              <strong>Category Distribution:</strong>
              {Object.entries(data.categories).map(([cat, count]) => (
                <div key={cat} style={smallRow}>
                  {cat}: {count}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* VENDOR ANALYTICS */}
      <section style={section}>
        <h3 style={subtitle}>Individual Vendors</h3>

        {Object.entries(analytics.vendorStats).map(([vendorKey, data]) => (
          <div key={vendorKey} style={card}>
            <h4 style={cardTitle}>{vendorKey}</h4>

            <div style={row}>
              <strong>Raw Names:</strong> {[...data.rawNames].join(', ') || '—'}
            </div>

            <div style={row}>
              <strong>Transactions:</strong> {data.count}
            </div>

            <div style={row}>
              <strong>Total Amount:</strong> ${data.totalAmount.toFixed(2)}
            </div>

            <div style={row}>
              <strong>Split Transactions:</strong> {data.splits}
            </div>

            <div style={{ marginTop: '8px' }}>
              <strong>Category Distribution:</strong>
              {Object.entries(data.categories).map(([cat, count]) => (
                <div key={cat} style={smallRow}>
                  {cat}: {count}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* LEARNED RULES */}
      <section style={section}>
        <h3 style={subtitle}>Learned Rules</h3>

        <div style={card}>
          <h4 style={cardTitle}>Vendor → Category</h4>
          {Object.entries(learning.vendorMap).map(([v, cat]) => (
            <div key={v} style={smallRow}>
              {v} → {cat}
            </div>
          ))}
        </div>

        <div style={card}>
          <h4 style={cardTitle}>Description → Category</h4>
          {Object.entries(learning.descriptionMap).map(([d, cat]) => (
            <div key={d} style={smallRow}>
              {d} → {cat}
            </div>
          ))}
        </div>

        <div style={card}>
          <h4 style={cardTitle}>Amount → Category</h4>
          {Object.entries(learning.amountMap).map(([amt, cat]) => (
            <div key={amt} style={smallRow}>
              ${amt} → {cat}
            </div>
          ))}
        </div>

        <div style={card}>
          <h4 style={cardTitle}>Split Rules</h4>
          {Object.entries(learning.splitRules).map(([vendor, rules]) => (
            <div key={vendor} style={smallRow}>
              <strong>{vendor}</strong>
              {rules.map((r, i) => (
                <div key={i} style={{ marginLeft: '12px' }}>
                  {r.category} — ${r.amount}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const box = { padding: '20px' };
const title = { fontSize: '24px', fontWeight: 700, marginBottom: '20px' };
const subtitle = { fontSize: '18px', fontWeight: 600, marginBottom: '12px' };
const section = { marginBottom: '32px' };
const card = {
  background: 'white',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '12px',
  marginBottom: '12px'
};
const cardTitle = { fontSize: '16px', fontWeight: 600, marginBottom: '8px' };
const row = { marginBottom: '6px', fontSize: '14px' };
const smallRow = { fontSize: '13px', marginLeft: '8px', marginTop: '2px' };
