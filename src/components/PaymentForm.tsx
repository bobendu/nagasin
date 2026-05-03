import { useState } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { Lock, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function PaymentForm({ total, onSuccess, onBack }: { total: number, onSuccess: (paymentId: string) => void, onBack: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [succeeded, setSucceeded] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) return

    setProcessing(true)
    setError(null)

    // Simulation de paiement pour la démo
    // Dans un vrai flux, on appellerait le backend pour créer un PaymentIntent
    // et on utiliserait stripe.confirmCardPayment
    
    setTimeout(() => {
      setProcessing(false)
      setSucceeded(true)
      setTimeout(() => {
        onSuccess('pi_simulated_' + Date.now())
      }, 1500)
    }, 2000)
  }

  return (
    <div style={{ marginTop: '1rem' }}>
      <h4 style={{ fontSize: '0.8rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '1px' }}>PAIEMENT SÉCURISÉ</h4>
      
      <form onSubmit={handleSubmit}>
        <div style={{ 
          padding: '1.2rem', 
          border: '1px solid #eee', 
          borderRadius: '8px', 
          background: 'white',
          marginBottom: '1rem' 
        }}>
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#9e2146' },
            },
          }} />
        </div>

        {error && (
          <div style={{ color: '#ef4444', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '1rem' }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span style={{ fontSize: '0.75rem', color: '#666' }}>Montant à payer</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{total} €</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.65rem', color: '#999' }}>
            <Lock size={10} /> Transaction sécurisée par Stripe
          </div>
        </div>

        <button
          disabled={!stripe || processing || succeeded}
          style={{
            width: '100%',
            background: succeeded ? '#22c55e' : '#000',
            color: 'white',
            padding: '1.2rem',
            border: 'none',
            fontWeight: 900,
            letterSpacing: '2px',
            cursor: (processing || succeeded) ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.3s ease'
          }}
        >
          {processing ? 'TRAITEMENT EN COURS...' : succeeded ? (
            <><CheckCircle2 size={18} /> PAIEMENT RÉUSSI</>
          ) : `PAYER ${total} €`}
        </button>

        {!processing && !succeeded && (
          <button 
            type="button"
            onClick={onBack}
            style={{ 
              width: '100%', background: 'transparent', color: '#666', 
              padding: '0.8rem', border: 'none', fontWeight: 800, fontSize: '0.7rem',
              letterSpacing: '1px', cursor: 'pointer', marginTop: '0.5rem'
            }}
          >
            RETOUR AUX INFOS DE LIVRAISON
          </button>
        )}
      </form>
    </div>
  )
}
