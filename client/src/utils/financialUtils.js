export function filterTransactions(transactions, filters) {
  let result = [...transactions];

  if (filters.search.trim() !== '') {
    result = result.filter(t => t.description.toLowerCase().includes(filters.search.toLowerCase()));
  }

  if (filters.category !== 'All') {
    result = result.filter(t => t.category === filters.category);
  }

  if (filters.dateFrom) {
    result = result.filter(t => new Date(t.date) >= new Date(filters.dateFrom));
  }

  if (filters.dateTo) {
    result = result.filter(t => new Date(t.date) <= new Date(filters.dateTo));
  }

  return result;
}

export function calculateSummary(filtered) {
  const income = filtered
    .filter(t => Number(t.amount) > 0)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenses = filtered
    .filter(t => Number(t.amount) < 0)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return {
    income,
    expenses,
    net: income + expenses
  };
}

export function exportTransactionsCSV(filtered) {
  const rows = [
    ['Date', 'Category', 'Fund', 'Amount', 'Description'],
    ...filtered.map(t => [t.date, t.category, t.fund, t.amount, t.description])
  ];

  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'financials.csv';
  a.click();
}
