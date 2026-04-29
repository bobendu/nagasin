import { useState } from 'react'
import { ShoppingCart, Book, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import './App.css'

interface BookItem {
  id: number;
  title: string;
  category: string;
  price: number;
  description: string;
  image: string;
  isNew?: boolean;
}

const BOOKS: BookItem[] = [
  {
    id: 1,
    title: "Le Codex Maladie Rare",
    category: "Bande Dessinée",
    price: 24,
    description: "Une exploration graphique et humoristique du monde des maladies rares.",
    image: "/books/codex.jpg",
    isNew: true
  },
  {
    id: 2,
    title: "Hagard Dunord",
    category: "Humour",
    price: 19,
    description: "Les aventures déjantées du célèbre strip d'Automodélisme.",
    image: "/books/hagard.jpg"
  },
  {
    id: 3,
    title: "L'Actu au Scalpel",
    category: "Dessin de Presse",
    price: 22,
    description: "Le meilleur des dessins de presse parus ces 10 dernières années.",
    image: "/books/actu.jpg"
  }
]

export default function StoreApp() {
  const [cart, setCart] = useState<BookItem[]>([])

  const addToCart = (book: BookItem) => {
    setCart([...cart, book])
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ 
            background: 'var(--border-color)', 
            color: 'white', 
            width: '40px', 
            height: '40px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '1.5rem'
          }}>na!</div>
          <span style={{ fontWeight: 900, fontSize: '1.2rem', letterSpacing: '2px' }}>NAGASIN</span>
        </div>
        
        <div className="nav-links" style={{ display: 'flex', gap: '2rem' }}>
          <a href="#livres" className="nav-link">Les Livres</a>
          <a href="#planches" className="nav-link">Planches Originales</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>

        <div className="nav-actions" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <ShoppingCart size={22} strokeWidth={2.5} />
            {cart.length > 0 && (
              <span style={{ 
                position: 'absolute', 
                top: -8, 
                right: -8, 
                background: 'var(--primary-color)', 
                color: 'white', 
                fontSize: '0.65rem', 
                fontWeight: '900',
                padding: '2px 6px',
                border: '2px solid black'
              }}>
                {cart.length}
              </span>
            )}
          </div>
          <MenuButton />
        </div>
      </nav>

      <header className="hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="badge">Nouveau Titre</div>
            <h1>LE NAGASIN <br /> DE NA!</h1>
            <p>Retrouvez tous les albums, planches originales et gribouillages officiels de Benoît "na!" Baudu.</p>
            <button className="btn-primary" style={{ padding: '1rem 2rem' }}>
              Voir les nouveautés <ArrowRight size={20} style={{ marginLeft: '10px' }} />
            </button>
          </motion.div>
        </div>
      </header>

      <main className="container" id="livres" style={{ paddingBottom: '8rem' }}>
        <div className="book-grid">
          {BOOKS.map((book) => (
            <motion.div 
              key={book.id} 
              className="card"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="book-cover">
                <Book size={64} color="#ccc" />
                {book.isNew && <div className="badge" style={{ position: 'absolute', top: 10, right: 10 }}>Neuf</div>}
              </div>
              <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                {book.category}
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>{book.title}</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '1.5rem', minHeight: '3rem' }}>
                {book.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="book-price">{book.price}€</span>
                <button 
                  onClick={() => addToCart(book)}
                  style={{ padding: '0.6rem 1rem', fontSize: '0.8rem' }}
                >
                  Ajouter
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <footer style={{ background: '#000', color: '#fff', padding: '5rem 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ color: '#fff', marginBottom: '2rem' }}>D'AUTRES PROJETS ?</h2>
          <p style={{ color: '#aaa', marginBottom: '3rem' }}>Benoît réalise aussi des dessins en live et de la facilitation graphique.</p>
          <a href="https://www.dessinateur.net" target="_blank" rel="noopener" className="nav-link" style={{ color: 'var(--accent-color)', fontSize: '1.2rem' }}>
            Visiter le studio principal →
          </a>
          <div style={{ marginTop: '4rem', fontSize: '0.8rem', color: '#666' }}>
            © 2026 NA! NAGASIN • TOUS DROITS RÉSERVÉS
          </div>
        </div>
      </footer>
    </div>
  )
}

function MenuButton() {
  return (
    <button style={{ 
      border: 'none', 
      background: 'none', 
      padding: 0, 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '5px',
      width: '30px'
    }}>
      <div style={{ height: '3px', width: '100%', background: 'black' }}></div>
      <div style={{ height: '3px', width: '70%', background: 'black' }}></div>
      <div style={{ height: '3px', width: '100%', background: 'black' }}></div>
    </button>
  )
}
