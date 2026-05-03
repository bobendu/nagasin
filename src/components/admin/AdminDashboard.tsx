import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp, ShoppingBag, Users, Euro, Calendar, Printer, User, Mail, MapPin, CreditCard } from 'lucide-react'

interface Order {
  id: number;
  date: string;
  customer: { name: string, email: string, addr: string };
  items: any[];
  total: number;
  status: string;
  paymentId?: string;
}

export default function AdminDashboard({ isOpen, onClose, adminToken }: { isOpen: boolean, onClose: () => void, adminToken?: string }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (!isOpen) return;

    const fetchOrders = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/get_orders.php', {
          headers: {
            'X-Admin-Password': adminToken || ''
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          throw new Error('Unauthorized or Server Error');
        }
      } catch (err) {
        console.warn("API indisponible, lecture LocalStorage (Fallback dev).", err);
        const savedOrders = localStorage.getItem('nagasin_orders')
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders))
        }
      } finally {
        setLoading(false)
      }
    };

    fetchOrders();
  }, [isOpen, adminToken])

  const stats = {
    revenue: orders.reduce((sum, o) => sum + o.total, 0),
    count: orders.length,
    customers: new Set(orders.map(o => o.customer.email)).size,
    average: orders.length > 0 ? (orders.reduce((sum, o) => sum + o.total, 0) / orders.length).toFixed(2) : 0
  }

  const printImage = (url: string) => {
    // Validation basique de l'URL pour éviter l'injection de scripts
    try {
      const sanitizedUrl = new URL(url).toString();
      const win = window.open('', '_blank')
      if (win) {
        win.document.write(`
          <html>
            <head><title>Impression Tirage</title></head>
            <body style="margin:0; display:flex; align-items:center; justify-content:center; height:100vh; background:#000;">
              <img id="print-img" style="max-width:100%; max-height:100%; object-fit:contain;" />
              <script>
                const img = document.getElementById('print-img');
                img.src = ${JSON.stringify(sanitizedUrl)};
                img.onload = () => { window.print(); };
              </script>
            </body>
          </html>
        `)
        win.document.close()
      }
    } catch (e) {
      alert("URL d'image invalide.");
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          style={{
            position: 'fixed',
            inset: '2rem',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            zIndex: 1000,
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.05)'
          }}
        >
          {/* HEADER */}
          <div style={{ padding: '2rem 3rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0, color: '#000' }}>CONSOLE NAGASIN</h2>
              <p style={{ fontSize: '0.85rem', color: '#666', margin: '5px 0 0' }}>Tableau de bord et suivi des ventes {loading && "(Chargement...)"}</p>
            </div>
            <button 
              onClick={onClose}
              style={{ background: '#f5f5f5', border: 'none', padding: '12px', borderRadius: '50%', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '3rem' }}>
            {/* STATS CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
              <StatCard icon={<Euro size={20} />} label="CHIFFRE D'AFFAIRES" value={`${stats.revenue} €`} color="#00e5ff" />
              <StatCard icon={<ShoppingBag size={20} />} label="COMMANDES" value={stats.count} color="#ffd700" />
              <StatCard icon={<Users size={20} />} label="CLIENTS UNIQUES" value={stats.customers} color="#ff4081" />
              <StatCard icon={<TrendingUp size={20} />} label="PANIER MOYEN" value={`${stats.average} €`} color="#7c4dff" />
            </div>

            {/* ORDERS LIST */}
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={20} /> DERNIÈRES COMMANDES
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: '#f9f9f9', borderRadius: '16px', color: '#999' }}>
                  Aucune commande enregistrée.
                </div>
              ) : (
                orders.map((o) => (
                  <div key={o.id} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #eee', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem 2rem', background: '#fafafa', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                         <div><span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#999', display: 'block' }}>RÉFÉRENCE</span><span style={{ fontWeight: 800 }}>#{o.id.toString().slice(-6)}</span></div>
                         <div><span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#999', display: 'block' }}>CLIENT</span><span style={{ fontWeight: 800 }}>{o.customer.name}</span></div>
                         <div><span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#999', display: 'block' }}>DATE</span><span style={{ fontWeight: 600 }}>{new Date(o.date).toLocaleDateString()}</span></div>
                         {o.paymentId && (
                            <div>
                              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#999', display: 'block' }}>PAIEMENT</span>
                              <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <CreditCard size={10} /> {o.paymentId}
                              </span>
                            </div>
                         )}
                       </div>
                       <div style={{ textAlign: 'right' }}>
                         <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>{o.total} €</span>
                         <div style={{ 
                            fontSize: '0.65rem', 
                            fontWeight: 900, 
                            color: o.status === 'Payée' ? '#22c55e' : '#f59e0b',
                            background: o.status === 'Payée' ? '#f0fdf4' : '#fffbeb',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            marginTop: '4px',
                            display: 'inline-block',
                            border: `1px solid ${o.status === 'Payée' ? '#bbf7d0' : '#fef3c7'}`
                          }}>
                            {o.status.toUpperCase()}
                          </div>
                       </div>
                    </div>
                    
                    <div style={{ padding: '1.5rem 2rem', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        {o.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <img src={item.image} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #eee' }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{item.title}</div>
                              {item.dedication && <div style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--primary-color)', fontWeight: 600 }}>Dédicace : "{item.dedication}"</div>}
                            </div>
                            {item.customImage && (
                              <button 
                                onClick={() => printImage(item.customImage)}
                                style={{ background: '#000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                              >
                                <Printer size={14} /> IMPRIMER
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '12px', fontSize: '0.85rem', border: '1px solid #eee' }}>
                        <h4 style={{ fontSize: '0.7rem', fontWeight: 900, color: '#999', marginBottom: '1rem', letterSpacing: '1px' }}>EXPÉDITION</h4>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}><User size={16} color="#666" /> <strong>{o.customer.name}</strong></div>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}><Mail size={16} color="#666" /> {o.customer.email}</div>
                        <div style={{ display: 'flex', gap: '10px' }}><MapPin size={16} color="#666" /> {o.customer.addr}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: any, color: string }) {
  return (
    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <div style={{ background: `${color}15`, color: color, padding: '12px', borderRadius: '12px' }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#999', letterSpacing: '1px', marginBottom: '4px' }}>{label}</div>
        <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{value}</div>
      </div>
    </div>
  )
}
