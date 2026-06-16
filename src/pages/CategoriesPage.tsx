import { useState } from 'react';
import BottomNav from '../components/BottomNav';
import type { Category } from '../types/Expense';

type Props = {
    
  categories: Category[];

  activePage: string;

  setActivePage: (page: string) => void;
  onSaveCategory: (
    name: string,
    color: string,
    icon: string
  ) => Promise<boolean | undefined>;

  onUpdateCategory: (
        categoryId: string,
        name: string,
        color: string,
        icon: string
    ) => Promise<boolean | undefined>;

    onDeleteCategory: (
        categoryId: string
    ) => Promise<boolean | undefined>;

};

export default function CategoriesPage({
  categories,
  activePage,
  setActivePage,
  onSaveCategory,
  onUpdateCategory,
  onDeleteCategory,
}: Props) {
    const [showModal, setShowModal] = useState(false);

    const [categoryName, setCategoryName] = useState('');

    const [categoryColor, setCategoryColor] = useState('#3B82F6');
    const [categoryIcon, setCategoryIcon] = useState('🍔');

    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

    const availableIcons = ['🍜', '🚗', '🏍️', '🏠', '🛒', '💊', '📚', '✈️', '💰', '🎁',
  '⚡', '📺', '👕', '❤️', '🕌', '🩺', '☕', '🔧', '🏖️', '🏷️', '📱', '🌐', '⭐', '🏦'];

    // const availableIcons = [// Makanan & Minuman '🍔', '🍕', '🍜', '🍚', '☕', '🧋', '🍺',
    // // Transport '🚗', '🏍️', '⛽', '🚕', '🚌', '🚆',
    // // Rumah Tangga '🏠', '🛋️', '🧹', '💡', '🚿',
    // // Belanja '🛒', '👕', '👟', '⌚',
    // // Kesehatan '💊', '🏥', '🦷', '🩺',
    // // Pendidikan '📚', '🎓',
    // // Hiburan '🎮', '🎬', '🎵', '📺',
    // // Travel '✈️', '🏨', '🏖️',
    // // Keuangan'💰', '📈', '🏦','💳',
    // // Keluarga '❤️', '👶', '🎁',
    // // Ibadah '🕌', '🙏',
    // // Utilitas '📱', '🌐', '📦',
    // // Lainnya '⭐', '🔥', '⚡', '🔧',
    // ];

    function startEdit(category: Category) {
        setEditingCategoryId(category.id);
        setCategoryName(category.name);
        setCategoryColor(category.color);
        setCategoryIcon(category.icon || '🍔');
        setShowModal(true);
    }

  return (
    <div className="container">
      <div className="header">
        <h1>Categories</h1>
      </div>

      <div className="card">
        Total Categories: {categories.length}
      </div>

      {categories.map((category) => (
        <div
          key={category.id}
          className="summaryRow"
          onClick={() => startEdit(category)}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: category.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
            }}
            >
            {category.icon || '🏷'}
            </div>

            <div className="summaryName">
              {category.name}
            </div>
          </div>
        </div>
      ))}

        <button
            className="fab"
            onClick={() => {
                setEditingCategoryId(null);

                setCategoryName('');

                setCategoryColor('#3B82F6');

                setShowModal(true);
            }}
            >
            +
        </button>

        {showModal && (
        <div className="modalOverlay">
            <div className="modalCard">

            <h2>
                {editingCategoryId
                ? 'Edit Category'
                : 'Add Category'}
            </h2>

            <input
                className="modalInput"
                placeholder="Category Name"
                value={categoryName}
                onChange={(e) =>
                setCategoryName(e.target.value)
                }
            />

            <label>Icon</label>
            <div className="iconGrid">
            {availableIcons.map((icon) => (
                <button
                key={icon}
                type="button"
                className={
                    categoryIcon === icon
                    ? 'iconButtonSelected'
                    : 'iconButton'
                }
                onClick={() =>
                    setCategoryIcon(icon)
                }
                >
                {icon}
                </button>
            ))}
            </div>

            <input
                type="color"
                value={categoryColor}
                onChange={(e) =>
                setCategoryColor(e.target.value)
                }
                style={{
                width: '120px',
                height: '50px',
                border: 'none',
                background: 'transparent',
                margin: '0 auto',
                display: 'block',
                }}
            />

            <div
                style={{
                textAlign: 'center',
                marginTop: '8px',
                }}
            >
                {categoryColor}
            </div>

            <div className="modalActions">
                <button
                onClick={async () => {
                    if (!categoryName.trim()) {
                    alert('Category name is required');
                    return;
                    }

                    let success;
                    if (editingCategoryId) {
                    success =
                        await onUpdateCategory(
                        editingCategoryId,
                        categoryName,
                        categoryColor,
                        categoryIcon
                        );
                    } else {
                    success =
                        await onSaveCategory(
                        categoryName,
                        categoryColor,
                        categoryIcon
                        );
                    }

                    if (success) {
                    setShowModal(false);

                    setCategoryName('');

                    setCategoryColor('#3B82F6');

                    setEditingCategoryId(null);
                    }
                }}
                >
                {editingCategoryId ? 'Update' : 'Save'}
                </button>

                {editingCategoryId && (
                <button
                    className="deleteButton"
                    onClick={async () => {
                    const confirmed = confirm(
                        'Delete this category?'
                    );

                    if (!confirmed) return;

                    const success =
                        await onDeleteCategory(
                        editingCategoryId
                        );

                    if (success) {
                        setShowModal(false);

                        setCategoryName('');

                        setCategoryColor('#3B82F6');

                        setEditingCategoryId(null);
                    }
                    }}
                >
                    Delete
                </button>
                )}

                <button
                className="modalButtonSecondary"
                onClick={() => {
                    setShowModal(false);

                    setCategoryName('');

                    setCategoryColor('#3B82F6');

                    setEditingCategoryId(null);
                }}
                >
                Cancel
                </button>
            </div>

            </div>
        </div>
        )}

      <BottomNav
        activePage={activePage}
        setActivePage={setActivePage}
      />
    </div>
  );
}