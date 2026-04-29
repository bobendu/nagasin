import { useState, useEffect } from 'react'
import { ShoppingCart, ArrowRight, X, Trash2, ShoppingBag, PenLine } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

import type { Product } from './data/products'

interface CartItem extends Product {
  dedication?: string;
}

export default function StoreApp() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('nagasin_catalog')
    if (saved) {
      setProducts(JSON.parse(saved))
    } else {
      fetch('/api/products.json')
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(err => console.error("Erreur chargement catalogue:", err))
    }
  }, [])

  const total = cart.reduce((sum, item) => sum + item.price, 0)

  const addToCart = (item: Product) => {
    setCart([...cart, { ...item, dedication: '' }])
    setIsCartOpen(true)
  }

  const removeFromCart = (index: number) => {
    const newCart = [...cart]
    newCart.splice(index, 1)
    setCart(newCart)
  }

  const updateDedication = (index: number, text: string) => {
    const newCart = [...cart]
    newCart[index].dedication = text
    setCart(newCart)
  }

  return (
    <div className="app-layout">
      {/* SIDEBAR MINIMALISTE */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img 
            src="https://www.dessinateur.net/wp-content/uploads/2024/06/logoNadessinateur.jpg" 
            alt="na!" 
          />
        </div>
        
        <nav className="sidebar-nav" style={{ padding: '2rem 1.5rem' }}>
          <button 
            onClick={() => setIsCartOpen(true)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              fontSize: '0.85rem', 
              fontWeight: 800,
              border: 'none',
              background: 'none',
              padding: 0,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
             <ShoppingCart size={18} strokeWidth={2} />
             PANIER ({cart.length})
          </button>
        </nav>

        <div style={{ marginTop: 'auto', padding: '1.5rem', fontSize: '0.6rem', color: '#ccc', fontWeight: 700 }}>
          © 2026 NA! STUDIO
        </div>
      </aside>

      {/* CONTENU "ONE PAGE" */}
      <main className="main-content">
        <header style={{ marginBottom: '4rem' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 style={{ fontSize: '3.5rem', lineHeight: 1, marginBottom: '0.8rem' }}>LE NAGASIN.</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', lineHeight: 1.5 }}>
              Boutique officielle de <strong>na!</strong>. <br />
              Ouvrages, dessins et curiosités graphiques.
            </p>
          </motion.div>
        </header>

        {/* CATALOGUE */}
        <section id="catalogue" className="product-grid">
          {products.map((item) => (
            <div key={item.id} className="item-card-clean" style={{ paddingBottom: '3rem' }}>
              <div className="image-container">
                <img src={item.image} alt={item.title} />
              </div>
              <div>
                <span style={{ color: 'var(--primary-color)', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '2px' }}>{item.category}</span>
                <h3 style={{ fontSize: '1.6rem', margin: '0.5rem 0 1rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: '1.5', maxWidth: '400px' }}>
                  {item.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 900, fontSize: '1.3rem' }}>{item.price} €</span>
                  <button className="btn-cta" onClick={() => addToCart(item)}>
                    ACHETER <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* SECTION CONTACT / INFOS (FIN DE PAGE) */}
        <section style={{ borderTop: '1px solid #eee', marginTop: '6rem', padding: '4rem 0' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Contact & Projets</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '500px', marginBottom: '2rem' }}>
            Pour toute question sur votre commande ou un projet spécifique, n'hésitez pas à me contacter.
          </p>
          <a href="https://www.dessinateur.net/contact/" className="btn-cta" style={{ border: '1px solid #000', padding: '1rem 2.5rem' }}>
            Me contacter
          </a>
        </section>
      </main>

      {/* OVERLAY PANIER */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="cart-overlay"
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.1)', backdropFilter: 'blur(4px)', zIndex: 200 }}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ 
                position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(450px, 100%)', 
                background: 'white', zIndex: 201, padding: '2.5rem',
                boxShadow: '-10px 0 30px rgba(0,0,0,0.05)',
                display: 'flex', flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>VOTRE PANIER</h2>
                <X style={{ cursor: 'pointer' }} onClick={() => setIsCartOpen(false)} />
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {cart.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <ShoppingBag size={40} color="#eee" style={{ marginBottom: '1rem' }} />
                    <p style={{ color: '#999', fontSize: '0.9rem' }}>Votre panier est vide.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    {cart.map((item, index) => (
                      <div key={index} style={{ borderBottom: '1px solid #f9f9f9', paddingBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                          <img src={item.image} style={{ width: '60px', height: '60px', objectFit: 'cover', background: '#f9f9f9' }} />
                          <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '0.9rem', margin: '0 0 0.3rem' }}>{item.title}</h4>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>{item.price} €</span>
                          </div>
                          <Trash2 
                            size={16} color="#ccc" style={{ cursor: 'pointer' }} 
                            onClick={() => removeFromCart(index)} 
                          />
                        </div>
                        
                        {item.canBeDedicated && (
                          <div style={{ background: '#fcfcfc', padding: '1rem', border: '1px dashed #eee' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                              <PenLine size={12} color="var(--primary-color)" />
                              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-color)' }}>DÉDICACE PERSONNALISÉE</span>
                            </div>
                            <textarea 
                              placeholder="À qui dois-je dédicacer ce livre ?"
                              value={item.dedication}
                              onChange={(e) => updateDedication(index, e.target.value)}
                              style={{ 
                                width: '100%', border: 'none', background: 'transparent', 
                                fontSize: '0.8rem', outline: 'none', resize: 'none', fontStyle: 'italic' 
                              }}
                              rows={2}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div style={{ borderTop: '1px solid #eee', paddingTop: '2rem', marginTop: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <span style={{ fontWeight: 800 }}>TOTAL</span>
                    <span style={{ fontWeight: 900, fontSize: '1.4rem' }}>{total} €</span>
                  </div>
                  <button style={{ 
                    width: '100%', background: 'var(--primary-color)', color: 'white', 
                    padding: '1.2rem', border: 'none', fontWeight: 900, letterSpacing: '2px' 
                  }}>
                    PASSER À LA CAISSE
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
