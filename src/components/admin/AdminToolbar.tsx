import { LayoutDashboard, Lock, Settings, PlusCircle } from 'lucide-react'

export default function AdminToolbar({ onOpenDashboard, onAddProduct }: { onOpenDashboard: () => void, onAddProduct: () => void }) {
  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(10px)',
      padding: '8px 16px',
      borderRadius: '100px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      zIndex: 900,
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      border: '1px solid rgba(255,255,255,0.1)',
      width: 'max-content',
      maxWidth: '95vw',
      overflowX: 'auto'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#00e5ff', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '1px' }}>
        <Lock size={14} /> MODE ADMIN ACTIF
      </div>
      
      <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)' }} />

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
          background: '#00e5ff', border: 'none', color: 'black', cursor: 'pointer', 
          padding: '6px 16px', borderRadius: '50px',
          display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 800 
        }}
      >
        <PlusCircle size={16} /> NOUVEAU PRODUIT
      </button>

      <button 
        style={{ 
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', 
          display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700 
        }}
      >
        <Settings size={16} />
      </button>
    </div>
  )
}
