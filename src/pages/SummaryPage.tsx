import BottomNav from '../components/BottomNav';
import type { ExpenseDetail } from '../types/Expense';

type Props = {
  expenses: ExpenseDetail[];

  activePage: string;
  startDate: string;
  endDate: string;

  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setActivePage: (page: string) => void;
};

export default function SummaryPage({
  expenses,
  activePage,
  setActivePage,
}: Props) {
  const categoryMap: Record<string, { amount: number; icon: string; color: string; }> = {};
  const pocketMap: Record<string, number> = {};
  const totalExpense = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  expenses.forEach((item) => {
    const pocket = item.pocket_name || '-';

    pocketMap[pocket] = (pocketMap[pocket] || 0) + Number(item.amount || 0);
  });

  expenses.forEach((item) => {
    const category = item.category_name || '-';

    if (!categoryMap[category]) {
      categoryMap[category] = {
        amount: 0,
        icon: item.category_icon || '🏷️',
        color: item.category_color || '#374151',
      };
    }

    categoryMap[category].amount += Number(
      item.amount || 0
    );
  });

  const categoryData = Object.entries(categoryMap)
    .map(([name, data]) => ({
      name,
      amount: data.amount,
      icon: data.icon,
      color: data.color,
    }))
    .sort((a, b) => b.amount - a.amount);

  const pocketData = Object.entries(pocketMap)
    .map(([name, amount]) => ({
      name,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount);

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Summary</h1>
      </div>
      <br />

      <div className="card">
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <label>From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="modalInput"
            />
          </div>

          <div style={{ flex: 1 }}>
            <label>To</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="modalInput"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Expense by Category</h2>
      </div>
      {categoryData.map((item) => (
        <div key={item.name} className="summaryRow">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: item.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              {item.icon}
            </div>

            <div className="summaryName">
              {item.name} (
              {((item.amount / totalExpense) * 100).toFixed(1)}
              %)
            </div>
          </div>

          <div className="expenseAmountRight">
            {formatCurrency(item.amount)}
          </div>
        </div>
      ))}
      <br />
      <div className="card">
        <h2>Expense by Pocket</h2>
      </div>
      {pocketData.map((item) => (
        <div key={item.name} className="summaryRow">
          <div>
            <div className="summaryName">
              {item.name} ({((item.amount / totalExpense) * 100).toFixed(1)}
              %)
            </div>
          </div>

          <div className="summaryAmount">{formatCurrency(item.amount)}</div>
        </div>
      ))}

      <BottomNav activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
}
