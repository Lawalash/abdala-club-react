// src/components/Espacos.jsx
import React, { useState, useEffect } from 'react'
import '../Espacos/Espacos.css'

// Importe suas imagens reais aqui
import academia1 from '../../assets/academia/academia1.png'


const cards = [
  { 
    title: 'Área de Musculação', 
    img: academia1, 
    desc: 'Equipamentos de última geração para treinos completos e eficientes. Espaço amplo e climatizado.'
  },
  { 
    title: 'Estúdio de Spinning', 
    img: academia1, 
    desc: 'Aulas imersivas com iluminação especial e som de alta qualidade para máxima performance.'
  },
  { 
    title: 'Piscina Aquecida', 
    img: academia1, 
    desc: 'Piscina semiolímpica com temperatura controlada o ano todo. Ideal para natação e hidroginástica.'
  },
  { 
    title: 'Estúdio de Yoga', 
    img: academia1, 
    desc: 'Ambiente tranquilo e climatizado para prática de yoga, pilates e meditação.'
  }
]

export default function Espacos() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play do carrossel
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <section className="espacos" id="espacos">
      <div className="espacos-header">
        <h2 className="section-title">Nossos Espaços</h2>
        <p className="section-subtitle">
          Conheça as instalações modernas e completas da Abdala Club Academia
        </p>
      </div>

      <div className="carousel-container">
        {/* Carrossel Desktop */}
        <div className="carousel-desktop">
          <div className="carousel-main">
            <button 
              className="carousel-btn prev" 
              onClick={prevSlide}
              aria-label="Slide anterior"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <div className="main-card">
              <div className="card-image-wrapper">
                <img 
                  src={cards[currentIndex].img} 
                  alt={cards[currentIndex].title} 
                  className="card-image" 
                />
                <div className="card-gradient"></div>
              </div>
              <div className="card-content">
                <h3 className="card-title">{cards[currentIndex].title}</h3>
                <p className="card-description">{cards[currentIndex].desc}</p>
              </div>
            </div>

            <button 
              className="carousel-btn next" 
              onClick={nextSlide}
              aria-label="Próximo slide"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          <div className="carousel-sidebar">
            {cards.map((card, index) => (
              <button
                key={index}
                className={`sidebar-item ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              >
                <div className="sidebar-image">
                  <img src={card.img} alt={card.title} />
                  <div className="sidebar-overlay"></div>
                </div>
                <div className="sidebar-info">
                  <h4>{card.title}</h4>
                  <span className="sidebar-number">{String(index + 1).padStart(2, '0')}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Carrossel Mobile */}
        <div className="carousel-mobile">
          <div className="mobile-track">
            <button 
              className="carousel-btn prev" 
              onClick={prevSlide}
              aria-label="Slide anterior"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <div className="mobile-card">
              <div className="mobile-image-wrapper">
                <img 
                  src={cards[currentIndex].img} 
                  alt={cards[currentIndex].title} 
                  className="mobile-image" 
                />
                <div className="mobile-gradient"></div>
                <div className="mobile-overlay">
                  <h3 className="mobile-title">{cards[currentIndex].title}</h3>
                </div>
              </div>
              <div className="mobile-content">
                <p className="mobile-description">{cards[currentIndex].desc}</p>
              </div>
            </div>

            <button 
              className="carousel-btn next" 
              onClick={nextSlide}
              aria-label="Próximo slide"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          <div className="mobile-dots">
            {cards.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}