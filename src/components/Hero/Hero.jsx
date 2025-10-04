import React, { useState, useEffect } from 'react';
import './Hero.css';

export default function Hero() {
  const [showContent, setShowContent] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detectar dispositivo mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Animação de entrada
    setTimeout(() => setShowContent(true), 100);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToSection = () => {
    document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Reduzir número de partículas em mobile
  const particleCount = isMobile ? 8 : 15;

  return (
    <section className="hero" id="home">
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="hero-video"
      >
        <source src="/videos/academiapalmeira.mp4" type="video/mp4" />
      </video>
      
      <div className="hero-overlay" />
      
      {/* Orbs gradientes animados */}
      <div className="gradient-orb orb-1" />
      <div className="gradient-orb orb-2" />
      <div className="gradient-orb orb-3" />

      {/* Partículas flutuantes - reduzidas em mobile */}
      <div className="particles">
        {[...Array(particleCount)].map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 15 + 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="hero-content">
        <h1 className="hero-title">
          Transforme seu corpo e sua vida
          <span className="cursor">|</span>
        </h1>
        
        <p className={`hero-subtitle ${showContent ? 'show' : ''}`}>
          Na Abdala Club Academia, oferecemos equipamentos modernos
          {!isMobile && <br />}
          {isMobile ? ' ' : ''}e instrutores qualificados para sua jornada fitness
        </p>

        <div className={`hero-buttons ${showContent ? 'show' : ''}`}>
          <a href="#plans" className="btn btn-primary">
            <span>Conhecer Planos</span>
            <i className="fas fa-arrow-right"></i>
          </a>
          <a href="#experience" className="btn btn-secondary">
            <i className="fas fa-play-circle"></i>
            <span>Ver Experiência</span>
          </a>
        </div>

        <div className={`hero-stats ${showContent ? 'show' : ''}`}>
          <div className="stat-item">
            <span className="stat-number">2</span>
            <span className="stat-label">Unidades</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">1000+</span>
            <span className="stat-label">Alunos</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">10+</span>
            <span className="stat-label">Anos</span>
          </div>
        </div>
      </div>
    </section>
  );
}