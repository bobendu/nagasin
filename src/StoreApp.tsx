import { useState, useEffect } from 'react'
import { ShoppingCart, X, Trash2, ShoppingBag, PenLine } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

import type { Product } from './data/products'

interface CartItem extends Product {
  dedication?: string;
}

import CustomPrintCard from './components/CustomPrintCard'
import AdminToolbar from './components/admin/AdminToolbar'
import AdminDashboard from './components/admin/AdminDashboard'
import EditableProductCard from './components/admin/EditableProductCard'

export default function StoreApp({ isAdmin }: { isAdmin?: boolean }) {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false)

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

  const addToCart = (item: Product | any) => {
    setCart([...cart, { ...item, dedication: item.dedication || '' }])
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

  const handleUpdateProduct = (id: number, updates: Partial<Product>) => {
    const newProducts = products.map(p => p.id === id ? { ...p, ...updates } : p)
    setProducts(newProducts)
    localStorage.setItem('nagasin_catalog', JSON.stringify(newProducts))
  }

  const handleDeleteProduct = (id: number) => {
    if (confirm("Supprimer cet article ?")) {
      const newProducts = products.filter(p => p.id !== id)
      setProducts(newProducts)
      localStorage.setItem('nagasin_catalog', JSON.stringify(newProducts))
    }
  }

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: Date.now(),
      slug: 'nouveau-produit-' + Date.now(),
      title: 'Nouveau Produit',
      category: 'EDITION',
      price: 0,
      description: 'Description à compléter...',
      details: '',
      image: 'https://via.placeholder.com/400',
      canBeDedicated: true,
      stock: 0,
      weight: 0
    }
    const newProducts = [newProduct, ...products]
    setProducts(newProducts)
    localStorage.setItem('nagasin_catalog', JSON.stringify(newProducts))
  }

  return (
    <div className="app-layout">
      {isAdmin && (
        <AdminToolbar 
          onOpenDashboard={() => setIsAdminDashboardOpen(true)} 
          onAddProduct={handleAddProduct}
        />
      )}

      <AdminDashboard 
        isOpen={isAdminDashboardOpen} 
        onClose={() => setIsAdminDashboardOpen(false)} 
      />

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
            <EditableProductCard 
              key={item.id}
              product={item}
              isAdmin={!!isAdmin}
              onAddToCart={addToCart}
              onUpdate={handleUpdateProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </section>

        {/* PRODUIT INTERACTIF (L'INTELLIGENT) */}
        <div style={{ marginTop: '5rem', marginBottom: '5rem' }}>
          <CustomPrintCard onAddToCart={addToCart} />
        </div>

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
                              placeholder="À qui dois-je dédicacer ce tirage ?"
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

                    {/* FORMULAIRE CLIENT */}
                    <div style={{ marginTop: '1rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '12px' }}>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '1px' }}>INFOS DE LIVRAISON</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input type="text" placeholder="Nom Complet" id="cust-name" style={{ padding: '0.8rem', border: '1px solid #eee', fontSize: '0.85rem' }} />
                        <input type="email" placeholder="Email" id="cust-email" style={{ padding: '0.8rem', border: '1px solid #eee', fontSize: '0.85rem' }} />
                        <textarea placeholder="Adresse de livraison complète" id="cust-addr" style={{ padding: '0.8rem', border: '1px solid #eee', fontSize: '0.85rem', resize: 'none' }} rows={3} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div style={{ borderTop: '1px solid #eee', paddingTop: '2rem', marginTop: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <span style={{ fontWeight: 800 }}>TOTAL</span>
                    <span style={{ fontWeight: 900, fontSize: '1.4rem' }}>{total} €</span>
                  </div>
                  <button 
                    onClick={() => {
                      const name = (document.getElementById('cust-name') as HTMLInputElement)?.value;
                      const email = (document.getElementById('cust-email') as HTMLInputElement)?.value;
                      const addr = (document.getElementById('cust-addr') as HTMLTextAreaElement)?.value;
                      
                      if (!name || !addr) {
                        alert("Merci de remplir vos infos de livraison.");
                        return;
                      }

                      const order = {
                        id: Date.now(),
                        date: new Date().toISOString(),
                        customer: { name, email, addr },
                        items: cart,
                        total,
                        status: 'En attente'
                      };

                      const existingOrders = JSON.parse(localStorage.getItem('nagasin_orders') || '[]');
                      localStorage.setItem('nagasin_orders', JSON.stringify([order, ...existingOrders]));
                      
                      alert("Commande enregistrée ! (Simulation)");
                      setCart([]);
                      setIsCartOpen(false);
                    }}
                    style={{ 
                      width: '100%', background: 'var(--primary-color)', color: 'white', 
                      padding: '1.2rem', border: 'none', fontWeight: 900, letterSpacing: '2px',
                      cursor: 'pointer'
                    }}
                  >
                    CONFIRMER LA COMMANDE
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
