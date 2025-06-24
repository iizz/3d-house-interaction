import { ThreeCanvas } from './components/ThreeCanvas';
import { usePartStore } from './store/partStore';

const PARTS = ['Foundation', 'Wall'];

function App() {
  const selectedPart = usePartStore((s) => s.selectedPart);
  const setSelectedPart = usePartStore((s) => s.setSelectedPart);

  return (
    <div>
      <canvas
        id='three-canvas'
        style={{ display: 'block', width: '100vw', height: '100vh' }}
      />
      <ThreeCanvas />
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          padding: 16,
        }}
      >
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PARTS.map((name) => (
              <button
                key={name}
                style={{
                  background: selectedPart === name ? 'orange' : '#eee',
                  color: selectedPart === name ? '#fff' : '#222',
                  border: 'none',
                  borderRadius: 4,
                  padding: '4px 12px',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedPart(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flex: '1 1 100%', marginTop: 8 }}>
            <button
              style={{
                width: '100%',
                background: '#fff',
                border: '1px solid #ddd',
                color: '#222',
                borderRadius: 4,
                padding: '4px 12px',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedPart(null)}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
