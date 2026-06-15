import { useState, useEffect } from 'react'
import { CheckCircle, Clock, Send, ArrowLeft, Printer, FileText, X } from 'lucide-react'

interface OrderStatusTrackingProps {
  orderId: string | null;
  onClose: () => void;
}

interface OrderData {
  id: number;
  date: string;
  customer: {
    name: string;
    email: string;
    addr: string;
  };
  items: Array<{
    title: string;
    price: number;
    image: string;
    dedication?: string;
  }>;
  total: number;
  status: 'Payée' | 'En préparation' | 'Expédiée';
}

export default function OrderStatusTracking({ orderId, onClose }: OrderStatusTrackingProps) {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    setError(null);

    fetch(`/api/order_status.php?id=${orderId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Commande introuvable ou erreur serveur");
        }
        return res.json();
      })
      .then(data => {
        setOrder(data);
      })
      .catch(err => {
        console.error(err);
        // Fallback local en développement si l'API n'est pas dispo
        const savedOrders = localStorage.getItem('nagasin_orders');
        if (savedOrders) {
          const ordersArray = JSON.parse(savedOrders);
          const found = ordersArray.find((o: any) => o.id == orderId);
          if (found) {
            setOrder(found);
            setLoading(false);
            return;
          }
        }
        setError("Impossible de trouver la commande. Veuillez vérifier le lien reçu par e-mail.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orderId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', fontFamily: 'Outfit, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary-color)', marginBottom: '10px' }}>NAGASIN.</h2>
          <p style={{ color: 'var(--text-muted)' }}>Chargement du suivi de commande...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', fontFamily: 'Outfit, sans-serif', padding: '2rem' }}>
        <div style={{ background: '#fff', border: '2px solid #000', padding: '3rem', width: '100%', maxWidth: '500px', textAlign: 'center', boxShadow: '10px 10px 0px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'red', marginBottom: '1.5rem' }}>ERREUR</h2>
          <p style={{ color: '#555', lineHeight: 1.6, marginBottom: '2rem' }}>{error || "Commande introuvable."}</p>
          <button onClick={onClose} style={{ background: '#000', color: '#fff', border: 'none', padding: '1rem 2rem', fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  // --- RENDU DE LA FACTURE ---
  if (showInvoice) {
    const itemsTotal = order.items.reduce((sum, item) => sum + item.price, 0);
    const shipping = order.total - itemsTotal;

    return (
      <div className="invoice-container-view" style={{ background: '#fafafa', minHeight: '100vh', padding: '3rem 1rem', fontFamily: 'Outfit, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Navigation / Actions (No Print) */}
        <div className="no-print" style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <button onClick={() => setShowInvoice(false)} style={{ background: 'transparent', border: '1px solid #000', padding: '0.8rem 1.5rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}>
            <ArrowLeft size={16} /> RETOUR AU SUIVI
          </button>
          <button onClick={() => window.print()} style={{ background: '#004169', border: 'none', padding: '0.8rem 1.5rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontSize: '0.75rem' }}>
            <Printer size={16} /> IMPRIMER / ENREGISTRER PDF
          </button>
        </div>

        {/* Facture format A4 */}
        <div className="invoice-sheet" style={{ width: '100%', maxWidth: '800px', background: '#fff', border: '1px solid #ddd', padding: '4rem', display: 'flex', flexDirection: 'column', gap: '3rem', position: 'relative' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '1.5rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1, margin: '0 0 10px 0' }}>NAGASIN.</h1>
              <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>Boutique Officielle na! - Art & Illustrations</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 10px 0', color: '#004169' }}>FACTURE</h2>
              <p style={{ fontSize: '0.85rem', margin: '0 0 4px 0' }}><strong>N° :</strong> FAC-{order.id.toString().slice(-6)}</p>
              <p style={{ fontSize: '0.85rem', margin: 0 }}><strong>Date :</strong> {new Date(order.date).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>

          {/* Adresses */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            <div>
              <h3 style={{ fontSize: '0.75rem', fontWeight: 900, color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>ÉMETTEUR</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                <strong>Benoît Baudu (na!)</strong><br />
                Artiste-Auteur / NA! Studio<br />
                contact@nagasin.fr<br />
                www.nagasin.fr
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '0.75rem', fontWeight: 900, color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>ADRESSÉ À</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                <strong>{order.customer.name}</strong><br />
                {order.customer.addr}<br />
                {order.customer.email}
              </p>
            </div>
          </div>

          {/* Tableau articles */}
          <div style={{ flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #000' }}>
                  <th style={{ padding: '10px 0', fontWeight: 900 }}>DÉSIGNATION</th>
                  <th style={{ padding: '10px 0', textAlign: 'right', fontWeight: 900, width: '100px' }}>P.U.</th>
                  <th style={{ padding: '10px 0', textAlign: 'center', fontWeight: 900, width: '60px' }}>QTÉ</th>
                  <th style={{ padding: '10px 0', textAlign: 'right', fontWeight: 900, width: '120px' }}>TOTAL NET</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px 0' }}>
                      <span style={{ fontWeight: 800 }}>{item.title}</span>
                      {item.dedication && (
                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#004169', fontStyle: 'italic', marginTop: '2px' }}>
                          Option dédicace : "{item.dedication}"
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 0', textAlign: 'right' }}>{item.price.toFixed(2)} €</td>
                    <td style={{ padding: '12px 0', textAlign: 'center' }}>1</td>
                    <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 700 }}>{item.price.toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totaux */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Sous-total :</span>
                <span>{itemsTotal.toFixed(2)} €</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <span>Frais d'envoi :</span>
                <span>{shipping.toFixed(2)} €</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 900, color: '#000', paddingTop: '5px' }}>
                <span>TOTAL PAYÉ :</span>
                <span>{order.total.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Mentions Légales Obligatoires (Bas de page) */}
          <div style={{ borderTop: '1px solid #eee', paddingTop: '2rem', marginTop: 'auto', fontSize: '0.75rem', color: '#666', lineHeight: 1.5, textAlign: 'center' }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: 700 }}>TVA non applicable - article 293 B du CGI</p>
            <p style={{ margin: 0 }}>
              Facture acquittée. Mode de règlement : Carte Bancaire via Stripe.<br />
              Nagasin Studio par na! - Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDU DU SUIVI ---
  const currentStep = order.status === 'Expédiée' ? 3 : order.status === 'En préparation' ? 2 : 1;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', fontFamily: 'Outfit, sans-serif', padding: '4rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '650px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* En-tête */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1, margin: 0 }}>NAGASIN.</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '5px 0 0 0' }}>Suivi de commande en temps réel</p>
          </div>
          <button onClick={onClose} style={{ background: '#fff', border: '1px solid #000', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '0px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Bloc Suivi (Stepper) */}
        <div style={{ background: '#fff', border: '2px solid #000', padding: '2.5rem', boxShadow: '8px 8px 0px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#999' }}>RÉFÉRENCE : #{order.id.toString().slice(-6)}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#999' }}>DATE : {new Date(order.date).toLocaleDateString('fr-FR')}</span>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#004169', marginBottom: '2.5rem' }}>STATUT : {order.status.toUpperCase()}</h2>

          {/* Le Stepper Graphique */}
          <div className="stepper-wrapper" style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '1.5rem', padding: '0 10px' }}>
            {/* Barre de fond */}
            <div style={{ position: 'absolute', top: '24px', left: '10%', right: '10%', height: '4px', background: '#eee', zIndex: 1 }} />
            {/* Barre active */}
            <div 
              style={{ 
                position: 'absolute', top: '24px', left: '10%', 
                width: currentStep === 3 ? '80%' : currentStep === 2 ? '40%' : '0%', 
                height: '4px', background: '#004169', transition: 'width 0.5s ease', zIndex: 2 
              }} 
            />

            {/* Étape 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px', zIndex: 3 }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#004169', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #004169', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <CheckCircle size={20} />
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, marginTop: '10px', textAlign: 'center', textTransform: 'uppercase', color: '#004169' }}>Validée</span>
            </div>

            {/* Étape 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px', zIndex: 3 }}>
              <div 
                style={{ 
                  width: '48px', height: '48px', borderRadius: '50%', 
                  background: currentStep >= 2 ? '#004169' : '#fff', 
                  color: currentStep >= 2 ? 'white' : '#ccc', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  border: '3px solid', borderColor: currentStep >= 2 ? '#004169' : '#eee',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                }}
              >
                <Clock size={20} />
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, marginTop: '10px', textAlign: 'center', textTransform: 'uppercase', color: currentStep >= 2 ? '#004169' : '#999' }}>Préparation</span>
            </div>

            {/* Étape 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px', zIndex: 3 }}>
              <div 
                style={{ 
                  width: '48px', height: '48px', borderRadius: '50%', 
                  background: currentStep === 3 ? '#004169' : '#fff', 
                  color: currentStep === 3 ? 'white' : '#ccc', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  border: '3px solid', borderColor: currentStep === 3 ? '#004169' : '#eee',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                }}
              >
                <Send size={18} />
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, marginTop: '10px', textAlign: 'center', textTransform: 'uppercase', color: currentStep === 3 ? '#004169' : '#999' }}>Expédiée</span>
            </div>
          </div>
        </div>

        {/* Détail de la Commande */}
        <div style={{ background: '#fff', border: '2px solid #000', padding: '2.5rem', boxShadow: '8px 8px 0px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 900, color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>ARTICLES COMMANDÉS</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingBottom: '1.2rem', borderBottom: idx < order.items.length - 1 ? '1px dashed #eee' : 'none' }}>
                <img src={item.image} style={{ width: '50px', height: '50px', objectFit: 'cover', border: '1px solid #eee' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{item.title}</div>
                  {item.dedication && <div style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--primary-color)', fontWeight: 600 }}>Option dédicace : "{item.dedication}"</div>}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{item.price.toFixed(2)} €</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '2px solid #000', paddingTop: '1.5rem', marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 900, fontSize: '0.9rem' }}>TOTAL RÉGLÉ :</span>
            <span style={{ fontWeight: 900, fontSize: '1.2rem', color: '#000' }}>{order.total.toFixed(2)} €</span>
          </div>
        </div>

        {/* Options de Facture / Retour */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => setShowInvoice(true)} 
            style={{ flex: 1, background: '#fff', color: '#000', border: '2px solid #000', padding: '1.2rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}
          >
            <FileText size={16} /> Visualiser la facture
          </button>
          <button 
            onClick={onClose} 
            style={{ flex: 1, background: '#000', color: '#fff', border: 'none', padding: '1.2rem', fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}
          >
            Retour au site
          </button>
        </div>

      </div>
    </div>
  );
}
