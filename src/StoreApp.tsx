import { useState, useEffect } from 'react'
import { ShoppingCart, X, Trash2, PenLine, CreditCard, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import PaymentForm from './components/PaymentForm'
import AdminDashboard from './components/admin/AdminDashboard'
import CartSummary from './components/cart/CartSummary'
import CheckoutForm from './components/cart/CheckoutForm'
import type { Product, CartItem, CustomerInfo } from './types'

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx')

export default function StoreApp({ isAdmin, adminToken, onLogout, onGoToLogin }: { 
  isAdmin: boolean, 
  adminToken?: string,
  onLogout?: () => void,
  onGoToLogin?: () => void
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartStep, setCartStep] = useState<'cart' | 'checkout' | 'payment' | 'success'>('cart')
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false)
  const [shippingCost, setShippingCost] = useState(5.00)
  const [justAdded, setJustAdded] = useState<number | null>(null)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({ 
    firstName: '', lastName: '', email: '', emailConfirm: '', address: '', zipCode: '', city: '' 
  })

  useEffect(() => {
    const draftCatalog = localStorage.getItem('nagasin_catalog_draft')
    const loadCatalog = async () => {
      if (isAdmin && draftCatalog) {
        setProducts(JSON.parse(draftCatalog))
      } else {
        try {
          const response = await fetch('/api/catalog.php');
          if (response.ok) {
            const data = await response.json();
            setProducts(data);
          } else {
            throw new Error('Fallback');
          }
        } catch (err) {
          fetch('/api/products.json').then(res => res.json()).then(setProducts)
        }
      }
    };
    loadCatalog();
  }, [isAdmin])

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0)
  const total = subtotal + (cart.length > 0 ? shippingCost : 0)

  const addToCart = (item: Product) => {
    setCart([...cart, { ...item, dedication: '' }])
    setJustAdded(item.id)
    setCartStep('cart')
    setTimeout(() => setJustAdded(null), 2000)
  }

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  }

  const handleOrderSuccess = async () => {
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
      status: 'Payée'
    };

    try {
      await fetch('/api/save_order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      setCart([])
      setCartStep('success')
    } catch (err) {
      console.error(err)
      alert("Erreur réseau, commande non enregistrée.")
    }
  }

  const sanitize = (str: string) => str.replace(/<[^>]*>?/gm, '').trim();
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: '#000', fontFamily: 'Outfit, sans-serif' }}>
      
      {/* HEADER */}
      <header style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '4px' }}>NAGASIN.</div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {isAdmin && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setIsAdminDashboardOpen(true)} style={{ background: '#000', color: '#fff', border: 'none', padding: '10px 20px', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '1px', cursor: 'pointer' }}>CONSOLE ADMIN</button>
              <button onClick={onLogout} style={{ background: '#f5f5f5', color: '#000', border: 'none', padding: '10px 20px', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '1px', cursor: 'pointer' }}>DÉCONNEXION</button>
            </div>
          )}
          {!isAdmin && onGoToLogin && (
             <button onClick={onGoToLogin} style={{ background: 'transparent', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '0.7rem' }}>Admin</button>
          )}
          <div onClick={() => setIsCartOpen(true)} style={{ position: 'relative', cursor: 'pointer' }}>
            <ShoppingCart size={24} />
            {cart.length > 0 && <span style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--primary-color)', color: 'white', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '50%', fontWeight: 900 }}>{cart.length}</span>}
          </div>
        </div>
      </header>

      {/* CATALOGUE */}
      <main style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '3rem' }}>
          {products.map(product => (
            <motion.div key={product.id} whileHover={{ y: -10 }} style={{ border: '1px solid #f0f0f0', padding: '1rem' }}>
              <div style={{ height: '400px', background: '#f9f9f9', overflow: 'hidden', marginBottom: '1.5rem', position: 'relative' }}>
                <img src={product.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={product.title} />
              </div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 900, margin: '0 0 0.5rem', letterSpacing: '1px' }}>{product.title.toUpperCase()}</h3>
              <p style={{ fontSize: '1.1rem', fontWeight: 400, margin: '0 0 1.5rem' }}>{product.price.toFixed(2)} €</p>
              <button 
                onClick={() => addToCart(product)}
                style={{ width: '100%', padding: '1rem', background: '#000', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer', fontSize: '0.7rem', letterSpacing: '2px' }}
              >
                AJOUTER AU PANIER
              </button>
            </motion.div>
          ))}
        </div>
      </main>

      <AdminDashboard 
        isOpen={isAdminDashboardOpen} 
        adminToken={adminToken}
        shippingCost={shippingCost}
        onUpdateShipping={setShippingCost}
        onClose={() => setIsAdminDashboardOpen(false)} 
      />

      {/* SIDEBAR PANIER */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '500px', background: '#fff', zIndex: 101, display: 'flex', flexDirection: 'column', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '2px' }}>MON PANIER</h2>
                <X size={24} onClick={() => setIsCartOpen(false)} style={{ cursor: 'pointer' }} />
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {cart.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem 0', color: '#999' }}>Votre panier est vide.</div>
                ) : (
                  <div>
                    {cartStep === 'cart' && cart.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '1rem', padding: '1.5rem 0', borderBottom: '1px solid #eee' }}>
                        <img src={item.image} style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>{item.title}</span>
                            <Trash2 size={16} onClick={() => removeFromCart(idx)} style={{ cursor: 'pointer', color: '#ccc' }} />
                          </div>
                          <div style={{ fontWeight: 600, marginTop: '5px' }}>{item.price.toFixed(2)} €</div>
                          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)' }}>
                            <PenLine size={12} />
                            <input 
                              type="text" placeholder="Dédicace..." 
                              value={item.dedication}
                              onChange={(e) => {
                                const newCart = [...cart];
                                newCart[idx].dedication = e.target.value;
                                setCart(newCart);
                              }}
                              style={{ border: 'none', borderBottom: '1px solid #eee', fontSize: '0.75rem', outline: 'none', width: '100%' }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {cartStep === 'checkout' && <CheckoutForm customerInfo={customerInfo} setCustomerInfo={setCustomerInfo} />}

                    {cartStep === 'payment' && (
                      <Elements stripe={stripePromise}>
                        <PaymentForm total={total} onSuccess={handleOrderSuccess} onBack={() => setCartStep('checkout')} />
                      </Elements>
                    )}

                    {cartStep === 'success' && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '3rem 0' }}>
                        <CheckCircle size={60} color="#22c55e" style={{ marginBottom: '1.5rem' }} />
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem' }}>COMMANDE RÉUSSIE !</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>Merci pour votre achat. Confirmation envoyée à <strong>{customerInfo.email}</strong>.</p>
                        <button onClick={() => { setIsCartOpen(false); setCartStep('cart'); }} style={{ background: '#000', color: '#fff', border: 'none', padding: '1rem 2rem', fontWeight: 800, cursor: 'pointer' }}>RETOURNER À LA BOUTIQUE</button>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {cart.length > 0 && cartStep !== 'success' && (
                <div style={{ borderTop: '1px solid #eee', paddingTop: '2rem', marginTop: '2rem' }}>
                  <CartSummary subtotal={subtotal} shippingCost={shippingCost} total={total} />

                  {cartStep === 'cart' ? (
                    <>
                      <button onClick={() => setCartStep('checkout')} style={{ width: '100%', background: 'var(--primary-color)', color: 'white', padding: '1.2rem', border: 'none', fontWeight: 900, letterSpacing: '2px', cursor: 'pointer', marginBottom: '1rem' }}>PASSER À LA LIVRAISON</button>
                      <button onClick={() => setIsCartOpen(false)} style={{ width: '100%', background: 'transparent', color: '#000', padding: '1rem', border: '1px solid #000', fontWeight: 800, fontSize: '0.7rem', cursor: 'pointer' }}>CONTINUER MES ACHATS</button>
                    </>
                  ) : cartStep === 'checkout' ? (
                    <>
                      <button 
                        onClick={() => {
                          const s = customerInfo;
                          if (!sanitize(s.firstName) || !sanitize(s.lastName) || !sanitize(s.email) || !sanitize(s.address) || !sanitize(s.zipCode) || !sanitize(s.city)) return alert("Merci de tout remplir.");
                          if (!validateEmail(s.email)) return alert("Email invalide.");
                          if (s.email !== s.emailConfirm) return alert("Emails différents.");
                          setCartStep('payment');
                        }}
                        style={{ width: '100%', background: '#000', color: 'white', padding: '1.2rem', border: 'none', fontWeight: 900, letterSpacing: '2px', cursor: 'pointer', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                      >
                        <CreditCard size={18} /> PASSER AU PAIEMENT
                      </button>
                      <button onClick={() => setCartStep('cart')} style={{ width: '100%', background: 'transparent', color: '#666', padding: '0.5rem', border: 'none', fontWeight: 800, fontSize: '0.7rem', cursor: 'pointer' }}>RETOUR AU PANIER</button>
                    </>
                  ) : null}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* BANDEAU FIXE */}
      <motion.div 
        onClick={() => setIsCartOpen(true)}
        animate={{ scale: justAdded ? [1, 1.05, 1] : 1, backgroundColor: justAdded ? '#00c853' : '#004169' }}
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#004169', color: 'white', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', cursor: 'pointer', zIndex: 150 }}
      >
        <ShoppingCart size={20} />
        <span style={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: '1px' }}>VOIR MON PANIER ({cart.length}) — {total.toFixed(2)} €</span>
      </motion.div>
    </div>
  )
}
