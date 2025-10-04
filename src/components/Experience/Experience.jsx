// src/components/Experience.jsx
import React, { useRef, useState } from 'react'
import '../Experience/Esperience.css' // importe o CSS se necessário
import videoAcademia from '../../assets/videos/academiapalmeira.mp4'

export default function Experience() {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  return (
    <section className="experience" id="experience">
      <h2 className="section-title">Experimente Nossa Academia</h2>
      <p className="section-subtitle">
        Conheça nossa estrutura e entenda por que somos a melhor escolha para você alcançar seus objetivos fitness.
      </p>

      <div className="mockup-container">
        <div className="phone-mockup">
          <div className="phone-notch" />
          <div className="video-wrapper" onClick={togglePlay}>
            <video 
              ref={videoRef}
              id="gym-video" 
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src={videoAcademia} type="video/mp4" />
              Seu navegador não suporta vídeos HTML5.
            </video>
            {!isPlaying && (
              <div className="video-overlay">
                <button className="play-btn" aria-label="Reproduzir vídeo">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="48" 
                    height="48" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                  </svg>
                </button>
              </div>
            )}
          </div>
          <div className="phone-home-button" />
        </div>
      </div>
    </section>
  )
}