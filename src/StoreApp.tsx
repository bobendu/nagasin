import { useState, useEffect } from 'react'
import { ShoppingCart, X, Trash2, PenLine, CreditCard, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import PaymentForm from './components/PaymentForm'
import AdminDashboard from './components/admin/AdminDashboard'
import CartSummary from './components/cart/CartSummary'
import CheckoutForm from './components/cart/CheckoutForm'
import CustomPrintCard from './components/CustomPrintCard'
import AdminToolbar from './components/admin/AdminToolbar'
import EditableProductCard from './components/admin/EditableProductCard'
import LegalModals from './components/LegalModals'
import type { Product, CartItem, CustomerInfo } from './types'
import './App.css'

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx')

export default function StoreApp({ isAdmin, adminToken, onLogout, onGoToLogin }: { 
  isAdmin: boolean, 
  adminToken?: string,
  onLogout?: () => void,
  onGoToLogin?: () => void
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartStep, setCartStep] = useState<'cart' | 'checkout' | 'payment' | 'success'>('cart')
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false)
  const [shippingCost, setShippingCost] = useState(5.00)
  const [justAdded, setJustAdded] = useState<number | null>(null)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({ 
    firstName: '', lastName: '', email: '', emailConfirm: '', address: '', zipCode: '', city: '' 
  })
  const [activeLegalDoc, setActiveLegalDoc] = useState<'mentions' | 'cgv' | 'privacy' | null>(null)
  const [cgvAccepted, setCgvAccepted] = useState(false)
  const [customPrintSettings, setCustomPrintSettings] = useState({
    title: 'Tirage sous cadre',
    price: 45,
    description: "Choisissez votre illustration préférée sur le blog (scrollez et cliquez) ou par mot clé ; je vous l'imprime, vous la mets sous cadre et je vous l'expédie."
  })
  const [invoiceSettings, setInvoiceSettings] = useState({
    sellerName: "Benoît Baudu (na!)",
    sellerDetails: "Artiste-Auteur / NA! Studio",
    sellerEmail: "contact@nagasin.fr",
    sellerWebsite: "www.nagasin.fr",
    legalNotice: "TVA non applicable - article 293 B du CGI",
    footerText: "Facture acquittée. Mode de règlement : Carte Bancaire via Stripe.\nNagasin Studio par na! - Tous droits réservés."
  })

  useEffect(() => {
    const draftCatalog = localStorage.getItem('nagasin_catalog_draft')
    const loadCatalog = async () => {
      if (isAdmin && draftCatalog) {
        const draft = JSON.parse(draftCatalog)
        setProducts(draft.products || draft)
        if (draft.customPrintSettings) setCustomPrintSettings(draft.customPrintSettings)
        if (draft.shippingCost !== undefined) setShippingCost(draft.shippingCost)
        if (draft.invoiceSettings) setInvoiceSettings(draft.invoiceSettings)
        setHasUnsavedChanges(true)
      } else {
        try {
          const response = await fetch('/api/catalog.php');
          if (response.ok) {
            const data = await response.json();
            if (data.products) {
              setProducts(data.products);
              if (data.customPrintSettings) setCustomPrintSettings(data.customPrintSettings);
              if (data.shippingCost !== undefined) setShippingCost(data.shippingCost);
              if (data.invoiceSettings) setInvoiceSettings(data.invoiceSettings);
            } else {
              setProducts(data);
            }
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
    setCart([...cart, { ...item, dedication: (item as any).dedication || '' }])
    setJustAdded(item.id)
    setCartStep('cart')
    setTimeout(() => setJustAdded(null), 2000)
  }

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
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

    try {
      await fetch('/api/save_order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
    } catch (err) {
      console.warn("API indisponible, sauvegarde en LocalStorage.", err);
      const existingOrders = JSON.parse(localStorage.getItem('nagasin_orders') || '[]');
      localStorage.setItem('nagasin_orders', JSON.stringify([order, ...existingOrders]));
    }
    
    setCart([])
    setCartStep('success')
    setCgvAccepted(false)
  }

  const handleUpdateProduct = (id: number, updates: Partial<Product>) => {
    const newProducts = products.map((p) => p.id === id ? { ...p, ...updates } : p)
    setProducts(newProducts)
    saveDraft(newProducts, customPrintSettings, shippingCost)
    setHasUnsavedChanges(true)
  }

  const saveDraft = (p: Product[], s: any, sc: number, inv: any = invoiceSettings) => {
    localStorage.setItem('nagasin_catalog_draft', JSON.stringify({ 
      products: p, 
      customPrintSettings: s,
      shippingCost: sc,
      invoiceSettings: inv
    }))
  }

  const handleUpdateInvoiceSettings = (settings: any) => {
    setInvoiceSettings(settings)
    saveDraft(products, customPrintSettings, shippingCost, settings)
    setHasUnsavedChanges(true)
  }

  const handleUpdateCustomPrint = (settings: any) => {
    setCustomPrintSettings(settings)
    saveDraft(products, settings, shippingCost)
    setHasUnsavedChanges(true)
  }

  const handleUpdateShipping = (val: number) => {
    setShippingCost(val)
    saveDraft(products, customPrintSettings, val)
    setHasUnsavedChanges(true)
  }

  const handleDeleteProduct = (id: number) => {
    if (confirm("Supprimer ce produit ?")) {
      const newProducts = products.filter((p) => p.id !== id)
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
        body: JSON.stringify({ products, customPrintSettings, shippingCost, invoiceSettings })
      });
      if (!response.ok) throw new Error('Erreur publication');
      localStorage.removeItem('nagasin_catalog_draft')
      setHasUnsavedChanges(false)
      alert("Changements publiés avec succès !")
    } catch (err) {
      alert("Erreur lors de la publication.");
      console.error(err);
    }
  }

  const handleResetDraft = () => {
    if (confirm("Supprimer tous les changements non publiés ?")) {
      localStorage.removeItem('nagasin_catalog_draft')
      window.location.reload()
    }
  }

  const sanitize = (str: string) => str.replace(/<[^>]*>?/gm, '').trim();
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="app-layout">
      {isAdmin && (
        <AdminToolbar 
          onOpenDashboard={() => setIsAdminDashboardOpen(true)} 
          onAddProduct={handleAddProduct}
          onPublish={handlePublish}
          onResetDraft={handleResetDraft}
          hasChanges={hasUnsavedChanges}
          onLogout={onLogout}
        />
      )}

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img 
            src="https://www.dessinateur.net/wp-content/uploads/2024/06/logoNadessinateur.jpg" 
            alt="na!" 
          />
        </div>
        <nav className="sidebar-nav" style={{ padding: '2rem 1.5rem' }}>
          {isAdmin && (
            <button 
              onClick={handlePublish}
              disabled={!hasUnsavedChanges}
              style={{ 
                background: hasUnsavedChanges ? 'var(--primary-color)' : '#eee', 
                color: hasUnsavedChanges ? 'white' : '#999', 
                border: 'none', 
                padding: '12px', 
                fontSize: '0.7rem', 
                fontWeight: 900, 
                cursor: hasUnsavedChanges ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%'
              }}
            >
              <CheckCircle size={14} /> PUBLIER
            </button>
          )}
        </nav>
        <div style={{ marginTop: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.55rem', color: '#999', fontWeight: 700 }}>
            <span onClick={() => setActiveLegalDoc('mentions')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Mentions Légales</span>
            <span onClick={() => setActiveLegalDoc('cgv')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>CGV</span>
            <span onClick={() => setActiveLegalDoc('privacy')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Confidentialité</span>
          </div>
          <div style={{ fontSize: '0.6rem', color: '#ccc', fontWeight: 700 }}>
            © 2026 NA! STUDIO
          </div>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
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
        <div className="product-grid">
          {products.map(product => (
            <EditableProductCard 
              key={product.id}
              product={product}
              isAdmin={!!isAdmin}
              onAddToCart={addToCart}
              onUpdate={handleUpdateProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>

        {/* PRODUIT INTERACTIF */}
        <div style={{ marginTop: '5rem', marginBottom: '5rem' }}>
          <CustomPrintCard 
            onAddToCart={addToCart} 
            isAdmin={!!isAdmin} 
            settings={customPrintSettings}
            onUpdateSettings={handleUpdateCustomPrint}
          />
        </div>

        {/* SECTION CONTACT */}
        <section style={{ borderTop: '1px solid #eee', marginTop: '6rem', padding: '4rem 0 10rem 0', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Contact & Projets</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
            Pour toute question sur votre commande ou un projet spécifique, n'hésitez pas à me contacter.
          </p>
          <a href="mailto:na@dessinateur.net" className="btn-cta" style={{ border: '1px solid #000', padding: '1rem 2.5rem' }}>
            Me contacter
          </a>
          <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '4rem', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <span onClick={() => setActiveLegalDoc('mentions')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Mentions Légales</span>
              <span onClick={() => setActiveLegalDoc('cgv')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>CGV</span>
              <span onClick={() => setActiveLegalDoc('privacy')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Confidentialité</span>
            </div>
            <div>
              © {new Date().getFullYear()} Nagasin - Art Prints by na! 
              {!isAdmin && onGoToLogin && (
                <span 
                  onClick={onGoToLogin}
                  style={{ cursor: 'default', opacity: 0.5, marginLeft: '5px' }}
                >.</span>
              )}
            </div>
          </div>
        </section>
      </main>

      <AdminDashboard 
        isOpen={isAdminDashboardOpen} 
        adminToken={adminToken}
        shippingCost={shippingCost}
        onUpdateShipping={handleUpdateShipping}
        invoiceSettings={invoiceSettings}
        onUpdateInvoiceSettings={handleUpdateInvoiceSettings}
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

                    {cartStep === 'checkout' && (
                      <CheckoutForm 
                        customerInfo={customerInfo} 
                        setCustomerInfo={setCustomerInfo} 
                        cgvAccepted={cgvAccepted}
                        setCgvAccepted={setCgvAccepted}
                        onOpenLegal={setActiveLegalDoc}
                      />
                    )}

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
                          if (!cgvAccepted) return alert("Veuillez accepter les Conditions Générales de Vente (CGV) et la Politique de Confidentialité pour continuer.");
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

      {!isCartOpen && (
        <motion.div 
          onClick={() => setIsCartOpen(true)}
          animate={{ 
            scale: justAdded ? [1, 1.05, 1] : 1,
            backgroundColor: justAdded ? '#00c853' : '#004169'
          }}
          className="sticky-cart-bar"
          style={{ 
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
          {justAdded ? 'ARTICLE AJOUTÉ !' : `VOIR MON PANIER (${cart.length}) — ${total.toFixed(2)} €`}
        </motion.div>
      )}

      <LegalModals activeDoc={activeLegalDoc} onClose={() => setActiveLegalDoc(null)} />
    </div>
  )
}
