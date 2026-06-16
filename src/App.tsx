// set PATH=C:\Users\AdityaPANDU\Downloads\node-v22.22.3-win-x64;%PATH%
import HomePage from './pages/HomePage';
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import SummaryPage from './pages/SummaryPage';
import PocketsPage from './pages/PocketsPage';
import ExpensesPage from './pages/ExpensesPage';
import CategoriesPage from './pages/CategoriesPage';
import type { ExpenseDetail, 
  PocketSummary,
  Pocket,
  Category, } from './types/Expense';

export default function App() {
  const [activePage, setActivePage] = useState('home');

  const [showSettings, setShowSettings] = useState(
    !localStorage.getItem('supabase_url')
  );

  const [url, setUrl] = useState(localStorage.getItem('supabase_url') || '');

  const [key, setKey] = useState(localStorage.getItem('supabase_key') || '');

  const today = new Date();

  const [startDate, setStartDate] = useState(
    new Date(today.getFullYear(), today.getMonth() - 2, 1)
      .toISOString()
      .split('T')[0]
  );

  const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);

  const [loading, setLoading] = useState(false);

  const [expenses, setExpenses] = useState<ExpenseDetail[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<ExpenseDetail[]>([]);
  const [topPockets, setTopPockets] = useState<PocketSummary[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [pockets, setPockets] = useState<Pocket[]>([]);

  const supabase = useMemo(() => {
    if (!url || !key) return null;
    return createClient(url, key);
  }, [url, key]);

  async function loadData() {
    if (!supabase) return;

    setLoading(true);

    localStorage.setItem('supabase_url', url);
    localStorage.setItem('supabase_key', key);

    const expenseResult = await supabase
      .from('expense_details')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    const categoryResult = await supabase
      .from('categories')
      .select('id, name, color, icon')
      .order('name');

    const pocketResult = await supabase
      .from('pockets')
      .select('id, name, color')
      .order('name');

    // console.log('CATEGORY ERROR', categoryResult.error);
    // console.log('POCKET ERROR', pocketResult.error);

    // console.log('CATEGORY DATA', categoryResult.data);
    // console.log('POCKET DATA', pocketResult.data);

    if (expenseResult.error) {
      alert(expenseResult.error.message);
      setLoading(false);
      return;
    }

    setCategories(categoryResult.data || []);
    setPockets(pocketResult.data || []);
    // console.log('POCKETS', pocketResult.data);

    const data = (expenseResult.data || []) as ExpenseDetail[];

    setExpenses(data);

    const recent = [...data]
      .sort((a, b) => {
        const d1 = new Date(a.created_at).getTime();
        const d2 = new Date(b.created_at).getTime();
        return d2 - d1;
      })
      .slice(0, 5);

    setRecentExpenses(recent);

    const pocketMap: Record<string, number> = {};

    data.forEach((item) => {
      const pocket = item.pocket_name || '-';

      pocketMap[pocket] = (pocketMap[pocket] || 0) + Number(item.amount || 0);
    });

    const pocketSummary = Object.entries(pocketMap)
      .map(([pocketName, amount]) => ({
        pocketName,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    setTopPockets(pocketSummary);

    setLoading(false);
    setShowSettings(false);
  }

  async function addExpense(
    amount: number,
    description: string,
    categoryId: string,
    pocketId: string,
    expenseDate: string
  ) {
    if (!supabase) return;

    const result = await supabase.from('expenses').insert({
      amount,
      description,
      category_id: categoryId,
      pocket_id: pocketId,
      date: expenseDate,
    });

    if (result.error) {
      alert(result.error.message);
      return false;
    }

    await loadData();

    return true;
  }

  async function updateExpense(
    expenseId: string,
    amount: number,
    description: string,
    categoryId: string,
    pocketId: string,
    expenseDate: string
  ) {
    if (!supabase) return;

    const result = await supabase
      .from('expenses')
      .update({
        amount,
        description,
        category_id: categoryId,
        pocket_id: pocketId,
        date: expenseDate,
      })
      .eq('id', expenseId);

    if (result.error) {
      alert(result.error.message);
      return false;
    }

    await loadData();

    return true;
  }

  async function deleteExpense(expenseId: string) {
    if (!supabase) return;

    const result = await supabase.from('expenses').delete().eq('id', expenseId);

    if (result.error) {
      alert(result.error.message);
      return false;
    }

    await loadData();

    return true;
  }

  async function addPocket(
    name: string,
    color: string
  ) {
    if (!supabase) return;

    const result = await supabase
      .from('pockets')
      .insert({
        name,
        color,
      });

    if (result.error) {
      alert(result.error.message);
      return false;
    }
    await loadData();
    return true;
  }

  async function addCategory(
    name: string,
    color: string,
    icon: string
  ) {
    if (!supabase) return;
    const result = await supabase
      .from('categories')
      .insert({
        name,
        color,
        icon,
      });
    if (result.error) {
      alert(result.error.message);
      return false;
    }
    await loadData();
    return true;
  }

  async function updateCategory(
    categoryId: string,
    name: string,
    color: string,
    icon: string
  ) {
    if (!supabase) return;
    const result = await supabase
      .from('categories')
      .update({
        name,
        color,
        icon,
      })
      .eq('id', categoryId);
    if (result.error) {
      alert(result.error.message);
      return false;
    }
    await loadData();
    return true;
  }

  async function deleteCategory(
    categoryId: string
  ) {
    if (!supabase) return;
    const result = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (result.error) {
      alert(result.error.message);
      return false;
    }
    await loadData();
    return true;
  }

  async function updatePocket(
    pocketId: string,
    name: string,
    color: string
  ) {
      if (!supabase) return;
      const result = await supabase
        .from('pockets')
        .update({
          name,
          color,
        })
        .eq('id', pocketId);
      if (result.error) {
        alert(result.error.message);
        return false;
      }
      await loadData();
      return true;
  }

  async function deletePocket(
    pocketId: string
  ) {
    if (!supabase) return;

    const result = await supabase
      .from('pockets')
      .delete()
      .eq('id', pocketId);

    if (result.error) {
      alert(result.error.message);
      return false;
    }

    await loadData();

    return true;
  }

  useEffect(() => {
    if (supabase) {
      loadData();
    }
  }, [supabase, startDate, endDate]);

  const totalExpense = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  if (activePage === 'expenses') {
    return (
      <ExpensesPage
        expenses={expenses}
        categories={categories}
        pockets={pockets}
        activePage={activePage}
        setActivePage={setActivePage}
        onSaveExpense={addExpense}
        onUpdateExpense={updateExpense}
        onDeleteExpense={deleteExpense}
      />
    );
  }

  if (activePage === 'summary') {
    return (
      <SummaryPage
        expenses={expenses}
        activePage={activePage}
        setActivePage={setActivePage}
      />
    );
  }

  if (activePage === 'pockets') {
    return (
      <PocketsPage
        pockets={pockets}
        activePage={activePage}
        setActivePage={setActivePage}
        onSavePocket={addPocket}
        onUpdatePocket={updatePocket}
        onDeletePocket={deletePocket}
      />
    );
  }

  if (activePage === 'categories') {
    return (
      <CategoriesPage
        categories={categories}
        activePage={activePage}
        setActivePage={setActivePage}
        onSaveCategory={addCategory}
        onUpdateCategory={updateCategory}
        onDeleteCategory={deleteCategory} 
      />
    );
  }

  return (
    <HomePage
      showSettings={showSettings}
      setShowSettings={setShowSettings}
      url={url}
      setUrl={setUrl}
      keyValue={key}
      setKeyValue={setKey}
      startDate={startDate}
      setStartDate={setStartDate}
      endDate={endDate}
      setEndDate={setEndDate}
      loadData={loadData}
      loading={loading}
      expenses={expenses}
      recentExpenses={recentExpenses}
      topPockets={topPockets}
      totalExpense={totalExpense}
      activePage={activePage}
      setActivePage={setActivePage}
    />
  );
}
