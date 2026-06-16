import BottomNav from '../components/BottomNav';
import type { ExpenseDetail, PocketSummary } from '../types/Expense';

type Props = {
  showSettings: boolean;
  setShowSettings: (value: boolean) => void;

  url: string;
  setUrl: (value: string) => void;

  keyValue: string;
  setKeyValue: (value: string) => void;

  startDate: string;
  setStartDate: (value: string) => void;

  endDate: string;
  setEndDate: (value: string) => void;

  loadData: () => void;

  loading: boolean;

  expenses: ExpenseDetail[];
  recentExpenses: ExpenseDetail[];

  topPockets: PocketSummary[];

  totalExpense: number;

  activePage: string;
  setActivePage: (page: string) => void;
};

export default function HomePage(props: Props) {
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
        <h1>FinNote</h1>

        <button
          className="smallButton"
          onClick={() => props.setShowSettings(!props.showSettings)}
        >
          ⚙️
        </button>
      </div>

      {props.showSettings && (
        <div className="card">
          <input
            placeholder="Supabase URL"
            value={props.url}
            onChange={(e) => props.setUrl(e.target.value)}
          />

          <input
            placeholder="Supabase Anon Key"
            value={props.keyValue}
            onChange={(e) => props.setKeyValue(e.target.value)}
          />

          <button onClick={props.loadData}>Save</button>
        </div>
      )}

      <div className="card">
        <div className="dateRange">
          <div className="dateField">
            <label>📅 Start Date</label>

            <input
              type="date"
              value={props.startDate}
              onChange={(e) => props.setStartDate(e.target.value)}
            />
          </div>

          <div className="dateField">
            <label>📅 End Date</label>

            <input
              type="date"
              value={props.endDate}
              onChange={(e) => props.setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Total Expense</h2>

        {props.loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="total">{formatCurrency(props.totalExpense)}</div>

            <div className="transactionCount">
              {props.expenses.length} Transactions
            </div>
          </>
        )}
      </div>

      <div className="card">
        <h2>Top Pockets</h2>

        {props.topPockets.map((item) => {
          const percent =
            props.totalExpense === 0
              ? 0
              : (item.amount / props.totalExpense) * 100;

          return (
            <div key={item.pocketName} className="row">
              <span>{item.pocketName}</span>

              <strong>
                {formatCurrency(item.amount)} ({percent.toFixed(0)}%)
              </strong>
            </div>
          );
        })}
      </div>

      <div className="card">
        <h2>Recent Expenses</h2>

        {props.recentExpenses.map((item) => (
          <div key={item.id} className="expenseCard">
            <div className="expenseCategory">{item.category_name || '-'}</div>

            <div className="expenseDescription">{item.description || '-'}</div>

            <div className="expenseMeta">
              {new Date(item.date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
              })}
              {' • '}
              {item.pocket_name || '-'}
            </div>

            <div className="expenseAmount">
              {formatCurrency(Number(item.amount))}
            </div>
          </div>
        ))}
      </div>

      <BottomNav
        activePage={props.activePage}
        setActivePage={props.setActivePage}
      />
    </div>
  );
}
