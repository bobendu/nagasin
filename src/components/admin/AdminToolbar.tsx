import { LayoutDashboard, Lock, Settings, PlusCircle } from 'lucide-react'

export default function AdminToolbar({ onOpenDashboard, onAddProduct }: { onOpenDashboard: () => void, onAddProduct: () => void }) {
  const logoBlue = '#004169'

  return (
    <div style={{
      position: 'fixed',
      top: '1.5rem',
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#050505',
      padding: '8px 24px',
      borderRadius: '0', // Coins carrés
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      zIndex: 2000,
      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      border: `1px solid ${logoBlue}`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: logoBlue, fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px' }}>
        <Lock size={14} /> MODE ÉDITION
      </div>
      
      <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />

      <button 
        onClick={onOpenDashboard}
        style={{ 
          background: 'none', border: 'none', color: 'white', cursor: 'pointer', 
          display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700 
        }}
      >
        <LayoutDashboard size={16} /> DASHBOARD
      </button>

      <button 
        onClick={onAddProduct}
        style={{ 
          background: logoBlue, color: 'white', border: 'none', cursor: 'pointer', 
          padding: '8px 20px', borderRadius: '0', // Coins carrés
          display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 900,
          letterSpacing: '1px'
        }}
      >
        <PlusCircle size={16} /> NOUVEAU PRODUIT
      </button>

      <button 
        style={{ 
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer'
        }}
      >
        <Settings size={18} />
      </button>
    </div>
  )
}
