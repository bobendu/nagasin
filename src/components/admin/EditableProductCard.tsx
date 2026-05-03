import { useState } from 'react'
import { ArrowRight, PenLine, Trash2, Camera, Save, X } from 'lucide-react'
import type { Product } from '../../data/products'

interface EditableProductCardProps {
  product: Product;
  isAdmin: boolean;
  onAddToCart: (p: Product) => void;
  onUpdate: (id: number, updates: Partial<Product>) => void;
  onDelete: (id: number) => void;
}

export default function EditableProductCard({ product, isAdmin, onAddToCart, onUpdate, onDelete }: EditableProductCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localProduct, setLocalProduct] = useState(product)

  const handleChange = (field: keyof Product, value: any) => {
    setLocalProduct(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onUpdate(product.id, localProduct)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setLocalProduct(product)
    setIsEditing(false)
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
      background: isEditing ? '#fff' : 'transparent',
      borderRadius: isEditing ? '16px' : '0',
      padding: isEditing ? '1rem' : '0',
      transition: 'all 0.3s ease'
    }}>
      {/* ADMIN CONTROLS OVERLAY */}
      {isAdmin && !isEditing && (
        <div style={{ 
          position: 'absolute', top: '-10px', right: '-10px', display: 'flex', gap: '8px', zIndex: 10 
        }}>
          <button 
            onClick={() => setIsEditing(true)}
            style={{ background: '#000', color: '#fff', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}
          >
            <PenLine size={14} />
          </button>
          <button 
            onClick={() => onDelete(product.id)}
            style={{ background: '#ff4444', color: '#fff', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {/* IMAGE SECTION */}
      <div className="image-container" style={{ position: 'relative' }}>
        <img src={localProduct.image} alt={localProduct.title} />
        {isEditing && (
          <label style={{ 
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white',
            flexDirection: 'column', gap: '10px'
          }}>
            <Camera size={32} />
            <span style={{ fontSize: '0.7rem', fontWeight: 900 }}>CHANGER L'IMAGE</span>
            <input type="file" style={{ display: 'none' }} onChange={handleImageChange} />
          </label>
        )}
      </div>

      {/* TEXT CONTENT */}
      <div style={{ marginTop: '1.5rem' }}>
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              value={localProduct.title} 
              onChange={e => handleChange('title', e.target.value)}
              placeholder="Titre du produit"
              style={{ fontSize: '1.4rem', fontWeight: 900, border: 'none', borderBottom: '2px solid #00e5ff', outline: 'none', width: '100%' }}
            />
            <textarea 
              value={localProduct.description} 
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Description courte"
              rows={2}
              style={{ fontSize: '0.9rem', color: '#666', border: 'none', borderBottom: '1px solid #eee', outline: 'none', width: '100%', resize: 'none' }}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.6rem', fontWeight: 900, color: '#999' }}>PRIX (€)</label>
                <input 
                  type="number"
                  value={localProduct.price} 
                  onChange={e => handleChange('price', parseFloat(e.target.value))}
                  style={{ fontSize: '1.1rem', fontWeight: 800, border: 'none', borderBottom: '1px solid #eee', outline: 'none', width: '100%' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.6rem', fontWeight: 900, color: '#999' }}>STOCK</label>
                <input 
                  type="number"
                  value={localProduct.stock} 
                  onChange={e => handleChange('stock', parseInt(e.target.value))}
                  style={{ fontSize: '1.1rem', fontWeight: 800, border: 'none', borderBottom: '1px solid #eee', outline: 'none', width: '100%' }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
              <button onClick={handleSave} style={{ flex: 1, background: '#000', color: '#fff', border: 'none', padding: '10px', fontWeight: 800, borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Save size={14} /> VALIDER
              </button>
              <button onClick={handleCancel} style={{ background: '#eee', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}>
                <X size={14} />
              </button>
            </div>
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
    </div>
  )
}
