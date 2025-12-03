import { useState, useEffect } from 'react'
import './App.css'

const sweaters = [
  {
    id: 1,
    name: "Cozy Cloud",
    message: "This one reminds me of you - soft, warm, and always comforting ❤️",
    emoji: "☁️",
    image: "https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 2,
    name: "Autumn Hug",
    message: "Perfect for those chilly evenings when we're cuddled up together 🍂",
    emoji: "🧡",
    image: "https://images.unsplash.com/photo-1631541909061-71e349d1f203?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 3,
    name: "Starry Night",
    message: "Wear this and think of me under the stars ✨",
    emoji: "⭐",
    image: "https://images.unsplash.com/photo-1610288311735-39b7facbd095?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
]

function App() {
  const [selectedSweater, setSelectedSweater] = useState(null)
  const [reservedSweaters, setReservedSweaters] = useState(new Set())
  const [hearts, setHearts] = useState([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setIsMenuOpen(false)
    }
  }

  const handleReserve = (sweaterId, e) => {
    e.stopPropagation()
    const newReserved = new Set(reservedSweaters)
    
    if (newReserved.has(sweaterId)) {
      newReserved.delete(sweaterId)
    } else {
      newReserved.add(sweaterId)
      // Create heart animation
      const rect = e.target.getBoundingClientRect()
      const newHearts = [...hearts]
      for (let i = 0; i < 5; i++) {
        newHearts.push({
          id: Date.now() + i,
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        })
      }
      setHearts(newHearts)
      
      // Remove hearts after animation
      setTimeout(() => {
        setHearts(prev => prev.slice(5))
      }, 2000)
    }
    
    setReservedSweaters(newReserved)
  }

  const handleSweaterClick = (sweater) => {
    setSelectedSweater(selectedSweater?.id === sweater.id ? null : sweater)
  }

  return (
    <div className="app">
      {/* Header */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <h1 className="header-title" onClick={() => scrollToSection('hero')}>
            Sweater Day for aniqa
          </h1>
          <button 
            className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
            <a href="#bouquet" onClick={(e) => { e.preventDefault(); scrollToSection('bouquet') }}>Bouquet</a>
            <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('hero') }}>Home</a>
            <a href="#sweaters" onClick={(e) => { e.preventDefault(); scrollToSection('sweaters') }}>Sweaters</a>
          </nav>
        </div>
      </header>

      {/* Flower Bouquet Section */}
      <section id="bouquet" className="bouquet-section">
        <div className="bouquet-container">
          <h2 className="bouquet-title">First of all a flower bouquet for u</h2>
          <div className="bouquet-wrapper">
            <div className="bouquet">💐</div>
          </div>
          <p className="bouquet-message">Sorry i couldn't send you a real one cus the instagram page u told me that delivers flowers arent responding</p>
        </div>
      </section>

      {/* Hero Section */}
      <section id="hero" className="hero">
        <div className="hero-content">
          <div className="sweater-illustration">🧶</div>
          <h1 className="hero-title">Sharing My Sweater With You ❤️</h1>
          <p className="hero-subtitle">Pick one (or more) to keep you warm and remind you of me</p>
        </div>
        <div className="scroll-indicator">↓</div>
      </section>

      {/* Sweater Showcase */}
      <section id="sweaters" className="sweaters-section">
        <div className="container">
          <h2 className="section-title">Choose Your Cozy Companion</h2>
          <div className="sweaters-grid">
            {sweaters.map((sweater) => (
              <div
                key={sweater.id}
                className={`sweater-card ${selectedSweater?.id === sweater.id ? 'selected' : ''}`}
                onClick={() => handleSweaterClick(sweater)}
              >
                <div className="sweater-emoji">{sweater.emoji}</div>
                <div className="sweater-visual">
                  <img 
                    src={sweater.image} 
                    alt={sweater.name}
                    className="sweater-image"
                    loading="lazy"
                  />
                </div>
                <h3 className="sweater-name">{sweater.name}</h3>
                <p className="sweater-message">{sweater.message}</p>
                <button
                  className={`reserve-btn ${reservedSweaters.has(sweater.id) ? 'reserved' : ''}`}
                  onClick={(e) => handleReserve(sweater.id, e)}
                >
                  {reservedSweaters.has(sweater.id) ? (
                    <>💕 Reserved! 💕</>
                  ) : (
                    <>💌 Send me this sweater</>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Message Section */}
      {selectedSweater && (
        <section className="message-section">
          <div className="message-card">
            <button className="close-btn" onClick={() => setSelectedSweater(null)}>×</button>
            <div className="message-content">
              <h3>💕 A Note About {selectedSweater.name} 💕</h3>
              <p>{selectedSweater.message}</p>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-hearts">
          <span className="heart">❤️</span>
          <span className="heart">💕</span>
          <span className="heart">💖</span>
          <span className="heart">💗</span>
          <span className="heart">💝</span>
        </div>
        <p className="footer-text">For Aniqa</p>
      </footer>

      {/* Floating Hearts Animation */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="floating-heart"
          style={{
            left: `${heart.x}px`,
            top: `${heart.y}px`,
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  )
}

export default App
