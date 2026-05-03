import type { CustomerInfo } from '../../types'

interface CheckoutFormProps {
  customerInfo: CustomerInfo;
  setCustomerInfo: (info: CustomerInfo) => void;
}

export default function CheckoutForm({ customerInfo, setCustomerInfo }: CheckoutFormProps) {
  return (
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
  )
}
