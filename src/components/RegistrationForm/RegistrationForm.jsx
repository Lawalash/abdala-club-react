import React, { useState, useEffect } from 'react'
import './RegistrationForm.css' // importe o CSS atualizado

export default function RegistrationForm() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    unit: '',
    plan: '',
    frequency: '',
    name: '',
    phone: '',
    email: '',
    birthdate: '',
    address: '',
    neighborhood: '',
    city: '',
    state: '',
    zipcode: '',
    healthIssue: '',
    otherHealthDescription: '',
    trainingGoal: '',
    paymentMethod: ''
  })
  const [errors, setErrors] = useState({})
  const [cepLoading, setCepLoading] = useState(false)
  const [summary, setSummary] = useState({ enrollment: 0, monthly: 0, total: 0 })
  const [showFeaturesFor, setShowFeaturesFor] = useState(null)

  // Planos com valores e benefícios (baseado no HTML fornecido)
  const plans = {
    individual: {
      name: 'Plano Individual',
      variants: {
        '3dias': { enrollment: 70, monthly: 60 },
        'todos': { enrollment: 80, monthly: 70 }
      },
      features: [
        'Escolha entre 3 dias ou todos os dias',
        'Acesso às 2 academias',
        'Acesso ao AbdalaQRmachine',
        'Segunda a sexta, sábados e feriados',
        'Equipamentos diversos',
        'Personals trainers qualificados',
        'Acompanhamento premium'
      ]
    },
    bimestral: {
      name: 'Plano Bimestral',
      matricula: 140,
      mensal: 65,
      features: [
        'Desconto para estudantes e militares: R$130',
        'Acesso às 2 academias',
        'Acesso ao AbdalaQRmachine',
        'Segunda a sexta, sábados e feriados',
        'Equipamentos diversos',
        'Personals trainers qualificados',
        'Acompanhamento premium'
      ]
    },
    '2pessoas': {
      name: 'Plano 2 pessoas',
      matricula: 150,
      mensal: 130,
      features: [
        'Desconto especial para duas pessoas',
        'Acesso às 2 academias',
        'Acesso ao AbdalaQRmachine',
        'Segunda a sexta, sábados e feriados',
        'Equipamentos diversos',
        'Personals trainers qualificados',
        'Acompanhamento premium'
      ]
    },
    '3pessoas': {
      name: 'Plano 3 pessoas',
      matricula: 210,
      mensal: 180,
      features: [
        'Desconto especial para três pessoas',
        'Acesso às 2 academias',
        'Acesso ao AbdalaQRmachine',
        'Segunda a sexta, sábados e feriados',
        'Equipamentos diversos',
        'Personals trainers qualificados',
        'Acompanhamento premium'
      ]
    },
    '4pessoas': {
      name: 'Plano 4 pessoas',
      matricula: 280,
      mensal: 240,
      features: [
        'Desconto especial para quatro pessoas',
        'Acesso às 2 academias',
        'Acesso ao AbdalaQRmachine',
        'Segunda a sexta, sábados e feriados',
        'Equipamentos diversos',
        'Personals trainers qualificados',
        'Acompanhamento premium'
      ]
    },
    '5pessoas': {
      name: 'Plano 5 pessoas',
      matricula: 350,
      mensal: 320,
      features: [
        'Desconto especial para cinco pessoas',
        'Acesso às 2 academias',
        'Acesso ao AbdalaQRmachine',
        'Segunda a sexta, sábados e feriados',
        'Equipamentos diversos',
        'Personals trainers qualificados',
        'Acompanhamento premium'
      ]
    },
    trimestral: {
      name: 'Plano Trimestral',
      total: 190,
      features: [
        'Pagamento único para 3 meses',
        'Desconto especial',
        'Acesso às 2 academias',
        'Acesso ao AbdalaQRmachine',
        'Segunda a sexta, sábados e feriados',
        'Equipamentos diversos',
        'Personals trainers qualificados',
        'Acompanhamento premium'
      ]
    },
    semestral: {
      name: 'Plano Semestral',
      total: 350,
      features: [
        'Pagamento único para 6 meses',
        'Desconto especial',
        'Acesso às 2 academias',
        'Acesso ao AbdalaQRmachine',
        'Segunda a sexta, sábados e feriados',
        'Equipamentos diversos',
        'Personals trainers qualificados',
        'Acompanhamento premium'
      ]
    },
    anual: {
      name: 'Plano Anual',
      total: 500,
      features: [
        'Pagamento único para 12 meses',
        'Maior desconto disponível',
        'Acesso às 2 academias',
        'Acesso ao AbdalaQRmachine',
        'Segunda a sexta, sábados e feriados',
        'Equipamentos diversos',
        'Personals trainers qualificados',
        'Acompanhamento premium'
      ]
    }
  }

  // Detectar parâmetro ?plan= na URL e pré-selecionar
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const planParam = params.get('plan')
    if (planParam && plans[planParam]) {
      setForm(prev => ({ ...prev, plan: planParam }))
      setStep(2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Atualizar resumo quando plano ou frequência mudar
  useEffect(() => {
    if (form.plan && plans[form.plan]) {
      const selectedPlan = plans[form.plan]
      if (selectedPlan.variants && form.frequency) {
        const variant = selectedPlan.variants[form.frequency]
        setSummary({
          enrollment: variant.enrollment,
          monthly: variant.monthly,
          total: (variant.enrollment || 0) + (variant.monthly || 0)
        })
      } else if (selectedPlan.total) {
        setSummary({
          enrollment: selectedPlan.enrollment || 0,
          monthly: selectedPlan.monthly || 0,
          total: selectedPlan.total
        })
      } else {
        // plans with matricula + mensal
        setSummary({
          enrollment: selectedPlan.matricula || 0,
          monthly: selectedPlan.mensal || 0,
          total: (selectedPlan.matricula || 0) + (selectedPlan.mensal || 0)
        })
      }
    } else {
      setSummary({ enrollment: 0, monthly: 0, total: 0 })
    }
  }, [form.plan, form.frequency])

  function handleChange(e) {
    const { id, value } = e.target
    setForm(prev => ({ ...prev, [id]: value }))
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: '' }))
  }

  function validateStep() {
    const newErrors = {}

    if (step === 1 && !form.unit) newErrors.unit = 'Selecione uma unidade'
    if (step === 2) {
      if (!form.plan) newErrors.plan = 'Selecione um plano'
      if (plans[form.plan]?.variants && !form.frequency) {
        newErrors.frequency = 'Selecione a frequência'
      }
    }
    if (step === 3) {
      if (!form.name) newErrors.name = 'Nome obrigatório'
      if (!form.phone) newErrors.phone = 'Telefone obrigatório'
      if (!form.email) newErrors.email = 'Email obrigatório'
      if (!form.birthdate) newErrors.birthdate = 'Data de nascimento obrigatória'
      if (!form.zipcode) newErrors.zipcode = 'CEP obrigatório'
      if (!form.address) newErrors.address = 'Endereço obrigatório'
      if (!form.city) newErrors.city = 'Cidade obrigatória'
      if (!form.state) newErrors.state = 'Estado obrigatório'
    }
    if (step === 4 && !form.healthIssue) newErrors.healthIssue = 'Selecione uma opção'
    if (step === 5 && !form.trainingGoal) newErrors.trainingGoal = 'Selecione um objetivo'
    if (step === 6 && !form.paymentMethod) newErrors.paymentMethod = 'Selecione forma de pagamento'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function next() {
    if (validateStep()) {
      setStep(s => Math.min(6, s + 1))
    }
  }

  function prev() {
    setStep(s => Math.max(1, s - 1))
  }

  async function fetchAddress() {
    const cepRaw = (form.zipcode || '').replace(/\D/g, '')
    if (cepRaw.length !== 8) {
      setErrors(prev => ({ ...prev, zipcode: 'CEP deve ter 8 dígitos' }))
      return
    }

    setCepLoading(true)
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepRaw}/json/`)
      const data = await response.json()

      if (data.erro) {
        setErrors(prev => ({ ...prev, zipcode: 'CEP não encontrado' }))
      } else {
        setForm(prev => ({
          ...prev,
          address: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || ''
        }))
        setErrors(prev => ({ ...prev, zipcode: '' }))
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, zipcode: 'Erro ao buscar CEP' }))
    } finally {
      setCepLoading(false)
    }
  }

  function submit(e) {
    e.preventDefault()
    if (!validateStep()) return

    const formData = {
      ...form,
      summary,
      submittedAt: new Date().toISOString()
    }

    console.log('Dados do cadastro:', formData)
    alert('Cadastro enviado com sucesso!')

    // Se usar react-router: navigate('/obrigado')
    console.log('Redirecionar para: /obrigado')
  }

  function selectPlan(key) {
    setForm(prev => ({ ...prev, plan: key, frequency: '' }))
    setShowFeaturesFor(key)
  }

  function formatBRL(v) {
    if (v == null || Number.isNaN(v)) return '-'
    return `R$ ${Number(v).toFixed(2)}`
  }

  return (
    <div className="registration-container white-bg">
      <div className="step-indicator" role="navigation" aria-label="Progresso do formulário">
        {[1, 2, 3, 4, 5, 6].map(s => (
          <div
            key={s}
            className={`step-item ${s === step ? 'active' : ''} ${s < step ? 'completed' : ''}`}
            aria-current={s === step ? 'step' : undefined}
          >
            <span className="step-number">{s}</span>
            <span className="step-label">
              {s === 1 && 'Unidade'}
              {s === 2 && 'Plano'}
              {s === 3 && 'Dados'}
              {s === 4 && 'Saúde'}
              {s === 5 && 'Objetivo'}
              {s === 6 && 'Pagamento'}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="registration-form" noValidate>
        {step === 1 && (
          <div className="form-step">
            <h2>Escolha da Unidade</h2>
            <div className="form-group">
              <label htmlFor="unit">Selecione a unidade *</label>
              <select
                id="unit"
                value={form.unit}
                onChange={handleChange}
                className={errors.unit ? 'error' : ''}
                aria-required="true"
                aria-invalid={!!errors.unit}
              >
                <option value="">Selecione...</option>
                <option value="cuites">Abdala Club Academia Cuítes</option>
                <option value="palmeira">Abdala Club Academia Palmeira</option>
              </select>
              {errors.unit && <span className="error-message" role="alert">{errors.unit}</span>}
            </div>
            <div className="form-navigation">
              <button type="button" onClick={next} className="btn btn-next">
                Avançar
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <h2>Escolha seu Plano</h2>
            <p className="section-description">Selecione o plano que melhor atende às suas necessidades</p>

            <div className="plans-grid">
              {Object.entries(plans).map(([key, plan]) => (
                <div
                  key={key}
                  className={`plan-card ${form.plan === key ? 'selected' : ''} ${key === 'trimestral' || key === 'semestral' || key === 'anual' ? 'highlight-plan' : ''}`}
                  onClick={() => selectPlan(key)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') selectPlan(key)
                  }}
                >
                  <div className="plan-header">
                    <h3>{plan.name}</h3>
                    <div className="plan-price">
                      {plan.total ? (
                        <span>{formatBRL(plan.total)}</span>
                      ) : plan.variants ? (
                        <span>A partir de {formatBRL(Math.min(...Object.values(plan.variants).map(v => v.monthly)))}/mês</span>
                      ) : (
                        <span>Mensal: {formatBRL(plan.mensal)}</span>
                      )}
                      {plan.matricula && <div className="monthly-price">Matrícula: {formatBRL(plan.matricula)}</div>}
                      {plan.total == null && plan.mensal == null && plan.variants == null && <div className="monthly-price">Consulte</div>}
                    </div>
                  </div>

                  <div className="plan-features">
                    <div className="plan-description">{plan.features?.[0] || ''}</div>

                    <div className="benefits-toggle" onClick={(e) => { e.stopPropagation(); setShowFeaturesFor(showFeaturesFor === key ? null : key) }} role="button" tabIndex={0}>
                      <span>Ver benefícios</span>
                      <i className={`fas ${showFeaturesFor === key ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
                    </div>

                    <ul className={`benefits-list ${showFeaturesFor === key ? 'active' : ''}`}>
                      {plan.features && plan.features.map((f, idx) => (
                        <li key={idx}><i className="fas fa-check-circle" />{f}</li>
                      ))}
                    </ul>

                    <div style={{ marginTop: 'auto' }}>
                      <button className="btn plan-choose-btn" type="button" onClick={(e) => { e.stopPropagation(); selectPlan(key) }}>
                        Escolher plano
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {form.plan && plans[form.plan]?.variants && (
              <div className="form-group frequency-selection">
                <label>Frequência semanal *</label>
                <div className="radio-group frequency-options">
                  <label>
                    <input
                      type="radio"
                      name="frequency"
                      value="3dias"
                      checked={form.frequency === '3dias'}
                      onChange={(e) => setForm(prev => ({ ...prev, frequency: e.target.value }))}
                    />
                    3 dias por semana
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="frequency"
                      value="todos"
                      checked={form.frequency === 'todos'}
                      onChange={(e) => setForm(prev => ({ ...prev, frequency: e.target.value }))}
                    />
                    Todos os dias
                  </label>
                </div>
                {errors.frequency && <span className="error-message" role="alert">{errors.frequency}</span>}
              </div>
            )}

            {((form.plan && !plans[form.plan]?.variants) || (form.plan && form.frequency)) && (
              <div className="summary-box">
                <h4>Resumo</h4>
                {summary.enrollment > 0 && <p>Matrícula: {formatBRL(summary.enrollment)}</p>}
                {summary.monthly > 0 && <p>Mensalidade: {formatBRL(summary.monthly)}</p>}
                <p className="total">Total: {formatBRL(summary.total)}</p>
              </div>
            )}

            {errors.plan && <span className="error-message" role="alert">{errors.plan}</span>}

            <div className="form-navigation">
              <button type="button" onClick={prev} className="btn btn-prev">Voltar</button>
              <button type="button" onClick={next} className="btn btn-next">Avançar</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step">
            <h2>Informações Pessoais</h2>

            <div className="form-group">
              <label htmlFor="name">Nome completo *</label>
              <input id="name" value={form.name} onChange={handleChange} placeholder="Seu nome completo" className={errors.name ? 'error' : ''} aria-required="true" aria-invalid={!!errors.name} />
              {errors.name && <span className="error-message" role="alert">{errors.name}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Telefone *</label>
                <input id="phone" value={form.phone} onChange={handleChange} placeholder="(99) 99999-9999" className={errors.phone ? 'error' : ''} aria-required="true" />
                {errors.phone && <span className="error-message" role="alert">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="birthdate">Data de nascimento *</label>
                <input id="birthdate" type="date" value={form.birthdate} onChange={handleChange} className={errors.birthdate ? 'error' : ''} aria-required="true" />
                {errors.birthdate && <span className="error-message" role="alert">{errors.birthdate}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input id="email" type="email" value={form.email} onChange={handleChange} placeholder="seu@email.com" className={errors.email ? 'error' : ''} aria-required="true" />
              {errors.email && <span className="error-message" role="alert">{errors.email}</span>}
            </div>

            <div className="form-group cep-group">
              <label htmlFor="zipcode">CEP *</label>
              <div className="cep-input-wrapper">
                <input id="zipcode" value={form.zipcode} onChange={handleChange} placeholder="00000-000" className={errors.zipcode ? 'error' : ''} aria-required="true" />
                <button type="button" onClick={fetchAddress} className="btn btn-cep" disabled={cepLoading}>{cepLoading ? 'Buscando...' : 'Validar CEP'}</button>
              </div>
              {errors.zipcode && <span className="error-message" role="alert">{errors.zipcode}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="address">Endereço *</label>
              <input id="address" value={form.address} onChange={handleChange} placeholder="Rua, Avenida, etc" className={errors.address ? 'error' : ''} aria-required="true" />
              {errors.address && <span className="error-message" role="alert">{errors.address}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="neighborhood">Bairro</label>
              <input id="neighborhood" value={form.neighborhood} onChange={handleChange} placeholder="Bairro" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">Cidade *</label>
                <input id="city" value={form.city} onChange={handleChange} placeholder="Cidade" className={errors.city ? 'error' : ''} aria-required="true" />
                {errors.city && <span className="error-message" role="alert">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="state">Estado *</label>
                <input id="state" value={form.state} onChange={handleChange} placeholder="UF" maxLength="2" className={errors.state ? 'error' : ''} aria-required="true" />
                {errors.state && <span className="error-message" role="alert">{errors.state}</span>}
              </div>
            </div>

            <div className="form-navigation">
              <button type="button" onClick={prev} className="btn btn-prev">Voltar</button>
              <button type="button" onClick={next} className="btn btn-next">Avançar</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="form-step">
            <h2>Problemas de Saúde</h2>
            <div className="form-group">
              <label>Você possui algum problema de saúde? *</label>
              <div className="radio-group">
                {['Nenhum', 'Cardíaco', 'Respiratório', 'Articular', 'Outro'].map(opt => (
                  <label key={opt}>
                    <input type="radio" name="health" value={opt} checked={form.healthIssue === opt} onChange={(e) => setForm(prev => ({ ...prev, healthIssue: e.target.value }))} />
                    {opt === 'Nenhum' ? 'Não, sou saudável' : (opt === 'Outro' ? 'Outro' : `Problemas ${opt.toLowerCase()}`)}
                  </label>
                ))}
              </div>
              {errors.healthIssue && <span className="error-message" role="alert">{errors.healthIssue}</span>}
            </div>

            {form.healthIssue === 'Outro' && (
              <div className="form-group">
                <label htmlFor="otherHealthDescription">Descreva seu problema de saúde</label>
                <textarea id="otherHealthDescription" value={form.otherHealthDescription} onChange={handleChange} placeholder="Descreva aqui..." rows="3" />
              </div>
            )}

            <div className="form-navigation">
              <button type="button" onClick={prev} className="btn btn-prev">Voltar</button>
              <button type="button" onClick={next} className="btn btn-next">Avançar</button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="form-step">
            <h2>Objetivo de Treino</h2>
            <div className="form-group">
              <label>Qual seu principal objetivo? *</label>
              <div className="radio-group">
                {[
                  { v: 'Perda de peso', t: 'Perda de peso' },
                  { v: 'Ganho de massa', t: 'Ganho de massa muscular' },
                  { v: 'Condicionamento', t: 'Condicionamento físico' },
                  { v: 'Saúde', t: 'Melhorar saúde geral' }
                ].map(o => (
                  <label key={o.v}>
                    <input type="radio" name="goal" value={o.v} checked={form.trainingGoal === o.v} onChange={(e) => setForm(prev => ({ ...prev, trainingGoal: e.target.value }))} />
                    {o.t}
                  </label>
                ))}
              </div>
              {errors.trainingGoal && <span className="error-message" role="alert">{errors.trainingGoal}</span>}
            </div>

            <div className="form-navigation">
              <button type="button" onClick={prev} className="btn btn-prev">Voltar</button>
              <button type="button" onClick={next} className="btn btn-next">Avançar</button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="form-step">
            <h2>Forma de Pagamento</h2>
            <div className="form-group">
              <label>Escolha a forma de pagamento *</label>
              <div className="radio-group">
                {['Cartão de crédito', 'Cartão de débito', 'PIX', 'Boleto'].map(opt => (
                  <label key={opt}>
                    <input type="radio" name="payment" value={opt} checked={form.paymentMethod === opt} onChange={(e) => setForm(prev => ({ ...prev, paymentMethod: e.target.value }))} />
                    {opt}
                  </label>
                ))}
              </div>
              {errors.paymentMethod && <span className="error-message" role="alert">{errors.paymentMethod}</span>}
            </div>

            <div className="summary-box final-summary">
              <h3>Resumo do Pedido</h3>
              <p><strong>Unidade:</strong> {form.unit === 'cuites' ? 'Cuítes' : form.unit === 'palmeira' ? 'Palmeira' : '-'}</p>
              <p><strong>Plano:</strong> {plans[form.plan]?.name || '-'}</p>
              {form.frequency && <p><strong>Frequência:</strong> {form.frequency === '3dias' ? '3 dias/semana' : 'Todos os dias'}</p>}
              {summary.enrollment > 0 && <p>Matrícula: {formatBRL(summary.enrollment)}</p>}
              {summary.monthly > 0 && <p>Mensalidade: {formatBRL(summary.monthly)}</p>}
              <p className="total"><strong>Total: {formatBRL(summary.total)}</strong></p>
            </div>

            <div className="form-navigation">
              <button type="button" onClick={prev} className="btn btn-prev">Voltar</button>
              <button type="submit" className="btn btn-submit">Finalizar Cadastro</button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
