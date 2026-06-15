import { useState, useEffect } from 'react'
import StoreApp from './StoreApp'
import { motion } from 'framer-motion'
import { Lock, Edit3, Eye, EyeOff } from 'lucide-react'
import OrderStatusTracking from './components/OrderStatusTracking'

function App() {
  const [view, setView] = useState<'maintenance' | 'login' | 'admin' | 'store' | 'tracking'>('maintenance')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [adminToken, setAdminToken] = useState('') // Stocke le password pour l'API
  const [user, setUser] = useState('')
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const [, setSecretClicks] = useState(0)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const orderId = params.get('orderId')
    if (orderId) {
      setTrackingOrderId(orderId)
      setView('tracking')
    } else if (window.location.pathname.includes('nadmin') || window.location.search.includes('nadmin')) {
      if (!isLoggedIn) setView('login')
    }
  }, [isLoggedIn])

  const handleSecretClick = () => {
    setSecretClicks(prev => {
      const next = prev + 1
      if (next >= 5) {
        setView('store')
        return 0
      }
      return next
    })
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'nagasin2026'
    if (user.toLowerCase() === 'na' && password === adminPassword) {
      setIsLoggedIn(true)
      setAdminToken(password)
      setView('store')
    } else {
      alert("Accès refusé.")
    }
  }

  // --- TRACKING VIEW ---
  if (view === 'tracking') {
    return (
      <OrderStatusTracking 
        orderId={trackingOrderId} 
        onClose={() => {
          window.history.replaceState({}, document.title, window.location.pathname)
          setView('maintenance')
        }} 
      />
    )
  }

  // --- MAINTENANCE ---
  if (view === 'maintenance') {
    return (
      <div className="maintenance-container">
        <aside className="maintenance-sidebar">
           <img 
            src="https://www.dessinateur.net/wp-content/uploads/2024/06/logoNadessinateur.jpg" 
            alt="na!" 
            onClick={handleSecretClick}
            style={{ cursor: 'default' }}
           />
           <div className="maintenance-copyright">© 2026 NA! STUDIO</div>
        </aside>
        <main className="maintenance-main">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="maintenance-content">
             <h1 className="maintenance-title">LE NAGASIN <br />EST EN TRAVAUX.</h1>
             <p className="maintenance-desc">
               La boutique officielle de <strong>na!</strong> prépare ses rayons. <br />
               Revenez très bientôt pour découvrir les ouvrages et dessins originaux.
             </p>
             <div className="maintenance-divider"></div>
             
             {isLoggedIn && (
               <button onClick={() => setView('admin')} className="btn-resume-edit">
                 <Edit3 size={16} /> REPRENDRE L'ÉDITION
               </button>
             )}
          </motion.div>
        </main>
      </div>
    )
  }

  // --- LOGIN ---
  if (view === 'login') {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        <form onSubmit={handleLogin} style={{ background: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <img src="https://www.dessinateur.net/wp-content/uploads/2024/06/logoNadessinateur.jpg" alt="na!" style={{ width: '80px', marginBottom: '2rem' }} />
          <h2 style={{ marginBottom: '2rem', fontSize: '1.2rem', fontWeight: 900 }}>ACCÈS RÉSERVÉ</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="Identifiant" value={user} onChange={(e) => setUser(e.target.value)} style={{ padding: '1rem', border: '1px solid #eee' }} />
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Mot de passe" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                style={{ padding: '1rem', paddingRight: '3rem', border: '1px solid #eee', width: '100%' }} 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#999',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button type="submit" style={{ background: '#000', color: '#fff', padding: '1rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Lock size={16} /> SE CONNECTER
            </button>
          </div>
        </form>
      </div>
    )
  }

  // --- STORE FRONT ---
  return (
    <StoreApp 
      isAdmin={isLoggedIn} 
      adminToken={adminToken}
      onLogout={() => {
        setIsLoggedIn(false)
        setAdminToken('')
        setView('store')
      }}
      onGoToLogin={() => setView('login')}
    />
  )
}

export default App
