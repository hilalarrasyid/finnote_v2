import { useState } from 'react';
import BottomNav from '../components/BottomNav';
import type { ExpenseDetail } from '../types/Expense';

type Category = {
  id: string;
  name: string;
};

type Pocket = {
  id: string;
  name: string;
};

type Props = {
  expenses: ExpenseDetail[];

  categories: Category[];
  pockets: Pocket[];

  activePage: string;

  setActivePage: (page: string) => void;
  onDeleteExpense: (expenseId: string) => Promise<boolean | undefined>;

  onSaveExpense: (
    amount: number,
    description: string,
    categoryId: string,
    pocketId: string,
    expenseDate: string
  ) => Promise<boolean | undefined>;

  onUpdateExpense: (
    expenseId: string,
    amount: number,
    description: string,
    categoryId: string,
    pocketId: string,
    expenseDate: string
  ) => Promise<boolean | undefined>;
};

export default function ExpensesPage({
  expenses,
  categories,
  pockets,
  activePage,
  setActivePage,
  onSaveExpense,
  onUpdateExpense,
  onDeleteExpense,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const [categoryId, setCategoryId] = useState('');
  const [pocketId, setPocketId] = useState('');

  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [saving, setSaving] = useState(false);

  function resetForm() {
    setAmount('');
    setDescription('');
    setCategoryId('');
    setPocketId('');

    setExpenseDate(new Date().toISOString().split('T')[0]);
    setEditingExpenseId(null);
  }

  function startEdit(expense: ExpenseDetail) {
    setEditingExpenseId(expense.id);

    setAmount(String(expense.amount));
    setDescription(expense.description || '');

    setCategoryId(expense.category_id || '');
    setPocketId(expense.pocket_id || '');

    setExpenseDate(expense.date);

    setShowAddExpense(true);
  }

  const filteredExpenses = expenses.filter((item) => {
    const search = searchTerm.toLowerCase();

    return (
      (item.description || '').toLowerCase().includes(search) ||
      (item.category_name || '').toLowerCase().includes(search) ||
      (item.pocket_name || '').toLowerCase().includes(search) ||
      String(item.amount).includes(search)
    );
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();

      case 'highest':
        return Number(b.amount) - Number(a.amount);

      case 'lowest':
        return Number(a.amount) - Number(b.amount);

      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const filteredAmount = filteredExpenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

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
        <h1>Expenses</h1>
      </div>

      <div className="card">
        <div>
          <strong>Total Records: {filteredExpenses.length}</strong>
        </div>

        <div style={{ marginTop: '8px' }}>
          Total Amount: <b>{formatCurrency(filteredAmount)}</b>
        </div>
        <select
          className="filterSelect"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="latest">Latest Date</option>

          <option value="oldest">Oldest Date</option>

          <option value="highest">Highest Amount</option>

          <option value="lowest">Lowest Amount</option>
        </select>
      </div>

      <div className="searchBox">
        <input
          type="text"
          placeholder="🔍 Search description, category, pocket, amount..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="card">
        {sortedExpenses.map((item) => (
          <div
            key={item.id}
            className="expenseListItem"
            onClick={() => startEdit(item)}
          >
            <div
              className="expenseIcon"
              style={{
                backgroundColor:
                  item.category_color || '#374151',
              }}
            >
              {item.category_icon || '🏷️'}
            </div>
            <div className="expenseContent">
              <div className="expenseTitle">{item.description || '-'}</div>

              <div className="expenseSubtitle">
                {item.category_name || '-'}
                {' • '}
                {item.pocket_name || '-'}
                {' • '}
                {item.date}
              </div>
            </div>

            <div className="expenseAmountRight">
              {formatCurrency(Number(item.amount))}
            </div>
          </div>
        ))}
      </div>

      <button
        className="floatingButton"
        onClick={() => {
          console.log('BUTTON CLICKED');
          setShowAddExpense(true);
        }}
      >
        +
      </button>

      {showAddExpense && (
        <div
          className="modalOverlay"
          onClick={() => {
            resetForm();
            setShowAddExpense(false);
          }}
        >
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <h2>{editingExpenseId ? 'Edit Expense' : 'Add Expense'}</h2>

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label>Category</label>

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select Category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <label>Pocket</label>

            <select
              value={pocketId}
              onChange={(e) => setPocketId(e.target.value)}
            >
              <option value="">Select Pocket</option>

              {pockets.map((pocket) => (
                <option key={pocket.id} value={pocket.id}>
                  {pocket.name}
                </option>
              ))}
            </select>
            <label>Date</label>
            <input
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
            />

            <div className="modalActions">
              <button
                disabled={saving}
                onClick={async () => {
                  if (saving) return;

                  if (!amount) {
                    alert('Amount wajib diisi');
                    return;
                  }

                  if (!categoryId) {
                    alert('Pilih Category');
                    return;
                  }

                  if (!pocketId) {
                    alert('Pilih Pocket');
                    return;
                  }

                  setSaving(true);

                  const success = editingExpenseId
                    ? await onUpdateExpense(
                        editingExpenseId,
                        Number(amount),
                        description,
                        categoryId,
                        pocketId,
                        expenseDate
                      )
                    : await onSaveExpense(
                        Number(amount),
                        description,
                        categoryId,
                        pocketId,
                        expenseDate
                      );

                  setSaving(false);

                  if (success) {
                    resetForm();

                    setShowAddExpense(false);
                  }
                }}
              >
                {saving ? 'Saving...' : editingExpenseId ? 'Update' : 'Save'}
              </button>

              {editingExpenseId && (
                <button
                  onClick={async () => {
                    const confirmed = window.confirm('Delete this expense?');

                    if (!confirmed) return;

                    const success = await onDeleteExpense(editingExpenseId);

                    if (success) {
                      resetForm();

                      setShowAddExpense(false);
                    }
                  }}
                >
                  Delete
                </button>
              )}

              <button
                onClick={() => {
                  resetForm();
                  setShowAddExpense(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <BottomNav activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
}
