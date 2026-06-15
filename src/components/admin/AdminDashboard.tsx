import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp, ShoppingBag, Users, Euro, Calendar, Printer, User, Mail, MapPin, CreditCard, Truck, CheckCircle2, Package, Send, AlertCircle } from 'lucide-react'

interface Order {
  id: number;
  date: string;
  customer: { name: string, email: string, addr: string };
  items: any[];
  total: number;
  status: string;
  paymentId?: string;
}

export default function AdminDashboard({ isOpen, onClose, adminToken, shippingCost, onUpdateShipping }: { 
  isOpen: boolean, 
  onClose: () => void, 
  adminToken?: string,
  shippingCost: number,
  onUpdateShipping: (val: number) => void
}) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [pendingChange, setPendingChange] = useState<{ id: number, status: string, customer: string } | null>(null)
  
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

  useEffect(() => {
    if (isOpen) fetchOrders();
  }, [isOpen, adminToken])

  const confirmStatusUpdate = async () => {
    if (!pendingChange) return;
    const { id, status } = pendingChange;
    
    setUpdatingId(id)
    setPendingChange(null)
    
    try {
      const response = await fetch('/api/update_order.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': adminToken || ''
        },
        body: JSON.stringify({ id, status })
      });
      
      if (response.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
      } else {
        alert("Erreur lors de la mise à jour du statut.");
      }
    } catch (err) {
      console.error(err);
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    } finally {
      setUpdatingId(null)
    }
  }

  const stats = {
    revenue: orders.reduce((sum, o) => sum + o.total, 0),
    count: orders.length,
    customers: new Set(orders.map(o => o.customer.email)).size,
    average: orders.length > 0 ? (orders.reduce((sum, o) => sum + o.total, 0) / orders.length).toFixed(2) : 0
  }

  const printImage = (url: string) => {
    try {
      const sanitizedUrl = new URL(url).toString();
      // Résout la version haute résolution originale si c'est une image de blog WordPress redimensionnée
      const highResUrl = sanitizedUrl.replace(/-\d+x\d+(\.[a-zA-Z]+)$/, '$1');
      const win = window.open('', '_blank')
      if (win) {
        win.document.write(`
          <html>
            <head>
              <title>Impression Tirage - Nagasin</title>
              <style>
                html, body {
                  margin: 0;
                  padding: 0;
                  min-height: 100vh;
                  background: #111;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  font-family: system-ui, sans-serif;
                }
                #print-img {
                  max-width: 90vw;
                  max-height: 75vh;
                  object-fit: contain;
                  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                  border: 2px solid #fff;
                  background: #fff;
                }
                @media print {
                  @page {
                    size: auto;
                    margin: 0;
                  }
                  html, body {
                    background: #fff !important;
                    width: 100% !important;
                    height: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    display: block !important;
                  }
                  .no-print {
                    display: none !important;
                  }
                  #print-img {
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    max-width: 100% !important;
                    max-height: 100% !important;
                    object-fit: contain !important;
                    border: none !important;
                    box-shadow: none !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    z-index: 9999 !important;
                  }
                }
              </style>
            </head>
            <body>
              <div class="no-print" style="text-align: center; margin-bottom: 20px; color: #fff; padding: 20px;">
                <h2 style="margin: 0 0 10px 0;">Préparation de l'impression (Haute Résolution)</h2>
                <p style="color: #aaa; font-size: 0.85rem; margin: 0 0 15px 0;">
                  Pour un résultat optimal, décochez "En-têtes et pieds de page" et réglez les marges sur "Aucune" dans la boîte de dialogue d'impression.
                </p>
                <button onclick="window.print()" style="background: #004169; color: #fff; border: none; padding: 10px 24px; font-weight: 800; cursor: pointer; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px;">
                  Lancer l'impression
                </button>
              </div>
              
              <img id="print-img" alt="Tirage d'art" />

              <script>
                const img = document.getElementById('print-img');
                img.src = ${JSON.stringify(highResUrl)};
                img.onload = () => {
                  setTimeout(() => { window.print(); }, 300);
                };
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
          {/* CONFIRMATION MODAL */}
          <AnimatePresence>
            {pendingChange && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                  style={{ background: 'white', padding: '2.5rem', borderRadius: '20px', maxWidth: '450px', width: '100%', textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.2)' }}
                >
                  <div style={{ background: '#fff9db', color: '#f08c00', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <AlertCircle size={32} />
                  </div>
                  <h3 style={{ margin: '0 0 1rem', fontWeight: 900 }}>Confirmer le changement ?</h3>
                  <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.5, marginBottom: '2rem' }}>
                    Vous allez passer la commande de <strong>{pendingChange.customer}</strong> au statut <span style={{ fontWeight: 800, color: '#000' }}>"{pendingChange.status}"</span>. 
                    <br/><br/>
                    Un email de notification sera automatiquement envoyé au client.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      onClick={() => setPendingChange(null)}
                      style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #eee', background: 'white', fontWeight: 700, cursor: 'pointer' }}
                    >
                      ANNULER
                    </button>
                    <button 
                      onClick={confirmStatusUpdate}
                      style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#000', color: 'white', fontWeight: 700, cursor: 'pointer' }}
                    >
                      CONFIRMER
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* HEADER */}
          <div style={{ padding: '2rem 3rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0, color: '#000' }}>CONSOLE NAGASIN</h2>
              <p style={{ fontSize: '0.85rem', color: '#666', margin: '5px 0 0' }}>Tableau de bord et suivi des ventes {loading && "(Chargement...)"}</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button 
                onClick={onClose}
                style={{ background: '#f5f5f5', border: 'none', padding: '12px', borderRadius: '50%', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '3rem' }}>
            
            {/* PARTICIPATION AUX FRAIS D'ENVOI (TOUJOURS VISIBLE) */}
            <div 
              style={{ marginBottom: '3rem', background: '#f8f9fa', borderRadius: '16px', border: '1px solid #eee' }}
            >
              <div style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '0.8rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#004169' }}>
                  <Truck size={18} /> PARTICIPATIONS AUX FRAIS D'ENVOI
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ background: '#fff', padding: '10px 20px', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input 
                      type="number" 
                      step="0.1"
                      value={shippingCost}
                      onChange={(e) => onUpdateShipping(parseFloat(e.target.value))}
                      style={{ border: 'none', outline: 'none', fontSize: '1.4rem', fontWeight: 900, width: '100px', color: '#004169' }}
                    />
                    <span style={{ fontWeight: 900, fontSize: '1.4rem', color: '#004169' }}>€</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#666', margin: 0, maxWidth: '400px', lineHeight: 1.4 }}>
                    Ce montant est ajouté automatiquement au total de chaque panier client pour couvrir les frais de traitement et d'expédition.
                  </p>
                </div>
              </div>
            </div>

            {/* STATS CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
              <StatCard icon={<Euro size={20} />} label="CHIFFRE D'AFFAIRES" value={`${stats.revenue.toFixed(2)} €`} color="#00e5ff" />
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
                orders.map((o) => {
                  const itemsSubtotal = o.items.reduce((sum, item) => sum + (item.price || 0), 0);
                  const shipping = o.total - itemsSubtotal;
                  return (
                    <div key={o.id} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #eee', overflow: 'hidden', opacity: updatingId === o.id ? 0.6 : 1 }}>
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
                         <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                           <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>{o.total.toFixed(2)} €</span>
                           
                           <div style={{ display: 'flex', gap: '5px' }}>
                             <StatusButton 
                              active={o.status === 'Payée'} 
                              color="#22c55e" 
                              icon={<CheckCircle2 size={12} />} 
                              label="Payée" 
                              onClick={() => setPendingChange({ id: o.id, status: 'Payée', customer: o.customer.name })} 
                             />
                             <StatusButton 
                              active={o.status === 'En préparation'} 
                              color="#f59e0b" 
                              icon={<Package size={12} />} 
                              label="Préparation" 
                              onClick={() => setPendingChange({ id: o.id, status: 'En préparation', customer: o.customer.name })} 
                             />
                             <StatusButton 
                              active={o.status === 'Expédiée'} 
                              color="#3b82f6" 
                              icon={<Send size={12} />} 
                              label="Expédiée" 
                              onClick={() => setPendingChange({ id: o.id, status: 'Expédiée', customer: o.customer.name })} 
                             />
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
                                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#666', marginTop: '2px' }}>{item.price.toFixed(2)} €</div>
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
  
                        <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '12px', fontSize: '0.85rem', border: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <h4 style={{ fontSize: '0.7rem', fontWeight: 900, color: '#999', marginBottom: '5px', letterSpacing: '1px' }}>EXPÉDITION</h4>
                          <div style={{ display: 'flex', gap: '10px' }}><User size={16} color="#666" /> <strong>{o.customer.name}</strong></div>
                          <div style={{ display: 'flex', gap: '10px' }}><Mail size={16} color="#666" /> {o.customer.email}</div>
                          <div style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}><MapPin size={16} color="#666" /> {o.customer.addr}</div>
                          
                          <div style={{ borderTop: '1px dashed #ddd', paddingTop: '10px', marginTop: '5px', fontSize: '0.8rem', color: '#555' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span>Sous-total articles :</span>
                              <strong>{itemsSubtotal.toFixed(2)} €</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Frais d'expédition :</span>
                              <strong>{shipping.toFixed(2)} €</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function StatusButton({ active, color, icon, label, onClick }: { active: boolean, color: string, icon: any, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '0.6rem',
        fontWeight: 800,
        padding: '4px 8px',
        borderRadius: '4px',
        cursor: 'pointer',
        border: '1px solid',
        borderColor: active ? color : '#eee',
        background: active ? color : 'transparent',
        color: active ? 'white' : '#999',
        transition: 'all 0.2s'
      }}
    >
      {icon} {label.toUpperCase()}
    </button>
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
