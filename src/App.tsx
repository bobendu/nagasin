import { useState } from 'react'
import { ShoppingBag, Search, User, Menu, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import './App.css'

function App() {
  const [cartCount] = useState(0)

  return (
    <div className="app-container">
      <nav className="navbar glass">
        <div className="logo">
          <ShoppingBag className="text-primary" size={28} />
          <span>NAGASIN</span>
        </div>
        
        <div className="nav-links">
          <a href="#shop" className="nav-link">Boutique</a>
          <a href="#collections" className="nav-link">Collections</a>
          <a href="#about" className="nav-link">À propos</a>
        </div>

        <div className="nav-actions" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Search size={20} className="nav-link" />
          <User size={20} className="nav-link" />
          <div style={{ position: 'relative' }}>
            <ShoppingBag size={20} className="nav-link" />
            {cartCount > 0 && (
              <span style={{ 
                position: 'absolute', 
                top: -8, 
                right: -8, 
                background: 'var(--primary-color)', 
                color: '#000', 
                fontSize: '0.7rem', 
                fontWeight: 'bold',
                padding: '2px 6px',
                borderRadius: '10px'
              }}>
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </nav>

      <header className="hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            L'Élégance <br /> Redéfinie.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Découvrez notre collection exclusive de pièces uniques, conçues pour ceux qui ne font aucun compromis sur le style.
          </motion.p>
          <motion.button 
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            Explorer la collection <ChevronRight size={18} />
          </motion.button>
        </motion.div>
      </header>

      <main className="container" style={{ paddingTop: '4rem' }}>
        <section id="shop">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Dernières Arrivées</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '2rem' 
          }}>
            {[1, 2, 3, 4].map((id) => (
              <motion.div 
                key={id}
                className="glass" 
                style={{ borderRadius: '16px', padding: '1rem', overflow: 'hidden' }}
                whileHover={{ y: -10 }}
              >
                <div style={{ 
                  height: '300px', 
                  background: '#1a1a1a', 
                  borderRadius: '12px', 
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#333'
                }}>
                  <ShoppingBag size={48} opacity={0.2} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Produit Premium #{id}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>Édition limitée • Qualité supérieure</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary-color)' }}>249,00 €</span>
                  <button className="nav-link" style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '50%' }}>
                    <ShoppingBag size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer style={{ marginTop: '8rem', padding: '4rem 0', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        <div className="logo" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
          <ShoppingBag className="text-primary" size={24} />
          <span>NAGASIN</span>
        </div>
        <p style={{ color: 'var(--text-muted)' }}>&copy; 2026 Nagasin. Tous droits réservés.</p>
      </footer>
    </div>
  )
}

export default App
