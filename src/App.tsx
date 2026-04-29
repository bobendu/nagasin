import { motion } from 'framer-motion'
import './App.css'

function App() {
  return (
    <div className="app-container" style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center',
      background: 'var(--surface-color)'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="card"
        style={{ padding: '4rem', maxWidth: '600px' }}
      >
        <div style={{ 
          background: 'var(--border-color)', 
          color: 'white', 
          width: '60px', 
          height: '60px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontWeight: 900,
          fontSize: '2rem',
          margin: '0 auto 2rem'
        }}>na!</div>
        
        <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>LE NAGASIN <br /> ARRIVE BIENTÔT</h1>
        
        <div className="mono" style={{ 
          background: 'var(--accent-color)', 
          padding: '1rem', 
          border: '2px solid black',
          fontWeight: 'bold',
          marginBottom: '2rem'
        }}>
          🚧 BOUTIQUE EN TRAVAUX 🚧
        </div>
        
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
          Nous préparons les rayons, nous taillons les crayons et nous fignolons les livres. 
          Revenez très prochainement pour l'ouverture officielle.
        </p>

        <a href="https://www.dessinateur.net" className="nav-link" style={{ color: 'var(--primary-color)' }}>
          En attendant, retrouvez-moi sur dessinateur.net →
        </a>
      </motion.div>
      
      <div style={{ marginTop: '2rem', fontSize: '0.7rem', color: '#ccc', textTransform: 'uppercase', letterSpacing: '2px' }}>
        v1.0.1 • © 2026 NA! STUDIO • NAGASIN.FR
      </div>
    </div>
  )
}

export default App
