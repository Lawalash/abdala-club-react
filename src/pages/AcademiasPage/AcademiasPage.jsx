import React from 'react'
import '../AcademiasPage/AcademiasPage.css'
import academiaImg from '../../assets/academia/academia.jpg'

export default function AcademiasPage(){
  return (
    <div className="main-content">
      <h2>Nossas Academias</h2>
      <div className="carousel-container">
        <div className="carousel-slide" style={{backgroundImage:`url(${academiaImg})`}}>
          <div className="slide-overlay">
            <div className="slide-content">
              <h3>Academia Palmeira</h3>
              <p>Descrição...</p>
            </div>
          </div>
        </div>
        {/* repita slides conforme necessário */}
      </div>
    </div>
  )
}
