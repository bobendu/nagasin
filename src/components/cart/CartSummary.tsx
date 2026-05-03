export interface CartSummaryProps {
  subtotal: number;
  shippingCost: number;
  total: number;
}

export default function CartSummary({ subtotal, shippingCost, total }: CartSummaryProps) {
  return (
    <div style={{ 
      padding: '1.5rem', 
      borderTop: '1px solid #eee', 
      background: '#fafafa', 
      borderRadius: '12px', 
      marginTop: '2rem', 
      marginBottom: '2rem' 
    }}>
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
  )
}
