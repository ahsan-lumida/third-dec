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
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true) // Start muted for autoplay
  const [needsUserInteraction, setNeedsUserInteraction] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      setShowBackToTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle user interaction to unmute and ensure playback
  useEffect(() => {
    const handleUserInteraction = () => {
      if (window.ytPlayer) {
        try {
          // Unmute immediately on user interaction
          try {
            if (window.ytPlayer.isMuted && window.ytPlayer.isMuted()) {
              window.ytPlayer.unMute()
              setIsMuted(false)
            } else {
              setIsMuted(false)
            }
          } catch (e) {
            // Try direct unmute
            try {
              window.ytPlayer.unMute()
              setIsMuted(false)
            } catch (e2) {
              console.error('Error unmuting:', e2)
            }
          }
          
          // Ensure playing
          try {
            const state = window.ytPlayer.getPlayerState()
            if (state !== window.YT.PlayerState.PLAYING) {
              window.ytPlayer.playVideo()
            }
            setIsPlaying(true)
            setNeedsUserInteraction(false)
          } catch (e) {
            console.error('Error starting playback:', e)
          }
        } catch (e) {
          console.error('Error on user interaction:', e)
        }
      }
    }

    // Listen for any user interaction to unmute (only once)
    let handled = false
    const wrappedHandler = () => {
      if (!handled) {
        handled = true
        handleUserInteraction()
      }
    }

    document.addEventListener('click', wrappedHandler, { once: true })
    document.addEventListener('touchstart', wrappedHandler, { once: true })
    document.addEventListener('keydown', wrappedHandler, { once: true })

    return () => {
      document.removeEventListener('click', wrappedHandler)
      document.removeEventListener('touchstart', wrappedHandler)
      document.removeEventListener('keydown', wrappedHandler)
    }
  }, [])

  useEffect(() => {
    let playerInitialized = false

    function initializePlayer() {
      if (playerInitialized || !window.YT || !window.YT.Player) {
        return
      }

      const playerElement = document.getElementById('youtube-player')
      if (!playerElement) {
        setTimeout(initializePlayer, 100)
        return
      }

      try {
        playerInitialized = true
        window.ytPlayer = new window.YT.Player('youtube-player', {
          videoId: 'izge-rLlINE', // Heather by Conan Gray
          playerVars: {
            autoplay: 1,
            mute: 1, // Start muted for autoplay, will unmute after interaction
            loop: 1,
            playlist: 'izge-rLlINE', // Required for loop to work
            controls: 0,
            modestbranding: 1,
            rel: 0,
            enablejsapi: 1,
          },
          events: {
            onReady: (event) => {
              try {
                event.target.playVideo()
                setIsPlaying(true)
                setIsMuted(true) // Will be unmuted on user interaction
                setNeedsUserInteraction(false)
              } catch (e) {
                console.log('Autoplay blocked, user interaction required')
                setNeedsUserInteraction(true)
              }
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true)
                // Update mute status
                try {
                  if (event.target.isMuted && event.target.isMuted()) {
                    setIsMuted(true)
                  } else {
                    setIsMuted(false)
                  }
                } catch (e) {
                  // Ignore mute check errors
                }
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false)
              } else if (event.data === window.YT.PlayerState.ENDED) {
                event.target.playVideo()
              } else if (event.data === window.YT.PlayerState.BUFFERING) {
                setIsPlaying(true)
              }
            },
            onError: (event) => {
              console.error('YouTube player error:', event.data)
            },
          },
        })
      } catch (e) {
        console.error('Error initializing YouTube player:', e)
        playerInitialized = false
      }
    }

    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      setTimeout(initializePlayer, 100)
    } else {
      // Load the API
      if (!window.onYouTubeIframeAPIReady) {
        window.onYouTubeIframeAPIReady = () => {
          setTimeout(initializePlayer, 100)
        }
      }

      const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]')
      if (!existingScript) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        tag.async = true
        const firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
      } else {
        // Script exists but API might not be ready yet
        if (window.YT && window.YT.Player) {
          setTimeout(initializePlayer, 100)
        }
      }
    }

    return () => {
      if (window.ytPlayer && window.ytPlayer.destroy) {
        try {
          window.ytPlayer.destroy()
        } catch (e) {
          console.error('Error destroying player:', e)
        }
        window.ytPlayer = null
      }
    }
  }, [])

  const togglePlayPause = () => {
    if (window.ytPlayer && window.ytPlayer.getPlayerState) {
      try {
        const state = window.ytPlayer.getPlayerState()
        if (state === window.YT.PlayerState.PLAYING) {
          window.ytPlayer.pauseVideo()
          setIsPlaying(false)
        } else {
          // Ensure unmuted before playing
          try {
            if (window.ytPlayer.isMuted()) {
              window.ytPlayer.unMute()
              setIsMuted(false)
            }
          } catch (e) {
            // Ignore mute errors
          }
          window.ytPlayer.playVideo()
          setIsPlaying(true)
          setNeedsUserInteraction(false)
        }
      } catch (e) {
        console.error('Error toggling playback:', e)
      }
    } else if (needsUserInteraction && window.ytPlayer) {
      // Try to start playback if it was blocked
      try {
        // Ensure unmuted
        try {
          if (window.ytPlayer.isMuted()) {
            window.ytPlayer.unMute()
            setIsMuted(false)
          }
        } catch (e) {
          // Ignore mute errors
        }
        window.ytPlayer.playVideo()
        setIsPlaying(true)
        setNeedsUserInteraction(false)
      } catch (e) {
        console.error('Error starting playback:', e)
      }
    }
  }

  const toggleMute = () => {
    if (window.ytPlayer) {
      try {
        // Check current mute status
        let currentlyMuted = false
        try {
          currentlyMuted = window.ytPlayer.isMuted()
        } catch (e) {
          // If isMuted() doesn't work, use state
          currentlyMuted = isMuted
        }
        
        if (currentlyMuted) {
          window.ytPlayer.unMute()
          setIsMuted(false)
        } else {
          window.ytPlayer.mute()
          setIsMuted(true)
        }
      } catch (e) {
        console.error('Error toggling mute:', e)
        // Fallback: toggle based on current state
        try {
          if (isMuted) {
            window.ytPlayer.unMute()
            setIsMuted(false)
          } else {
            window.ytPlayer.mute()
            setIsMuted(true)
          }
        } catch (e2) {
          console.error('Fallback mute toggle failed:', e2)
        }
      }
    }
  }

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
      {/* Hidden YouTube Player */}
      <div 
        id="youtube-player" 
        style={{ 
          position: 'fixed',
          width: '320px',
          height: '180px',
          opacity: 0,
          pointerEvents: 'none',
          top: '-9999px',
          left: '-9999px',
          zIndex: -1
        }}
      ></div>

      {/* Music Player */}
      <div className="music-player">
        <div className="music-player-content">
          <div className="music-info">
            <span className="music-note">🎵</span>
            <div className="music-details">
              <span className="music-title">Heather</span>
              <span className="music-artist">Conan Gray</span>
              {needsUserInteraction && (
                <span className="music-hint">Click anywhere to start</span>
              )}
            </div>
          </div>
          <div className="music-controls">
            <button 
              className="music-status"
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <h1 className="header-title" onClick={() => scrollToSection('hero')}>
           3rd December for Aniqa
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
          <h2 className="bouquet-title">First of all a bouquet for u</h2>
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
        <div className="scroll-indicator" onClick={() => scrollToSection('sweaters')}>↓</div>
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
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button 
          className="back-to-top"
          onClick={() => scrollToSection('hero')}
          aria-label="Back to top"
        >
          ↑
        </button>
      )}

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

