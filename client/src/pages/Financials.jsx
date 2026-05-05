import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

// COMPONENTS (fixed alias imports)
import AutomationSettings from '../components/AutomationSettings';
import BulkActions from '../components/BulkActions';
import FilterBar from '../components/FilterBar';
import FinancialCharts from '../components/FinancialCharts';
import ImportHistoryTable from '../components/ImportHistoryTable';
import ImportWizard from '../components/ImportWizard';
import SummaryCards from '../components/SummaryCards';
import TransactionModal from '../components/TransactionModal';
import TransactionTable from '../components/TransactionTable';
// HOOKS (fixed alias imports)
import { useFinancials, useImportHistory } from '../hooks';
// UTILS (fixed alias imports)
import { classifyTransactionPremium } from '../utils/automationEngine';
import { loadAutomationSettings } from '../utils/automationSettingsStore';
import { calculateSummary, filterTransactions } from '../utils/financialUtils';

export default function Financials() {
  const cashbook = useFinancials();
  const history = useImportHistory();
  const { transactions: txnQuery, addTxn, updateTxn, deleteTxn } = useFinancials();

  const settings = loadAutomationSettings();

  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    dateFrom: '',
    dateTo: ''
  });

  const [selected, setSelected] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [automationMode, setAutomationMode] = useState('assisted');

  // ⭐ Memoized transaction list
  const transactions = useMemo(() => txnQuery.data || [], [txnQuery.data]);

  // ⭐ Filtered + summary
  const filtered = useMemo(
    () => filterTransactions(transactions, filters),
    [transactions, filters]
  );

  const summary = useMemo(() => calculateSummary(filtered), [filtered]);

  const isLoading = cashbook.isLoading || history.isLoading || txnQuery.isLoading;
  const hasError = cashbook.isError || history.isError || txnQuery.isError;

  // -------------------------------
  // LOADING / ERROR STATES
  // -------------------------------

  if (isLoading) {
    return (
      <div className="p-6 text-slate-600">
        <h1 className="text-2xl font-semibold mb-2">Financials</h1>
        <p>Loading financial data…</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="p-6 text-red-600">
        <h1 className="text-2xl font-semibold mb-2">Financials</h1>
        <p>Unable to load financial data. Please try again shortly.</p>
      </div>
    );
  }

  // -------------------------------
  // BULK ACTIONS
  // -------------------------------

  const handleBulkDelete = () => {
    selectedIds.forEach(id => deleteTxn.mutate(id));
    toast.success(`${selectedIds.length} transactions deleted`);
    setSelectedIds([]);
  };

  const handleBulkCategory = category => {
    selectedIds.forEach(id => updateTxn.mutate({ id, data: { category } }));
    toast.success(`Updated ${selectedIds.length} transactions`);
    setSelectedIds([]);
  };

  // -------------------------------
  // AUTOMATION ENGINE
  // -------------------------------

  const applyAutomationToForm = form => {
    const result = classifyTransactionPremium(
      {
        description: form.description,
        amount: form.amount,
        vendor: form.vendor
      },
      settings.automationMode
    );

    if (settings.automationMode === 'assisted' && result.category) {
      form.category = result.category;
    }

    if (settings.automationMode === 'automatic' && result.autoAssigned) {
      form.category = result.category;
    }

    return form;
  };

  // -------------------------------
  // RENDER
  // -------------------------------

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Financials</h1>
          <p className="text-slate-500 mt-1">
            Cashbook, imports, and fund performance at a glance.
          </p>
        </div>

        <button
          onClick={() => {
            setSelected(null);
            setModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition"
        >
          + Add Transaction
        </button>
      </div>

      {/* AUTOMATION SETTINGS */}
      <AutomationSettings
        mode={automationMode}
        onChange={setAutomationMode}
        lockedModes={['automatic']}
      />

      {/* SUMMARY CARDS */}
      <SummaryCards summary={summary} />

      {/* FILTER BAR */}
      <FilterBar filters={filters} setFilters={setFilters} />

      {/* CHARTS */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Financial Charts</h2>
        <FinancialCharts transactions={transactions} />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT SIDE — TRANSACTION TABLE */}
        <div className="xl:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="px-4 py-3 border-b border-slate-200">
            <BulkActions
              selectedIds={selectedIds}
              onBulkDelete={handleBulkDelete}
              onBulkCategory={handleBulkCategory}
            />
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Transactions</h2>
            <span className="text-xs text-slate-500">
              {filtered.length} shown of {transactions.length} total
            </span>
          </div>

          <div className="overflow-x-auto">
            <TransactionTable
              data={filtered}
              onEdit={item => {
                setSelected(item);
                setModalOpen(true);
              }}
              onDelete={item => {
                setSelected(item);
                deleteTxn.mutate(item.id);
              }}
              onSelectionChange={setSelectedIds}
            />
          </div>
        </div>

        {/* RIGHT SIDE — IMPORT WIZARD + HISTORY */}
        <div className="space-y-6">
          <ImportWizard
            detectMutation={null}
            classifyMutation={null}
            commitMutation={null}
            automationMode={settings.automationMode}
            premiumEnabled={settings.premiumEnabled}
            autoSplitEnabled={settings.autoSplitEnabled}
            exceptionThreshold={settings.exceptionThreshold}
            categoryList={cashbook.data?.categories || []}
          />

          <ImportHistoryTable data={history.data} />
        </div>
      </div>

      {/* TRANSACTION MODAL */}
      {isModalOpen && (
        <TransactionModal
          initial={selected}
          onClose={() => setModalOpen(false)}
          onSubmit={form => {
            const processed = applyAutomationToForm(form);

            if (selected) {
              updateTxn.mutate({ id: selected.id, data: processed });
            } else {
              addTxn.mutate(processed);
            }

            setModalOpen(false);
          }}
          categoryList={cashbook.data?.categories || []}
          automationMode={settings.automationMode}
          autoSplitEnabled={settings.autoSplitEnabled}
        />
      )}
    </div>
  );
}
