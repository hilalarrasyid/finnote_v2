type Props = {
  activePage: string;
  setActivePage: (page: string) => void;
};

export default function BottomNav({ activePage, setActivePage }: Props) {
  return (
    <div className="bottomNav">
      <button
        className={activePage === 'home' ? 'active' : ''}
        onClick={() => setActivePage('home')}
      >
        🏠
        <span>Home</span>
      </button>

      <button
        className={activePage === 'expenses' ? 'active' : ''}
        onClick={() => setActivePage('expenses')}
      >
        🧾
        <span>Expenses</span>
      </button>

      <button
        className={activePage === 'summary' ? 'active' : ''}
        onClick={() => setActivePage('summary')}
      >
        📊
        <span>Summary</span>
      </button>

      <button
        className={activePage === 'pockets' ? 'active' : ''}
        onClick={() => setActivePage('pockets')}
      >
        💳
        <span>Pockets</span>
      </button>

      <button
        className={activePage === 'categories' ? 'active' : ''}
        onClick={() => setActivePage('categories')}
      >
        📦
        <span>Categories</span>
      </button>
    </div>
  );
}
