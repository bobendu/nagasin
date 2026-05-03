import { ArrowRight, Trash2, Camera } from 'lucide-react'
import type { Product } from '../../data/products'

interface EditableProductCardProps {
  product: Product;
  isAdmin: boolean;
  onAddToCart: (p: Product) => void;
  onUpdate: (id: number, updates: Partial<Product>) => void;
  onDelete: (id: number) => void;
}

export default function EditableProductCard({ product, isAdmin, onAddToCart, onUpdate, onDelete }: EditableProductCardProps) {
  const handleChange = (field: keyof Product, value: any) => {
    onUpdate(product.id, { [field]: value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onloadend = () => {
        handleChange('image', reader.result as string)
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  return (
    <div className="item-card-clean" style={{ 
      paddingBottom: '3rem', 
      position: 'relative',
      transition: 'all 0.3s ease',
      border: isAdmin ? '1px dashed #004169' : 'none',
      padding: isAdmin ? '1rem' : '0'
    }}>
      {/* DELETE BUTTON (ADMIN ONLY) */}
      {isAdmin && (
        <button 
          onClick={() => onDelete(product.id)}
          style={{ 
            position: 'absolute', top: '-10px', right: '-10px', background: '#ff4444', 
            color: '#fff', border: 'none', padding: '8px', borderRadius: '50%', 
            cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', zIndex: 20 
          }}
        >
          <Trash2 size={14} />
        </button>
      )}

      {/* IMAGE SECTION */}
      <div className="image-container" style={{ position: 'relative' }}>
        <img src={product.image} alt={product.title} />
        {isAdmin && (
          <label style={{ 
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white',
            flexDirection: 'column', gap: '10px', opacity: 0, transition: 'opacity 0.2s'
          }} className="hover-overlay">
            <Camera size={32} />
            <span style={{ fontSize: '0.7rem', fontWeight: 900 }}>CHANGER L'IMAGE</span>
            <input type="file" style={{ display: 'none' }} onChange={handleImageChange} />
          </label>
        )}
      </div>

      {/* TEXT CONTENT */}
      <div style={{ marginTop: '1.5rem' }}>
        {isAdmin ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <input 
              value={product.title} 
              onChange={e => handleChange('title', e.target.value)}
              placeholder="Titre du produit"
              style={{ fontSize: '1.4rem', fontWeight: 900, border: 'none', borderBottom: '2px solid #004169', outline: 'none', width: '100%', background: 'transparent' }}
            />
            <textarea 
              value={product.description} 
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Description courte"
              rows={2}
              style={{ fontSize: '0.9rem', color: '#666', border: 'none', borderBottom: '1px solid #eee', outline: 'none', width: '100%', resize: 'none', background: 'transparent' }}
            />
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.6rem', fontWeight: 900, color: '#999' }}>PRIX (€)</label>
                <input 
                  type="number"
                  value={product.price} 
                  onChange={e => handleChange('price', parseFloat(e.target.value))}
                  style={{ fontSize: '1.1rem', fontWeight: 800, border: 'none', borderBottom: '1px solid #eee', outline: 'none', width: '100%', background: 'transparent' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.6rem', fontWeight: 900, color: '#999' }}>STOCK</label>
                <input 
                  type="number"
                  value={product.stock} 
                  onChange={e => handleChange('stock', parseInt(e.target.value))}
                  style={{ fontSize: '1.1rem', fontWeight: 800, border: 'none', borderBottom: '1px solid #eee', outline: 'none', width: '100%', background: 'transparent' }}
                />
              </div>
            </div>
            
            <button className="btn-cta" style={{ marginTop: '1rem', opacity: 0.5, pointerEvents: 'none' }}>
              MODE ÉDITION ACTIF
            </button>
          </div>
        ) : (
          <>
            <h3 style={{ fontSize: '1.6rem', margin: '0.5rem 0 1rem' }}>{product.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: '1.5', maxWidth: '400px' }}>
              {product.description}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 900, fontSize: '1.3rem' }}>{product.price} €</span>
                {isAdmin && <span style={{ fontSize: '0.7rem', color: product.stock > 0 ? '#22c55e' : '#ff4444', fontWeight: 800 }}>STOCK: {product.stock}</span>}
              </div>
              <button className="btn-cta" onClick={() => onAddToCart(product)}>
                ACHETER <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        .image-container:hover .hover-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  )
}
