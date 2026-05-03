import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, ShoppingCart, Globe, RotateCcw, Home, ChevronLeft, Search, X } from 'lucide-react'

interface CustomPrintCardProps {
  onAddToCart: (item: any) => void;
  isAdmin?: boolean;
}

export default function CustomPrintCard({ onAddToCart, isAdmin }: CustomPrintCardProps) {
  const initialUrl = 'https://www.dessinateur.biz/blog/'
  const [url, setUrl] = useState(initialUrl)
  const [description, setDescription] = useState('')
  const [dedication, setDedication] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const [iframeKey, setIframeKey] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // États pour le titre, le prix et le descriptif éditables
  const [customTitle, setCustomTitle] = useState('Tirage sous cadre')
  const [customPrice, setCustomPrice] = useState(45)
  const [customDesc, setCustomDesc] = useState("Choisissez votre illustration préférée sur le blog (scrollez et cliquez) ou par mot clé ; je vous l'imprime, vous la mets sous cadre et je vous l'expédie.")

  useEffect(() => {
    const savedTitle = localStorage.getItem('nagasin_custom_print_title')
    const savedPrice = localStorage.getItem('nagasin_custom_print_price')
    const savedDesc = localStorage.getItem('nagasin_custom_print_desc')
    if (savedTitle) setCustomTitle(savedTitle)
    if (savedPrice) setCustomPrice(parseFloat(savedPrice))
    if (savedDesc) setCustomDesc(savedDesc)
  }, [])

  const updateTitle = (val: string) => {
    setCustomTitle(val)
    localStorage.setItem('nagasin_custom_print_title', val)
  }

  const updatePrice = (val: number) => {
    setCustomPrice(val)
    localStorage.setItem('nagasin_custom_print_price', val.toString())
  }

  const updateDesc = (val: string) => {
    setCustomDesc(val)
    localStorage.setItem('nagasin_custom_print_desc', val)
  }
  
  // Écouteur de messages sécurisé venant du blog
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // On ne répond qu'à ton blog officiel
      if (event.origin !== 'https://www.dessinateur.biz') return;

      if (event.data && event.data.type === 'NAGASIN_IMAGE_SELECTED') {
        setSelectedImage(event.data.src)
        if (event.data.alt) {
          setDescription(`Le dessin : ${event.data.alt}`)
        }
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const handleOrder = () => {
    onAddToCart({
      id: Date.now(),
      title: customTitle,
      price: customPrice,
      image: selectedImage || "https://www.dessinateur.net/wp-content/uploads/2024/06/logoNadessinateur.jpg",
      description: `Tirage du dessin : ${description}`,
      dedication: dedication,
      details: `Source: ${url}${selectedImage ? ' | Image: ' + selectedImage : ''}`,
      canBeDedicated: true,
      customImage: selectedImage
    })
    setDescription('')
    setDedication('')
    setSelectedImage(null)
  }

  const resetIframe = () => {
    setUrl(initialUrl)
    setIframeKey(prev => prev + 1)
  }

  return (
    <motion.div 
      className="custom-print-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        gridColumn: '1 / -1',
        background: '#fff',
        border: '1px solid #eee',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isHovered ? '0 30px 60px rgba(0,0,0,0.12)' : '0 10px 30px rgba(0,0,0,0.04)',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        marginTop: '2rem',
        borderBottom: '4px solid var(--primary-color)',
        position: 'relative'
      }}
    >
      {/* HEADER NAVIGATEUR */}
      <div style={{ 
        padding: '15px 25px', 
        background: '#f1f3f5', 
        borderBottom: '1px solid #e9ecef',
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={resetIframe}
            title="Page précédente"
            style={{ 
              background: 'white', border: '1px solid #dee2e6', borderRadius: '50%', 
              width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#495057'
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={resetIframe}
            title="Accueil Blog"
            style={{ 
              background: 'white', border: '1px solid #dee2e6', borderRadius: '50%', 
              width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#495057'
            }}
          >
            <Home size={14} />
          </button>
        </div>
        <div style={{ 
          flex: 1, 
          background: '#fff', 
          borderRadius: '20px', 
          padding: '8px 16px',
          border: '1px solid #dee2e6',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.8rem',
          color: '#868e96'
        }}>
          <Globe size={14} color="#adb5bd" />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</span>
        </div>

        <div style={{ display: 'flex', gap: '15px', color: '#adb5bd' }}>
          <RotateCcw size={16} style={{ cursor: 'pointer' }} onClick={() => setIframeKey(prev => prev + 1)} />
          <ExternalLink size={16} style={{ cursor: 'pointer' }} onClick={() => window.open(url, '_blank')} />
        </div>
      </div>

      <div style={{ display: 'flex', height: '650px', background: '#fff' }}>
        {/* IFRAME */}
        <div style={{ flex: 3, position: 'relative', borderRight: '1px solid #f1f3f5' }}>
          <iframe 
            key={iframeKey}
            src={url}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Blog na!"
          />
        </div>

        {/* CONTROLES */}
        <div style={{ flex: 1.2, padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#fcfcfc', overflow: 'hidden' }}>
          <div>
            {isAdmin ? (
              <input 
                value={customTitle} 
                onChange={(e) => updateTitle(e.target.value)}
                style={{ 
                  fontSize: '1.4rem', fontWeight: 900, border: 'none', borderBottom: '2px solid #004169', 
                  outline: 'none', background: 'transparent', width: '100%', marginBottom: '0.8rem' 
                }}
              />
            ) : (
              <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.8rem', lineHeight: 1.1, fontWeight: 900 }}>{customTitle}</h2>
            )}
            
            {/* RECHERCHE DYNAMIQUE DÉPLACÉE ICI */}
            <div style={{ 
              display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '8px', 
              border: '1px solid #eee', padding: '6px 10px', gap: '8px', marginBottom: '1rem',
              boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
            }}>
              <Search size={16} color="var(--primary-color)" />
              <input 
                type="text" 
                placeholder="Chercher un thème..." 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const query = (e.target as HTMLInputElement).value;
                    if (query) setUrl(`https://www.dessinateur.biz/blog/?s=${encodeURIComponent(query)}`);
                  }
                }}
                style={{ border: 'none', outline: 'none', fontSize: '0.85rem', width: '100%', fontWeight: 500 }}
              />
            </div>

            {isAdmin ? (
              <textarea 
                value={customDesc} 
                onChange={(e) => updateDesc(e.target.value)}
                style={{ 
                  fontSize: '0.8rem', color: '#666', lineHeight: 1.5, margin: 0,
                  width: '100%', border: 'none', borderBottom: '1px dashed #004169', 
                  outline: 'none', background: 'transparent', resize: 'none', minHeight: '60px'
                }}
              />
            ) : (
              <p style={{ fontSize: '0.8rem', color: '#666', lineHeight: 1.5, margin: 0 }}>
                {customDesc}
              </p>
            )}
          </div>

          {/* APERÇU IMAGE SÉLECTIONNÉE */}
          {selectedImage && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ 
                background: '#fff', padding: '8px', borderRadius: '8px', border: '2px solid var(--primary-color)',
                position: 'relative'
              }}
            >
              <img src={selectedImage} style={{ width: '100%', height: '100px', objectFit: 'contain' }} />
              
              <button 
                onClick={() => setSelectedImage(null)}
                style={{ 
                  position: 'absolute', top: '-10px', right: '-10px', background: '#ff5f57', 
                  color: 'white', borderRadius: '50%', width: '28px', height: '28px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none',
                  cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}
              >
                <X size={16} />
              </button>

              <div style={{ 
                position: 'absolute', bottom: '10px', left: '10px', background: 'var(--primary-color)', 
                color: 'white', borderRadius: '4px', padding: '2px 8px', fontSize: '0.6rem', fontWeight: 800
              }}>
                CHOISI !
              </div>
            </motion.div>
          )}

          <div style={{ background: '#fff', padding: '0.8rem', borderRadius: '8px', border: '1px solid #eee' }}>
            <label style={{ fontSize: '0.65rem', fontWeight: 900, marginBottom: '5px', display: 'block', color: '#999' }}>DÉDICACE ?</label>
            <textarea 
              placeholder="Texte de la dédicace..."
              value={dedication}
              onChange={(e) => setDedication(e.target.value)}
              style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', resize: 'none', minHeight: '40px', fontSize: '0.8rem' }}
            />
          </div>

          <div style={{ marginTop: 'auto' }}>
            {isAdmin ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '0.8rem' }}>
                <input 
                  type="number"
                  value={customPrice} 
                  onChange={(e) => updatePrice(parseFloat(e.target.value))}
                  style={{ 
                    fontSize: '1.4rem', fontWeight: 900, border: 'none', borderBottom: '2px solid #004169', 
                    outline: 'none', background: 'transparent', width: '80px' 
                  }}
                />
                <span style={{ fontWeight: 900, fontSize: '1.4rem' }}>€</span>
              </div>
            ) : (
              <span style={{ fontSize: '1.5rem', fontWeight: 900, display: 'block', marginBottom: '0.8rem' }}>{customPrice.toFixed(2)} €</span>
            )}
            <button 
              className="btn-cta" 
              onClick={handleOrder}
              disabled={!selectedImage && !description}
              style={{ width: '100%', borderRadius: '8px', padding: '0.8rem', fontSize: '0.8rem', opacity: (selectedImage || description) ? 1 : 0.5 }}
            >
              AJOUTER AU PANIER <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>

    </motion.div>
  )
}
