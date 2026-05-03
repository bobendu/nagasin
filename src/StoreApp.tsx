import { useState, useEffect } from 'react'
import { ShoppingCart, X, Trash2, ShoppingBag, PenLine, CreditCard, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import './App.css'

// Initialisation de Stripe (Clé publique factice pour la démo)
const stripePromise = loadStripe('pk_test_placeholder')

import type { Product } from './data/products'

interface CartItem extends Product {
  dedication?: string;
}

import CustomPrintCard from './components/CustomPrintCard'
import AdminToolbar from './components/admin/AdminToolbar'
import AdminDashboard from './components/admin/AdminDashboard'
import EditableProductCard from './components/admin/EditableProductCard'
import PaymentForm from './components/PaymentForm'

export default function StoreApp({ isAdmin, adminToken, onLogout, onGoToLogin }: { isAdmin?: boolean, adminToken?: string, onLogout?: () => void, onGoToLogin?: () => void }) {
  const [products, setProducts] = useState<Product[]>([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartStep, setCartStep] = useState<'cart' | 'checkout' | 'payment' | 'success'>('cart')
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false)
  const [shippingCost, setShippingCost] = useState(5.00)
  const [justAdded, setJustAdded] = useState<number | null>(null)
  const [customerInfo, setCustomerInfo] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    emailConfirm: '',
    address: '', 
    zipCode: '', 
    city: '' 
  })

  useEffect(() => {
    // Si Admin, on charge le brouillon local s'il existe
    // Sinon, on charge le catalogue public depuis le SERVEUR
    const draftCatalog = localStorage.getItem('nagasin_catalog_draft')

    const loadCatalog = async () => {
      if (isAdmin && draftCatalog) {
        setProducts(JSON.parse(draftCatalog))
        setHasUnsavedChanges(true)
      } else {
        try {
          const response = await fetch('/api/catalog.php');
          if (response.ok) {
            const data = await response.json();
            setProducts(data);
          } else {
            throw new Error('Fallback products.json');
          }
        } catch (err) {
          // Fallback ultime sur le fichier statique
          fetch('/api/products.json')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(e => console.error("Erreur chargement catalogue:", e))
        }
      }
    };

    loadCatalog();
  }, [isAdmin])

  const subtotal = cart.reduce((sum: number, item: CartItem) => sum + item.price, 0)
  const total = subtotal + (cart.length > 0 ? shippingCost : 0)

  const addToCart = (item: Product | any) => {
    setCart([...cart, { ...item, dedication: item.dedication || '' }])
    setJustAdded(item.id)
    setCartStep('cart') // Reset to cart step when adding something
    setTimeout(() => setJustAdded(null), 2000)
    // On ne force plus l'ouverture du panier pour laisser le client continuer
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
    const newProducts = products.map((p: Product) => p.id === id ? { ...p, ...updates } : p)
    setProducts(newProducts)
    localStorage.setItem('nagasin_catalog_draft', JSON.stringify(newProducts))
    setHasUnsavedChanges(true)
  }

  const handleDeleteProduct = (id: number) => {
    if (confirm("Supprimer ce produit ?")) {
      const newProducts = products.filter((p: Product) => p.id !== id)
      setProducts(newProducts)
      localStorage.setItem('nagasin_catalog_draft', JSON.stringify(newProducts))
      setHasUnsavedChanges(true)
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
    localStorage.setItem('nagasin_catalog_draft', JSON.stringify(newProducts))
    setHasUnsavedChanges(true)
  }

  const handlePublish = async () => {
    try {
      const response = await fetch('/api/catalog.php', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Password': adminToken || ''
        },
        body: JSON.stringify(products)
      });

      if (!response.ok) throw new Error('Erreur publication');

      localStorage.removeItem('nagasin_catalog_draft')
      setHasUnsavedChanges(false)
      alert("Changements publiés avec succès ! Ils sont maintenant synchronisés sur tous les appareils.")
    } catch (err) {
      alert("Erreur lors de la publication sur le serveur.");
      console.error(err);
    }
  }

  const sanitizeString = (str: string) => {
    return str.replace(/[<>]/g, '').trim();
  }

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const handleOrderSuccess = async (paymentId: string) => {
    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      customer: {
        name: `${customerInfo.firstName} ${customerInfo.lastName}`,
        email: customerInfo.email,
        addr: `${customerInfo.address}, ${customerInfo.zipCode} ${customerInfo.city}`
      },
      items: cart,
      total,
      status: 'Payée',
      paymentId
    };

    // Dispatch vers le Serveur (PHP API)
    try {
      const response = await fetch('/api/save_order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      
      if (!response.ok) throw new Error('Erreur serveur');
      
      console.log("Commande sauvegardée sur le serveur.");
    } catch (err) {
      console.warn("API indisponible, sauvegarde en LocalStorage (Fallback dev).", err);
      const existingOrders = JSON.parse(localStorage.getItem('nagasin_orders') || '[]');
      localStorage.setItem('nagasin_orders', JSON.stringify([order, ...existingOrders]));
    }
    
    setCartStep('success');
    setCart([]);
  }

  return (
    <div className="app-layout">
      {isAdmin && (
        <AdminToolbar 
          onOpenDashboard={() => setIsAdminDashboardOpen(true)} 
          onAddProduct={handleAddProduct}
          onPublish={handlePublish}
          hasChanges={hasUnsavedChanges}
          onLogout={onLogout}
        />
      )}

      <AdminDashboard 
        isOpen={isAdminDashboardOpen} 
        adminToken={adminToken}
        shippingCost={shippingCost}
        onUpdateShipping={(val) => setShippingCost(val)}
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
          {/* L'accès au panier a été déplacé dans le bandeau du bas */}
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
          {products.map((item: Product) => (
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
          <CustomPrintCard onAddToCart={addToCart} isAdmin={!!isAdmin} />
        </div>

        {/* SECTION CONTACT / INFOS (FIN DE PAGE) */}
        <section style={{ borderTop: '1px solid #eee', marginTop: '6rem', padding: '4rem 0 10rem 0', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Contact & Projets</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
            Pour toute question sur votre commande ou un projet spécifique, n'hésitez pas à me contacter.
          </p>
          <a href="mailto:na@dessinateur.net" className="btn-cta" style={{ border: '1px solid #000', padding: '1rem 2.5rem' }}>
            Me contacter
          </a>
          <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '4rem' }}>
            © {new Date().getFullYear()} Nagasin - Art Prints by na! 
            <span 
              onClick={onGoToLogin}
              style={{ cursor: 'default', opacity: 0.5, marginLeft: '5px' }}
              title="Accès réservé"
            >.</span>
          </div>
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

              <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
                {cart.length === 0 && cartStep !== 'success' ? (
                  <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <ShoppingBag size={40} color="#eee" style={{ marginBottom: '1rem' }} />
                    <p style={{ color: '#999', fontSize: '0.9rem' }}>Votre panier est vide.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    {cartStep === 'cart' && (
                      /* ÉTAPE 1 : LISTE DES ARTICLES */
                      <>
                        {cart.map((item: CartItem, index: number) => (
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
                      </>
                    )}

                    {cartStep === 'checkout' && (
                      /* ÉTAPE 2 : FORMULAIRE CLIENT DÉTAILLÉ */
                      <div style={{ marginTop: '1rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '12px' }}>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '1px' }}>INFOS DE LIVRAISON</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <input 
                              type="text" placeholder="Prénom" 
                              value={customerInfo.firstName}
                              onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                              style={{ flex: 1, padding: '0.8rem', border: '1px solid #eee', fontSize: '0.85rem' }} 
                            />
                            <input 
                              type="text" placeholder="Nom" 
                              value={customerInfo.lastName}
                              onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                              style={{ flex: 1, padding: '0.8rem', border: '1px solid #eee', fontSize: '0.85rem' }} 
                            />
                          </div>

                          <input 
                            type="email" placeholder="Email" 
                            value={customerInfo.email}
                            onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                            style={{ padding: '0.8rem', border: '1px solid #eee', fontSize: '0.85rem' }} 
                          />
                          <input 
                            type="email" placeholder="Confirmez votre Email" 
                            value={customerInfo.emailConfirm}
                            onChange={(e) => setCustomerInfo({...customerInfo, emailConfirm: e.target.value})}
                            style={{ padding: '0.8rem', border: '1px solid #eee', fontSize: '0.85rem' }} 
                          />

                          <input 
                            type="text" placeholder="N° et Nom de rue" 
                            value={customerInfo.address}
                            onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                            style={{ padding: '0.8rem', border: '1px solid #eee', fontSize: '0.85rem' }} 
                          />

                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <input 
                              type="text" placeholder="Code Postal" 
                              value={customerInfo.zipCode}
                              onChange={(e) => setCustomerInfo({...customerInfo, zipCode: e.target.value})}
                              style={{ width: '120px', padding: '0.8rem', border: '1px solid #eee', fontSize: '0.85rem' }} 
                            />
                            <input 
                              type="text" placeholder="Ville" 
                              value={customerInfo.city}
                              onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                              style={{ flex: 1, padding: '0.8rem', border: '1px solid #eee', fontSize: '0.85rem' }} 
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {cartStep === 'payment' && (
                      /* ÉTAPE 3 : PAIEMENT STRIPE */
                      <Elements stripe={stripePromise}>
                        <PaymentForm 
                          total={total} 
                          onSuccess={handleOrderSuccess} 
                          onBack={() => setCartStep('checkout')} 
                        />
                      </Elements>
                    )}

                    {cartStep === 'success' && (
                      /* ÉTAPE 4 : SUCCÈS */
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        style={{ textAlign: 'center', padding: '3rem 0' }}
                      >
                        <CheckCircle size={60} color="#22c55e" style={{ marginBottom: '1.5rem' }} />
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem' }}>COMMANDE RÉUSSIE !</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                          Merci pour votre achat. Un email de confirmation a été envoyé à <strong>{customerInfo.email}</strong>.
                        </p>
                        <button 
                          onClick={() => { setIsCartOpen(false); setCartStep('cart'); }}
                          style={{ 
                            background: '#000', color: '#fff', border: 'none', padding: '1rem 2rem', 
                            fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto' 
                          }}
                        >
                          RETOURNER À LA BOUTIQUE
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {cart.length > 0 && cartStep !== 'success' && (
                <div style={{ borderTop: '1px solid #eee', paddingTop: '2rem', marginTop: '2rem' }}>
                  <div style={{ padding: '1.5rem', borderTop: '1px solid #eee', background: '#fafafa', borderRadius: '12px', marginTop: '2rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#666' }}>Sous-total</span>
                      <span style={{ fontWeight: 600 }}>{subtotal.toFixed(2)} €</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '1rem' }}>
                      <span style={{ color: '#666' }}>Frais d'envoi</span>
                      <span style={{ fontWeight: 600 }}>{shippingCost.toFixed(2)} €</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 900 }}>
                      <span>TOTAL</span>
                      <span>{total.toFixed(2)} €</span>
                    </div>
                  </div>

                  {cartStep === 'cart' ? (
                    <>
                      <button 
                        onClick={() => setCartStep('checkout')}
                        style={{ 
                          width: '100%', background: 'var(--primary-color)', color: 'white', 
                          padding: '1.2rem', border: 'none', fontWeight: 900, letterSpacing: '2px',
                          cursor: 'pointer', marginBottom: '1rem'
                        }}
                      >
                        PASSER À LA LIVRAISON
                      </button>
                      <button 
                        onClick={() => setIsCartOpen(false)}
                        style={{ 
                          width: '100%', background: 'transparent', color: '#000', 
                          padding: '1rem', border: '1px solid #000', fontWeight: 800, fontSize: '0.7rem',
                          letterSpacing: '1px', cursor: 'pointer'
                        }}
                      >
                        CONTINUER MES ACHATS
                      </button>
                    </>
                  ) : cartStep === 'checkout' ? (
                    <>
                      <button 
                        onClick={() => {
                          const sanitizedFirstName = sanitizeString(customerInfo.firstName);
                          const sanitizedLastName = sanitizeString(customerInfo.lastName);
                          const sanitizedEmail = customerInfo.email.trim();
                          const sanitizedEmailConfirm = customerInfo.emailConfirm.trim();
                          const sanitizedAddress = sanitizeString(customerInfo.address);
                          const sanitizedZipCode = sanitizeString(customerInfo.zipCode);
                          const sanitizedCity = sanitizeString(customerInfo.city);

                          if (!sanitizedFirstName || !sanitizedLastName || !sanitizedEmail || !sanitizedAddress || !sanitizedZipCode || !sanitizedCity) {
                            alert("Merci de remplir toutes les informations de livraison.");
                            return;
                          }

                          if (!validateEmail(sanitizedEmail)) {
                            alert("Format d'email invalide.");
                            return;
                          }

                          if (sanitizedEmail !== sanitizedEmailConfirm) {
                            alert("Les adresses email ne correspondent pas.");
                            return;
                          }

                          setCustomerInfo({
                            firstName: sanitizedFirstName,
                            lastName: sanitizedLastName,
                            email: sanitizedEmail,
                            emailConfirm: sanitizedEmailConfirm,
                            address: sanitizedAddress,
                            zipCode: sanitizedZipCode,
                            city: sanitizedCity
                          });
                          setCartStep('payment');
                        }}
                        style={{ 
                          width: '100%', background: '#000', color: 'white', 
                          padding: '1.2rem', border: 'none', fontWeight: 900, letterSpacing: '2px',
                          cursor: 'pointer', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                        }}
                      >
                        <CreditCard size={18} /> PASSER AU PAIEMENT
                      </button>
                      <button 
                        onClick={() => setCartStep('cart')}
                        style={{ 
                          width: '100%', background: 'transparent', color: '#666', 
                          padding: '0.5rem', border: 'none', fontWeight: 800, fontSize: '0.7rem',
                          letterSpacing: '1px', cursor: 'pointer'
                        }}
                      >
                        RETOUR AU PANIER
                      </button>
                    </>
                  ) : null}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* BANDEAU PANIER FIXE EN BAS */}
      <motion.div 
        onClick={() => setIsCartOpen(true)}
        animate={{ 
          scale: justAdded ? [1, 1.05, 1] : 1,
          backgroundColor: justAdded ? '#00c853' : '#004169'
        }}
        style={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          background: '#004169', 
          color: 'white', 
          padding: '1rem 2rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '15px', 
          cursor: 'pointer', 
          zIndex: 150,
          boxShadow: '0 -5px 20px rgba(0,0,0,0.1)',
          fontWeight: 900,
          letterSpacing: '2px',
          fontSize: '0.9rem',
          textTransform: 'uppercase'
        }}
      >
        <ShoppingCart size={20} strokeWidth={3} />
        {justAdded ? 'ARTICLE AJOUTÉ !' : `VOIR MON PANIER (${cart.length})`}
      </motion.div>
    </div>
  )
}
