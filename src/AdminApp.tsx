import { useState, useEffect } from 'react'
import { Save, Package, ArrowLeft, Camera, Loader } from 'lucide-react'

interface Product {
  id: number;
  slug: string;
  title: string;
  category: string;
  price: number;
  description: string;
  image: string;
  canBeDedicated: boolean;
  stock: number;
}

export default function AdminApp({ onBack }: { onBack: () => void }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingId, setUploadingId] = useState<number | null>(null)

  // Charger les données (Priorité LocalStorage > JSON distant)
  useEffect(() => {
    const saved = localStorage.getItem('nagasin_catalog')
    if (saved) {
      setProducts(JSON.parse(saved))
      setLoading(false)
    } else {
      fetch('/api/products.json')
        .then(res => res.json())
        .then(data => {
          setProducts(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [])

  const updateProduct = (id: number, field: keyof Product, value: any) => {
    const newProducts = products.map(p => p.id === id ? { ...p, [field]: value } : p)
    setProducts(newProducts)
    // Sauvegarde auto dans le navigateur pour ne rien perdre
    localStorage.setItem('nagasin_catalog', JSON.stringify(newProducts))
  }

  const handleUpload = async (id: number, file: File) => {
    setUploadingId(id)
    
    // Convertir l'image en Base64 pour un affichage immédiat et persistant en local
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64data = reader.result as string
      
      // Tentative d'upload réel (pour quand on sera sur OVH)
      const formData = new FormData()
      formData.append('photo', file)
      
      try {
        const response = await fetch('/api/upload.php', { method: 'POST', body: formData })
        const data = await response.json()
        if (data.success) {
          updateProduct(id, 'image', data.url)
        } else {
          updateProduct(id, 'image', base64data)
        }
      } catch (err) {
        // Mode secours : On garde la version mémoire
        updateProduct(id, 'image', base64data)
      }
      setUploadingId(null)
    }
    reader.readAsDataURL(file)
  }

  const saveAll = async () => {
    setSaving(true)
    localStorage.setItem('nagasin_catalog', JSON.stringify(products))
    
    try {
      const res = await fetch('/api/save_products.php', {
        method: 'POST',
        body: JSON.stringify(products)
      })
      const data = await res.json()
      if (data.success) alert("Catalogue synchronisé sur le serveur !")
      else alert("Enregistré localement dans votre navigateur (Le serveur PHP n'est pas actif).")
    } catch (err) {
      alert("Enregistré localement dans votre navigateur (Le serveur PHP n'est pas actif).")
    }
    setSaving(false)
  }

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Chargement...</div>

  return (
    <div style={{ padding: '2rem', background: '#f5f5f5', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 800 }}>
            <ArrowLeft size={16} /> RETOUR
          </button>
          <button onClick={saveAll} style={{ background: 'var(--primary-color)', color: '#fff', padding: '0.8rem 2rem', border: 'none', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '4px' }}>
            {saving ? <Loader className="animate-spin" size={18} /> : <Save size={18} />} 
            ENREGISTRER LES MODIFICATIONS
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {products.map((p) => (
            <div key={p.id} style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'grid', gridTemplateColumns: '120px 1fr 150px', gap: '2rem', alignItems: 'center' }}>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '100px', height: '100px', background: '#eee', borderRadius: '8px', overflow: 'hidden', position: 'relative', marginBottom: '0.8rem' }}>
                  <img src={p.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                  {uploadingId === p.id && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Loader className="animate-spin" size={20} />
                    </div>
                  )}
                </div>
                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-color)', justifyContent: 'center' }}>
                  <Camera size={14} /> PHOTO
                  <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => e.target.files && handleUpload(p.id, e.target.files[0])} />
                </label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <input 
                  value={p.title} 
                  onChange={(e) => updateProduct(p.id, 'title', e.target.value)}
                  style={{ fontSize: '1.2rem', fontWeight: 800, border: 'none', borderBottom: '1px solid #eee', width: '100%', outline: 'none' }}
                />
                <textarea 
                  value={p.description} 
                  onChange={(e) => updateProduct(p.id, 'description', e.target.value)}
                  style={{ fontSize: '0.9rem', color: '#666', border: 'none', borderBottom: '1px solid #f9f9f9', width: '100%', outline: 'none', resize: 'none' }}
                  rows={2}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>PRIX (€)</span>
                  <input 
                    type="number" 
                    value={p.price} 
                    onChange={(e) => updateProduct(p.id, 'price', parseFloat(e.target.value))}
                    style={{ width: '60px', padding: '5px', border: '1px solid #eee', fontWeight: 800 }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>STOCK</span>
                  <input 
                    type="number" 
                    value={p.stock} 
                    onChange={(e) => updateProduct(p.id, 'stock', parseInt(e.target.value))}
                    style={{ width: '60px', padding: '5px', border: '1px solid #eee', fontWeight: 800 }}
                  />
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
