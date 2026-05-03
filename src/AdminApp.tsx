import { useState, useEffect } from 'react'
import { Save, ArrowLeft, Camera, Loader, ShoppingBag, Printer, User, Mail, MapPin, Package, Calendar, ExternalLink } from 'lucide-react'

interface Product {
  id: number;
  slug: string;
  title: string;
  category: string;
  price: number;
  description: string;
  image: string;
  canBeDedicated: boolean;
  stock: number;
}

interface Order {
  id: number;
  date: string;
  customer: { name: string, email: string, addr: string };
  items: any[];
  total: number;
  status: string;
}

export default function AdminApp({ onBack }: { onBack: () => void }) {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingId, setUploadingId] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders'>('catalog')

  useEffect(() => {
    // Charger le catalogue
    const savedCatalog = localStorage.getItem('nagasin_catalog')
    if (savedCatalog) setProducts(JSON.parse(savedCatalog))
    else {
      fetch('/api/products.json').then(res => res.json()).then(data => setProducts(data)).catch(() => {})
    }

    // Charger les commandes
    const savedOrders = localStorage.getItem('nagasin_orders')
    if (savedOrders) setOrders(JSON.parse(savedOrders))

    setLoading(false)
  }, [])

  const updateProduct = (id: number, field: keyof Product, value: any) => {
    const newProducts = products.map(p => p.id === id ? { ...p, [field]: value } : p)
    setProducts(newProducts)
    localStorage.setItem('nagasin_catalog', JSON.stringify(newProducts))
  }

  const handleUpload = async (id: number, file: File) => {
    setUploadingId(id)
    const reader = new FileReader()
    reader.onloadend = () => {
      updateProduct(id, 'image', reader.result as string)
      setUploadingId(null)
    }
    reader.readAsDataURL(file)
  }

  const saveAll = () => {
    setSaving(true)
    localStorage.setItem('nagasin_catalog', JSON.stringify(products))
    setTimeout(() => {
      setSaving(false)
      alert("Catalogue enregistré localement.")
    }, 500)
  }

  const printImage = (url: string) => {
    const win = window.open('', '_blank')
    if (win) {
      win.document.write(`
        <html>
          <body style="margin:0; display:flex; align-items:center; justify-content:center; height:100vh; background:#000;">
            <img src="${url}" style="max-width:100%; max-height:100%; object-fit:contain;" />
            <script>window.onload = () => window.print();</script>
          </body>
        </html>
      `)
      win.document.close()
    }
  }

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Chargement...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: 'Inter, sans-serif' }}>
      
      {/* SIDEBAR ADMIN */}
      <aside style={{ width: '260px', height: '100vh', position: 'fixed', left: 0, top: 0, background: '#1a1a1a', color: 'white', padding: '2rem', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <img src="https://www.dessinateur.net/wp-content/uploads/2024/06/logoNadessinateur.jpg" style={{ width: '60px', borderRadius: '50%', marginBottom: '1rem', border: '2px solid #333' }} />
          <h2 style={{ fontSize: '0.9rem', fontWeight: 900, letterSpacing: '2px' }}>NAGADMIN V1</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <button 
            onClick={() => setActiveTab('catalog')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px',
              background: activeTab === 'catalog' ? '#333' : 'transparent', border: 'none', color: 'white',
              cursor: 'pointer', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem'
            }}
          >
            <Package size={18} /> CATALOGUE
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px',
              background: activeTab === 'orders' ? '#333' : 'transparent', border: 'none', color: 'white',
              cursor: 'pointer', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem'
            }}
          >
            <ShoppingBag size={18} /> COMMANDES ({orders.length})
          </button>
        </nav>

        <button onClick={onBack} style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '10px', color: '#666', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800 }}>
          <ArrowLeft size={16} /> SORTIR DU BACKOFFICE
        </button>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main style={{ marginLeft: '260px', padding: '3rem' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>{activeTab === 'catalog' ? 'Gestion du Catalogue' : 'Suivi des Commandes'}</h1>
          {activeTab === 'catalog' && (
            <button onClick={saveAll} style={{ background: '#000', color: '#fff', padding: '0.8rem 2rem', border: 'none', fontWeight: 800, cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {saving ? <Loader className="animate-spin" size={18} /> : <Save size={18} />} SAUVEGARDER
            </button>
          )}
        </header>

        {/* VUE CATALOGUE */}
        {activeTab === 'catalog' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {products.map((p) => (
              <div key={p.id} style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 15px rgba(0,0,0,0.03)', display: 'grid', gridTemplateColumns: '120px 1fr 200px', gap: '2rem', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '100px', height: '100px', background: '#f5f5f5', borderRadius: '8px', overflow: 'hidden', position: 'relative', marginBottom: '0.8rem' }}>
                    <img src={p.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.65rem', fontWeight: 800, color: '#0066ff', justifyContent: 'center' }}>
                    <Camera size={14} /> CHANGER PHOTO
                    <input type="file" style={{ display: 'none' }} onChange={(e) => e.target.files && handleUpload(p.id, e.target.files[0])} />
                  </label>
                </div>
                <div>
                  <input value={p.title} onChange={(e) => updateProduct(p.id, 'title', e.target.value)} style={{ fontSize: '1.1rem', fontWeight: 800, border: 'none', width: '100%', outline: 'none', marginBottom: '8px' }} />
                  <textarea value={p.description} onChange={(e) => updateProduct(p.id, 'description', e.target.value)} style={{ fontSize: '0.85rem', color: '#666', border: 'none', width: '100%', outline: 'none', resize: 'none' }} rows={2} />
                </div>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <div><span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#999' }}>PRIX</span><input type="number" value={p.price} onChange={(e) => updateProduct(p.id, 'price', parseFloat(e.target.value))} style={{ display: 'block', width: '60px', padding: '8px', border: '1px solid #eee', borderRadius: '4px' }} /></div>
                  <div><span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#999' }}>STOCK</span><input type="number" value={p.stock} onChange={(e) => updateProduct(p.id, 'stock', parseInt(e.target.value))} style={{ display: 'block', width: '60px', padding: '8px', border: '1px solid #eee', borderRadius: '4px' }} /></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VUE COMMANDES */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem', background: '#fff', borderRadius: '12px', color: '#999' }}>
                <ShoppingBag size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                <p>Aucune commande pour le moment.</p>
              </div>
            ) : (
              orders.map((o) => (
                <div key={o.id} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                  {/* HEADER COMMANDE */}
                  <div style={{ background: '#fafafa', padding: '1.5rem 2rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                      <div><span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#999', display: 'block' }}>COMMANDE</span><span style={{ fontWeight: 800 }}>#{o.id.toString().slice(-6)}</span></div>
                      <div><span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#999', display: 'block' }}>DATE</span><span style={{ fontWeight: 600, fontSize: '0.9rem' }}><Calendar size={12} style={{ marginRight: '5px' }} /> {new Date(o.date).toLocaleDateString()}</span></div>
                      <div><span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#999', display: 'block' }}>CLIENT</span><span style={{ fontWeight: 800 }}>{o.customer.name}</span></div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>{o.total} €</span>
                      <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '1px' }}>{o.status}</div>
                    </div>
                  </div>

                  {/* CONTENU COMMANDE */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', padding: '2rem' }}>
                    {/* ARTICLES */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {o.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '1.5rem', padding: '1rem', background: '#fcfcfc', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
                          <div style={{ width: '80px', height: '80px', background: '#fff', borderRadius: '6px', overflow: 'hidden', border: '1px solid #eee' }}>
                            <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 5px' }}>{item.title}</h4>
                            <p style={{ fontSize: '0.8rem', color: '#666', margin: '0 0 10px' }}>{item.description}</p>
                            {item.dedication && (
                              <div style={{ background: '#fffbeb', padding: '8px 12px', borderLeft: '3px solid #fbbf24', fontSize: '0.8rem', fontStyle: 'italic' }}>
                                " {item.dedication} "
                              </div>
                            )}
                          </div>
                          {item.customImage && (
                            <button 
                              onClick={() => printImage(item.customImage)}
                              style={{ height: 'fit-content', background: '#000', color: '#fff', padding: '8px 15px', border: 'none', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                              <Printer size={14} /> IMPRIMER LE DESSIN
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* INFOS CLIENT */}
                    <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '12px' }}>
                      <h4 style={{ fontSize: '0.75rem', fontWeight: 900, marginBottom: '1.5rem', color: '#999', letterSpacing: '1px' }}>DÉTAILS D'EXPÉDITION</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <div style={{ display: 'flex', gap: '12px' }}><User size={16} color="#666" /> <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{o.customer.name}</span></div>
                        <div style={{ display: 'flex', gap: '12px' }}><Mail size={16} color="#666" /> <span style={{ fontSize: '0.9rem' }}>{o.customer.email}</span></div>
                        <div style={{ display: 'flex', gap: '12px' }}><MapPin size={16} color="#666" /> <span style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>{o.customer.addr}</span></div>
                      </div>
                      <button style={{ width: '100%', marginTop: '2rem', padding: '12px', background: 'transparent', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <ExternalLink size={14} /> GÉNÉRER ÉTIQUETTE ENVOI
                      </button>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}

      </main>
    </div>
  )
}
