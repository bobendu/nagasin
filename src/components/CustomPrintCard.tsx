import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, ShoppingCart, Info, Globe, Maximize2, RotateCcw, Home, ChevronLeft, PenLine, Search, X, Check } from 'lucide-react'

interface CustomPrintCardProps {
  onAddToCart: (item: any) => void;
}

export default function CustomPrintCard({ onAddToCart }: CustomPrintCardProps) {
  const initialUrl = 'https://www.dessinateur.biz/blog/'
  const [url, setUrl] = useState(initialUrl)
  const [description, setDescription] = useState('')
  const [dedication, setDedication] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const [iframeKey, setIframeKey] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  
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
      title: "Tirage d'art personnalisé",
      price: 45,
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
        <div style={{ flex: 1.2, padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#fcfcfc' }}>
          <div>
            <h2 style={{ fontSize: '2rem', margin: '0 0 1rem', lineHeight: 1.1, fontWeight: 900 }}>Tirage sous cadre</h2>
            
            {/* RECHERCHE DYNAMIQUE DÉPLACÉE ICI */}
            <div style={{ 
              display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '12px', 
              border: '1px solid #eee', padding: '8px 12px', gap: '10px', marginBottom: '1.5rem',
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

            <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.6 }}>
              Choisissez votre illustration préférée sur le blog dans la fenêtre ci-contre (scrollez et cliquez) ou par mot clé dans la zone de recherche ci-dessus ; je vous l'imprime, vous la mets sous cadre et je vous l'expédie dans les meilleurs délais (je peux même vous la dédicacer).
            </p>
          </div>

          {/* APERÇU IMAGE SÉLECTIONNÉE */}
          {selectedImage && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ 
                background: '#fff', padding: '10px', borderRadius: '12px', border: '2px solid var(--primary-color)',
                position: 'relative'
              }}
            >
              <img src={selectedImage} style={{ width: '100%', height: '150px', objectFit: 'contain' }} />
              
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

          <div style={{ background: '#fff', padding: '1rem', borderRadius: '12px', border: '1px solid #eee' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 900, marginBottom: '8px', display: 'block' }}>DÉDICACE ?</label>
            <textarea 
              placeholder="Texte de la dédicace..."
              value={dedication}
              onChange={(e) => setDedication(e.target.value)}
              style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', resize: 'none', minHeight: '60px' }}
            />
          </div>

          <div style={{ marginTop: 'auto' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, display: 'block', marginBottom: '1rem' }}>45.00 €</span>
            <button 
              className="btn-cta" 
              onClick={handleOrder}
              disabled={!selectedImage && !description}
              style={{ width: '100%', borderRadius: '12px', opacity: (selectedImage || description) ? 1 : 0.5 }}
            >
              AJOUTER AU PANIER <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </div>

    </motion.div>
  )
}
