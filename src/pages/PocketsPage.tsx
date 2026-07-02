import { useState } from 'react';
import BottomNav from '../components/BottomNav';
import type { Pocket } from '../types/Expense';

type Props = {
  pockets: Pocket[];
  activePage: string;

  setActivePage: (page: string) => void;

  onSavePocket: (
    name: string,
    color: string
  ) => Promise<boolean | undefined>;

  onUpdatePocket: (
    pocketId: string,
    name: string,
    color: string
  ) => Promise<boolean | undefined>;

  onDeletePocket: (
    pocketId: string
  ) => Promise<boolean | undefined>;

};

export default function PocketsPage({
  pockets,
  activePage,
  setActivePage,
  onSavePocket,
  onUpdatePocket,
  onDeletePocket,
}: Props) {

  const [showModal, setShowModal] = useState(false);

  const [pocketName, setPocketName] = useState('');

  const [pocketColor, setPocketColor] = useState('#3B82F6');

  const [editingPocketId, setEditingPocketId] = useState<string | null>(null);

  function startEdit(pocket: Pocket) {
    setEditingPocketId(pocket.id);
    setPocketName(pocket.name);
    setPocketColor(pocket.color);
    setShowModal(true);
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Pockets</h1>
      </div>

      <div className="card">
        Total Pockets: {pockets.length}
      </div>

      {pockets.map((pocket) => (
        <div
          key={pocket.id}
          className="summaryRow"
          onClick={() => startEdit(pocket)}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: pocket.color,
              }}
            />

            <div className="summaryName">
              {pocket.name}
            </div>
          </div>
        </div>
      ))}

      <button
        className="fab"
        onClick={() => {
          setEditingPocketId(null);

          setPocketName('');

          setPocketColor('#3B82F6');

          setShowModal(true);
        }}
      >
        +
      </button>
      {showModal && (
        <div className="modalOverlay">
          <div className="modalCard">
            <h2> {editingPocketId ? 'Edit Pocket' : 'Add Pocket'}</h2>

            <input
              className="modalInput"
              placeholder="Pocket Name"
              value={pocketName}
              onChange={(e) =>
                setPocketName(e.target.value)
              }
            />

            <input
              type="color"
              value={pocketColor}
              onChange={(e) =>
                setPocketColor(e.target.value)
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
              {pocketColor}
            </div>

            <div className="modalActions">

              <button
                onClick={async () => {
                  if (!pocketName.trim()) {
                    alert('Pocket name is required');
                    return;
                  }

                  let success;

                  if (editingPocketId) {
                    success =
                      await onUpdatePocket(
                        editingPocketId,
                        pocketName,
                        pocketColor
                      );
                  } else {
                    success =
                      await onSavePocket(
                        pocketName,
                        pocketColor
                      );
                  }

                  if (success) {
                    setShowModal(false);
                    setPocketName('');
                    setPocketColor('#3B82F6');
                    setEditingPocketId(null);
                  }
                }}
              >
                {editingPocketId ? 'Update' : 'Save'}
              </button>

              {editingPocketId && (
                <button
                  className="deleteButton"
                  onClick={async () => {
                    const confirmed = confirm(
                      'Delete this pocket?'
                    );

                    if (!confirmed) return;

                    const success =
                      await onDeletePocket(
                        editingPocketId
                      );

                    if (success) {
                      setShowModal(false);
                      setPocketName('');
                      setPocketColor('#3B82F6');
                      setEditingPocketId(null);
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

                  setPocketName('');

                  setPocketColor('#3B82F6');

                  setEditingPocketId(null);
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