import { LayoutDashboard, Lock, Settings, PlusCircle, CheckCircle } from 'lucide-react'

export default function AdminToolbar({ 
  onOpenDashboard, 
  onAddProduct, 
  onPublish, 
  hasChanges,
  onLogout
}: { 
  onOpenDashboard: () => void, 
  onAddProduct: () => void,
  onPublish: () => void,
  hasChanges: boolean,
  onLogout?: () => void
}) {
  const logoBlue = '#004169'

  return (
    <div style={{
      position: 'fixed',
      top: '1.5rem',
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#050505',
      padding: '8px 24px',
      borderRadius: '0',
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      zIndex: 2000,
      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      border: `1px solid ${hasChanges ? logoBlue : '#333'}`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: hasChanges ? '#fbbf24' : logoBlue, fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px' }}>
        <Lock size={14} /> {hasChanges ? 'BROUILLON EN COURS' : 'MODE ÉDITION'}
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
          background: 'none', border: `1px solid ${logoBlue}`, color: 'white', cursor: 'pointer', 
          padding: '8px 20px', borderRadius: '0',
          display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700
        }}
      >
        <PlusCircle size={16} /> NOUVEAU PRODUIT
      </button>

      {hasChanges && (
        <button 
          onClick={onPublish}
          style={{ 
            background: logoBlue, color: 'white', border: 'none', cursor: 'pointer', 
            padding: '8px 20px', borderRadius: '0',
            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 900,
            letterSpacing: '1px', boxShadow: '0 0 20px rgba(0,65,105,0.5)'
          }}
        >
          <CheckCircle size={16} /> PUBLIER LES CHANGEMENTS
        </button>
      )}

      <button 
        onClick={onLogout}
        style={{ 
          background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', 
          display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700 
        }}
      >
        <Lock size={16} /> QUITTER
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
