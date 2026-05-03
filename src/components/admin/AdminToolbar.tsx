import { LayoutDashboard, Lock, Settings, PlusCircle } from 'lucide-react'

export default function AdminToolbar({ onOpenDashboard, onAddProduct }: { onOpenDashboard: () => void, onAddProduct: () => void }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 'auto',
      background: 'white',
      display: 'flex',
      zIndex: 2000,
      borderBottom: '1px solid #f2f2f2'
    }}>
      {/* LOGO SECTION (BLOC BLANC SANS MARGE) */}
      <div style={{ 
        width: '200px', 
        background: 'white',
        borderRight: '1px solid #f2f2f2'
      }}>
        <img 
          src="https://www.dessinateur.net/wp-content/uploads/2024/06/logoNadessinateur.jpg" 
          alt="na!" 
          style={{ width: '100%', display: 'block' }} 
        />
      </div>

      {/* ADMIN CONTROLS SECTION (BANDEAU NOIR / DARK) */}
      <div style={{ 
        flex: 1, 
        background: '#050505', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0 2rem',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#00e5ff', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px' }}>
          <Lock size={14} /> MODE ÉDITION
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
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
              padding: '8px 20px', borderRadius: '4px',
              display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 900 
            }}
          >
            <PlusCircle size={16} /> NOUVEAU PRODUIT
          </button>

          <button 
            style={{ 
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer'
            }}
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
