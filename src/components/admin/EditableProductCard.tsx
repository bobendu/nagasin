import { useState } from 'react'
import { ArrowRight, Trash2, Camera, Check, X } from 'lucide-react'
import type { Product } from '../../types'

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

  const handleLocalChange = (field: keyof Product, value: any) => {
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
        handleLocalChange('image', reader.result as string)
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  return (
    <div className="item-card-clean" style={{ 
      paddingBottom: '3rem', 
      position: 'relative',
      transition: 'all 0.3s ease',
      border: isAdmin ? (isEditing ? '2px solid #004169' : '1px dashed #ccc') : 'none',
      padding: isAdmin ? '1rem' : '0',
      background: isAdmin && isEditing ? '#f8fbff' : 'transparent'
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
        <img src={isEditing ? localProduct.image : product.image} alt={product.title} />
        {isAdmin && (
          <label style={{ 
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white',
            flexDirection: 'column', gap: '10px', opacity: 0, transition: 'opacity 0.2s'
          }} className="hover-overlay">
            <Camera size={32} />
            <span style={{ fontSize: '0.7rem', fontWeight: 900 }}>CHANGER L'IMAGE</span>
            <input type="file" style={{ display: 'none' }} onChange={handleImageChange} onClick={() => setIsEditing(true)} />
          </label>
        )}
      </div>

      {/* TEXT CONTENT */}
      <div style={{ marginTop: '1.5rem' }}>
        {isAdmin && (isEditing || product.price === 0) ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <input 
              value={localProduct.title} 
              onChange={e => handleLocalChange('title', e.target.value)}
              placeholder="Titre du produit"
              style={{ fontSize: '1.4rem', fontWeight: 900, border: 'none', borderBottom: '2px solid #004169', outline: 'none', width: '100%', background: 'transparent' }}
            />
            <textarea 
              value={localProduct.description} 
              onChange={e => handleLocalChange('description', e.target.value)}
              placeholder="Description courte"
              rows={2}
              style={{ fontSize: '0.9rem', color: '#666', border: 'none', borderBottom: '1px solid #eee', outline: 'none', width: '100%', resize: 'none', background: 'transparent' }}
            />
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.6rem', fontWeight: 900, color: '#999' }}>PRIX (€)</label>
                <input 
                  type="number"
                  value={localProduct.price} 
                  onChange={e => handleLocalChange('price', parseFloat(e.target.value))}
                  style={{ fontSize: '1.1rem', fontWeight: 800, border: 'none', borderBottom: '1px solid #eee', outline: 'none', width: '100%', background: 'transparent' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.6rem', fontWeight: 900, color: '#999' }}>STOCK</label>
                <input 
                  type="number"
                  value={localProduct.stock} 
                  onChange={e => handleLocalChange('stock', parseInt(e.target.value))}
                  style={{ fontSize: '1.1rem', fontWeight: 800, border: 'none', borderBottom: '1px solid #eee', outline: 'none', width: '100%', background: 'transparent' }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
              <button 
                onClick={handleSave}
                style={{ flex: 1, background: '#22c55e', color: 'white', border: 'none', padding: '10px', fontWeight: 900, fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
              >
                <Check size={14} /> VALIDER MODIFS
              </button>
              <button 
                onClick={handleCancel}
                style={{ background: '#eee', color: '#666', border: 'none', padding: '10px', fontWeight: 900, fontSize: '0.7rem', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ fontSize: '1.6rem', margin: '0 0 1rem', flex: 1 }}>{product.title}</h3>
              {isAdmin && (
                <button 
                  onClick={() => setIsEditing(true)}
                  style={{ background: 'transparent', border: '1px solid #ccc', padding: '4px 10px', fontSize: '0.6rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  MODIFIER
                </button>
              )}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: '1.5', maxWidth: '400px' }}>
              {product.description}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="btn-cta" onClick={() => onAddToCart(product)}>
                ACHETER <ArrowRight size={16} />
              </button>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontWeight: 900, fontSize: '1.3rem' }}>{product.price} €</span>
                {isAdmin && <span style={{ fontSize: '0.7rem', color: (product.stock ?? 0) > 0 ? '#22c55e' : '#ff4444', fontWeight: 800 }}>STOCK: {product.stock ?? 0}</span>}
              </div>
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
}
