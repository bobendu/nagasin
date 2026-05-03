import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp, ShoppingBag, Users, Euro, Calendar, Printer, User, Mail, MapPin, ExternalLink } from 'lucide-react'

interface Order {
  id: number;
  date: string;
  customer: { name: string, email: string, addr: string };
  items: any[];
  total: number;
  status: string;
}

export default function AdminDashboard({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [orders, setOrders] = useState<Order[]>([])
  
  useEffect(() => {
    const savedOrders = localStorage.getItem('nagasin_orders')
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }
  }, [isOpen])

  const stats = {
    revenue: orders.reduce((sum, o) => sum + o.total, 0),
    count: orders.length,
    customers: new Set(orders.map(o => o.customer.email)).size,
    average: orders.length > 0 ? (orders.reduce((sum, o) => sum + o.total, 0) / orders.length).toFixed(2) : 0
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
              <p style={{ fontSize: '0.85rem', color: '#666', margin: '5px 0 0' }}>Tableau de bord et suivi des ventes</p>
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
                       <div style={{ display: 'flex', gap: '2rem' }}>
                         <div><span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#999', display: 'block' }}>RÉFÉRENCE</span><span style={{ fontWeight: 800 }}>#{o.id.toString().slice(-6)}</span></div>
                         <div><span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#999', display: 'block' }}>CLIENT</span><span style={{ fontWeight: 800 }}>{o.customer.name}</span></div>
                         <div><span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#999', display: 'block' }}>DATE</span><span style={{ fontWeight: 600 }}>{new Date(o.date).toLocaleDateString()}</span></div>
                       </div>
                       <div style={{ textAlign: 'right' }}>
                         <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>{o.total} €</span>
                         <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#22c55e' }}>{o.status.toUpperCase()}</div>
                       </div>
                    </div>
                    
                    <div style={{ padding: '1.5rem 2rem', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {o.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <img src={item.image} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{item.title}</div>
                              {item.dedication && <div style={{ fontSize: '0.75rem', fontStyle: 'italic', color: '#666' }}>"{item.dedication}"</div>}
                            </div>
                            {item.customImage && (
                              <button 
                                onClick={() => printImage(item.customImage)}
                                style={{ background: '#000', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                              >
                                <Printer size={12} /> IMPRIMER
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}><User size={14} color="#999" /> <strong>{o.customer.name}</strong></div>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}><Mail size={14} color="#999" /> {o.customer.email}</div>
                        <div style={{ display: 'flex', gap: '8px' }}><MapPin size={14} color="#999" /> {o.customer.addr}</div>
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
