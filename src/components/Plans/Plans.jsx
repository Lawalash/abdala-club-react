// src/components/Plans/Plans.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Plans.css'

const PLANS = [
  { 
    id: 'individual', 
    title: 'Plano Individual', 
    price: 'R$70,00', 
    mensal: 'R$60/mês',
    benefits: [
      'Acesso as 2 academias', 
      'AbdalaQRmachine', 
      'Equipamentos diversos',
      'Aulas coletivas',
      'Avaliação física mensal'
    ],
    featured: false
  },
  { 
    id: 'anual', 
    title: 'Plano Anual', 
    price: 'R$700,00', 
    monthlyEquivalent: 'R$58,33/mês',
    benefits: [
      'Tudo do plano Individual',
      'Parcelamento em até 12x', 
      'Economia de R$140',
      'Personal trainer 1x/mês',
      'Nutricionista incluído'
    ],
    featured: true
  },
  { 
    id: 'personalizado', 
    title: 'Plano Premium', 
    price: 'Sob Consulta', 
    benefits: [
      'Acesso VIP as 2 academias', 
      'Plano totalmente personalizado',
      'Personal trainer 2x/semana',
      'Nutricionista dedicado',
      'Massagem recuperativa'
    ],
    featured: false,
    premium: true
  }
]

export default function Plans() {
  const [openBenefits, setOpenBenefits] = useState(null)
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  const toggleBenefits = (planId, e) => {
    e.stopPropagation()
    setOpenBenefits(openBenefits === planId ? null : planId)
  }

  const handleSelectPlan = (planId) => {
    setSelected(planId)
  }

  const handleSignup = (e) => {
    e.stopPropagation()
    navigate('/cadastro')
  }

  return (
    <section className="plans" id="plans">
      <div className="container">
        <h2 className="section-title">Nossos Planos</h2>
        <p className="section-subtitle">
          Escolha o plano ideal para sua jornada fitness e comece hoje mesmo
        </p>

        <div className="plans-grid">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`plan-card ${selected === plan.id ? 'selected' : ''} ${plan.featured ? 'featured' : ''} ${plan.premium ? 'premium' : ''}`}
              onClick={() => handleSelectPlan(plan.id)}
            >
              <div className="plan-header">
                <h3>{plan.title}</h3>
                <div className="plan-price">
                  {plan.price}
                  {plan.monthlyEquivalent && (
                    <span className="monthly-price">{plan.monthlyEquivalent}</span>
                  )}
                  {plan.mensal && (
                    <span className="monthly-price">{plan.mensal}</span>
                  )}
                </div>
              </div>

              <div className="plan-features">
                <p className="plan-payment-options">
                  <i className="fas fa-credit-card"></i> 
                  Condições especiais de pagamento
                </p>

                <div 
                  className={`benefits-toggle ${openBenefits === plan.id ? 'active' : ''}`}
                  onClick={(e) => toggleBenefits(plan.id, e)}
                >
                  <span>Ver todos os benefícios</span>
                  <i className={`fas fa-chevron-${openBenefits === plan.id ? 'up' : 'down'}`}></i>
                </div>

                <ul className={`benefits-list ${openBenefits === plan.id ? 'active' : ''}`}>
                  {plan.benefits.map((benefit, i) => (
                    <li key={i}>
                      <i className="fas fa-check"></i> 
                      {benefit}
                    </li>
                  ))}
                </ul>

                <button 
                  className="btn btn-primary" 
                  onClick={handleSignup}
                >
                  Assinar Agora
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}