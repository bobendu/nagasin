import { useState, useEffect } from 'react'
import StoreApp from './StoreApp'
import AdminApp from './AdminApp'
import { motion } from 'framer-motion'
import { Lock, Edit3 } from 'lucide-react'

function App() {
  const isAdminPath = window.location.pathname.includes('nadmin') || window.location.search.includes('nadmin')
  
  const [view, setView] = useState<'maintenance' | 'login' | 'admin' | 'store'>(isAdminPath ? 'login' : 'maintenance')
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
      <div style={{ height: '100vh', display: 'flex', background: '#e1f0ff' }}>
        <aside style={{ width: '200px', background: 'white', display: 'flex', flexDirection: 'column', borderRight: '1px solid #f2f2f2' }}>
           <img src="https://www.dessinateur.net/wp-content/uploads/2024/06/logoNadessinateur.jpg" alt="na!" style={{ width: '100%' }} />
           <div style={{ marginTop: 'auto', padding: '1.5rem', fontSize: '0.6rem', color: '#ccc', fontWeight: 700 }}>© 2026 NA! STUDIO</div>
        </aside>
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '4rem' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <h4 style={{ color: '#004369', letterSpacing: '3px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>OFFICIEL</h4>
             <h1 style={{ fontSize: '4.2rem', lineHeight: 1.1, marginBottom: '2rem' }}>LE NAGASIN <br />EST EN TRAVAUX.</h1>
             <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '500px', lineHeight: 1.6 }}>
               La boutique officielle de <strong>na!</strong> prépare ses rayons. <br />
               Revenez très bientôt pour découvrir les ouvrages et dessins originaux.
             </p>
             <div style={{ marginTop: '3rem', height: '2px', background: '#004369', width: '60px' }}></div>
             
             {isLoggedIn && (
               <button onClick={() => setView('admin')} style={{ marginTop: '4rem', display: 'flex', alignItems: 'center', gap: '10px', background: '#fffbeb', border: '1px solid #fbbf24', padding: '10px 20px', fontWeight: 800, cursor: 'pointer' }}>
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
            <button type="submit" style={{ background: '#000', color: '#fff', padding: '1rem', fontWeight: 800, cursor: 'pointer' }}>SE CONNECTER</button>
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
  return <StoreApp isAdmin={isLoggedIn} onEdit={() => setView('admin')} />
}

export default App
