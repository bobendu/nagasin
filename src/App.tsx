import { useState, useEffect } from 'react'
import StoreApp from './StoreApp'
import AdminApp from './AdminApp'
import { motion } from 'framer-motion'
import { Lock, Edit3 } from 'lucide-react'

function App() {
  const [view, setView] = useState<'maintenance' | 'login' | 'admin' | 'store'>('store')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [user, setUser] = useState('')

  useEffect(() => {
    if (window.location.pathname.includes('nadmin') || window.location.search.includes('nadmin')) {
      if (!isLoggedIn) setView('login')
    }
  }, [isLoggedIn])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (user.toLowerCase() === 'na' && password === 'nagasin2026') {
      setIsLoggedIn(true)
      setView('admin')
    } else {
      alert("Accès refusé.")
    }
  }

  // --- MAINTENANCE ---
  if (view === 'maintenance') {
    return (
      <div className="maintenance-container">
        <aside className="maintenance-sidebar">
           <img src="https://www.dessinateur.net/wp-content/uploads/2024/06/logoNadessinateur.jpg" alt="na!" />
           <div className="maintenance-copyright">© 2026 NA! STUDIO</div>
        </aside>
        <main className="maintenance-main">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="maintenance-content">
             <h4 className="maintenance-tag">OFFICIEL</h4>
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
            <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '1rem', border: '1px solid #eee' }} />
            <button type="submit" style={{ background: '#000', color: '#fff', padding: '1rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Lock size={16} /> SE CONNECTER
            </button>
          </div>
        </form>
      </div>
    )
  }

  // --- ADMIN DASHBOARD ---
  if (view === 'admin') {
    return <AdminApp onBack={() => setView('store')} />
  }

  // --- STORE FRONT ---
  return <StoreApp isAdmin={isLoggedIn} />
}

export default App
