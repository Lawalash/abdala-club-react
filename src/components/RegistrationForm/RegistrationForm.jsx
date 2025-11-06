import React, { useCallback, useEffect, useMemo, useState } from 'react'
import './RegistrationForm.css'

const STEP_LABELS = ['Unidade', 'Plano', 'Dados', 'Saúde', 'Objetivo', 'Pagamento']

const PLAN_CONFIG = {
  individual: {
    name: 'Plano Individual',
    variants: {
      '3dias': { enrollment: 70, monthly: 60 },
      todos: { enrollment: 80, monthly: 70 }
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

const HEALTH_OPTIONS = [
  { value: 'Nenhum', label: 'Não, sou saudável' },
  { value: 'Cardíaco', label: 'Problemas cardíacos' },
  { value: 'Respiratório', label: 'Problemas respiratórios' },
  { value: 'Articular', label: 'Problemas articulares' },
  { value: 'Outro', label: 'Outro' }
]

const TRAINING_GOALS = [
  { value: 'Perda de peso', label: 'Perda de peso' },
  { value: 'Ganho de massa', label: 'Ganho de massa muscular' },
  { value: 'Condicionamento', label: 'Condicionamento físico' },
  { value: 'Saúde', label: 'Melhorar saúde geral' }
]

const PAYMENT_METHODS = ['Cartão de crédito', 'Cartão de débito', 'PIX', 'Boleto']

const HIGHLIGHTED_PLANS = new Set(['trimestral', 'semestral', 'anual'])

const DEFAULT_SUMMARY = { enrollment: 0, monthly: 0, total: 0 }

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
})

const formatBRL = value => {
  if (value == null || Number.isNaN(value)) return '-'
  return currencyFormatter.format(Number(value))
}

const formatPhoneNumber = (value = '') => {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (digits.length === 0) return ''
  if (digits.length < 2) return `(${digits}`

  const ddd = digits.slice(0, 2)
  const localNumber = digits.slice(2)

  if (digits.length === 2) {
    return `(${ddd}) `
  }

  if (localNumber.length <= 4) {
    return `(${ddd}) ${localNumber}`
  }

  const prefix = localNumber.slice(0, localNumber.length - 4)
  const suffix = localNumber.slice(-4)
  return `(${ddd}) ${prefix}-${suffix}`
}

const formatZipcode = (value = '') => {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

const formatDateToBR = (value = '') => {
  if (!value) return '-'
  const [year, month, day] = value.split('-')
  if (!year || !month || !day) return value
  return `${day}/${month}/${year}`
}

export default function RegistrationForm() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(() => ({
    unit: '',
    plan: '',
    frequency: '',
    name: '',
    phone: '',
    email: '',
    birthdate: '',
    address: '',
    addressNumber: '',
    neighborhood: '',
    city: '',
    state: '',
    zipcode: '',
    healthIssue: '',
    otherHealthDescription: '',
    trainingGoal: '',
    paymentMethod: ''
  }))
  const [errors, setErrors] = useState({})
  const [cepLoading, setCepLoading] = useState(false)
  const [showFeaturesFor, setShowFeaturesFor] = useState(null)

  const totalSteps = STEP_LABELS.length
  const progress = (step / totalSteps) * 100

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const planParam = params.get('plan')
    if (planParam && PLAN_CONFIG[planParam]) {
      setForm(prev => ({ ...prev, plan: planParam }))
      setStep(2)
      setShowFeaturesFor(planParam)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [step])

  const summary = useMemo(() => {
    const selectedPlan = PLAN_CONFIG[form.plan]
    if (!selectedPlan) return DEFAULT_SUMMARY

    if (selectedPlan.variants) {
      if (!form.frequency) return DEFAULT_SUMMARY
      const variant = selectedPlan.variants[form.frequency]
      if (!variant) return DEFAULT_SUMMARY
      const enrollment = variant.enrollment ?? 0
      const monthly = variant.monthly ?? 0
      return {
        enrollment,
        monthly,
        total: enrollment + monthly
      }
    }

    if (selectedPlan.total != null) {
      return {
        enrollment: selectedPlan.enrollment ?? 0,
        monthly: selectedPlan.monthly ?? 0,
        total: selectedPlan.total
      }
    }

    const enrollment = selectedPlan.matricula ?? 0
    const monthly = selectedPlan.mensal ?? 0
    return {
      enrollment,
      monthly,
      total: enrollment + monthly
    }
  }, [form.frequency, form.plan])

  const handleChange = useCallback((event) => {
    const { id, name, value } = event.target
    const field = name || id

    let nextValue = value

    if (field === 'phone') {
      nextValue = formatPhoneNumber(value)
    } else if (field === 'zipcode') {
      nextValue = formatZipcode(value)
    } else if (field === 'state') {
      nextValue = value.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 2)
    }

    setForm(prev => ({ ...prev, [field]: nextValue }))
    setErrors(prev => {
      if (!prev[field]) return prev
      const { [field]: _removed, ...rest } = prev
      return rest
    })
  }, [])

  const validateStep = useCallback(() => {
    const newErrors = {}

    switch (step) {
      case 1:
        if (!form.unit) newErrors.unit = 'Selecione uma unidade'
        break
      case 2: {
        if (!form.plan) {
          newErrors.plan = 'Selecione um plano'
          break
        }
        const selectedPlan = PLAN_CONFIG[form.plan]
        if (selectedPlan?.variants && !form.frequency) {
          newErrors.frequency = 'Selecione a frequência'
        }
        break
      }
      case 3: {
        if (!form.name.trim()) newErrors.name = 'Nome obrigatório'
        if (!form.phone.trim()) newErrors.phone = 'Telefone obrigatório'
        if (!form.email.trim()) {
          newErrors.email = 'Email obrigatório'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
          newErrors.email = 'Informe um email válido'
        }
        if (!form.birthdate) newErrors.birthdate = 'Data de nascimento obrigatória'
        if (!form.zipcode.trim()) {
          newErrors.zipcode = 'CEP obrigatório'
        } else if (form.zipcode.replace(/\D/g, '').length !== 8) {
          newErrors.zipcode = 'CEP deve ter 8 dígitos'
        }
        if (!form.address.trim()) newErrors.address = 'Endereço obrigatório'
        if (!form.city.trim()) newErrors.city = 'Cidade obrigatória'
        if (!form.state.trim()) newErrors.state = 'Estado obrigatório'
        break
      }
      case 4:
        if (!form.healthIssue) newErrors.healthIssue = 'Selecione uma opção'
        break
      case 5:
        if (!form.trainingGoal) newErrors.trainingGoal = 'Selecione um objetivo'
        break
      case 6:
        if (!form.paymentMethod) newErrors.paymentMethod = 'Selecione forma de pagamento'
        break
      default:
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [form, step])

  const goToNextStep = useCallback(() => {
    if (validateStep()) {
      setStep(prev => Math.min(totalSteps, prev + 1))
    }
  }, [totalSteps, validateStep])

  const goToPreviousStep = useCallback(() => {
    setStep(prev => Math.max(1, prev - 1))
  }, [])

  const handleFetchAddress = useCallback(async () => {
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
        return
      }

      setForm(prev => ({
        ...prev,
        address: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || ''
      }))
      setErrors(prev => {
        const { zipcode: _ignored, ...rest } = prev
        return rest
      })
    } catch (error) {
      setErrors(prev => ({ ...prev, zipcode: 'Erro ao buscar CEP' }))
    } finally {
      setCepLoading(false)
    }
  }, [form.zipcode])

  const selectedPlan = PLAN_CONFIG[form.plan]
  const planHasVariants = !!selectedPlan?.variants

  const whatsappInfo = useMemo(() => {
    const unitLabel = form.unit === 'cuites'
      ? 'Abdala Club Academia Cuítes'
      : form.unit === 'palmeira'
        ? 'Abdala Club Academia Palmeira'
        : '-'
    const frequencyLabel = form.frequency === '3dias'
      ? '3 dias por semana'
      : form.frequency === 'todos'
        ? 'Todos os dias'
        : ''
    const healthLabel = form.healthIssue || '-'
    const paymentLabel = form.paymentMethod || '-'
    const addressLine = [
      form.address,
      form.addressNumber && `nº ${form.addressNumber}`,
      form.neighborhood
    ].filter(Boolean).join(', ')
    const locationLine = [form.city, form.state].filter(Boolean).join(' - ')

    const messageLines = [
      'Olá! Gostaria de finalizar meu cadastro no Abdala Club.',
      '',
      `Unidade: ${unitLabel}`,
      `Plano: ${selectedPlan?.name || '-'}`,
      frequencyLabel ? `Frequência: ${frequencyLabel}` : null,
      `Matrícula: ${formatBRL(summary.enrollment)}`,
      `Mensalidade: ${formatBRL(summary.monthly)}`,
      `Total: ${formatBRL(summary.total)}`,
      '',
      `Nome: ${form.name}`,
      `Telefone: ${form.phone}`,
      `Email: ${form.email}`,
      `Data de nascimento: ${formatDateToBR(form.birthdate)}`,
      `Endereço: ${addressLine || '-'}`,
      `Cidade/Estado: ${locationLine || '-'}`,
      '',
      `Condição de saúde: ${healthLabel}`,
      form.healthIssue === 'Outro' && form.otherHealthDescription
        ? `Detalhes de saúde: ${form.otherHealthDescription}`
        : null,
      `Objetivo de treino: ${form.trainingGoal || '-'}`,
      `Forma de pagamento: ${paymentLabel}`,
      '',
      'Podem me ajudar com os próximos passos? Obrigado!'
    ].filter(Boolean)

    return {
      unitLabel,
      frequencyLabel,
      healthLabel,
      paymentLabel,
      addressLine,
      locationLine,
      messageLines,
      messageText: messageLines.join('\n')
    }
  }, [form, selectedPlan, summary])

  const handleSubmit = useCallback((event) => {
    event.preventDefault()
    if (!validateStep()) return

    const formData = {
      ...form,
      summary,
      submittedAt: new Date().toISOString()
    }

    const whatsappNumber = '5583993725984'
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappInfo.messageText)}`

    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    }

    console.log('Dados do cadastro:', formData)
  }, [form, summary, validateStep, whatsappInfo.messageText])

  const selectPlan = useCallback((key) => {
    setForm(prev => ({ ...prev, plan: key, frequency: '' }))
    setShowFeaturesFor(key)
    setErrors(prev => {
      const { plan: _plan, frequency: _frequency, ...rest } = prev
      return rest
    })
  }, [])

  const togglePlanFeatures = useCallback((key) => {
    setShowFeaturesFor(prev => (prev === key ? null : key))
  }, [])

  return (
    <div className="registration-container white-bg">
      <div className="step-indicator" role="navigation" aria-label="Progresso do formulário">
        <div className="step-progress" aria-hidden="true">
          <div className="step-progress-bar" style={{ width: `${progress}%` }} />
        </div>
        {STEP_LABELS.map((label, index) => {
          const stepNumber = index + 1
          return (
            <div
              key={label}
              className={`step-item ${stepNumber === step ? 'active' : ''} ${stepNumber < step ? 'completed' : ''}`}
              aria-current={stepNumber === step ? 'step' : undefined}
            >
              <span className="step-number">{stepNumber}</span>
              <span className="step-label">{label}</span>
            </div>
          )
        })}
      </div>

      <form onSubmit={handleSubmit} className="registration-form" noValidate>
        {step === 1 && (
          <div className="form-step">
            <h2>Escolha da Unidade</h2>
            <p className="section-description">Selecione a unidade onde deseja treinar</p>
            <div className="form-group">
              <label htmlFor="unit">Selecione a unidade *</label>
              <select
                id="unit"
                name="unit"
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
            <div className="form-navigation single-action">
              <button type="button" onClick={goToNextStep} className="btn btn-next">
                Avançar
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <h2>Escolha seu Plano</h2>
            <p className="section-description">Selecione o plano que melhor atende às suas necessidades</p>

            <div className="registration-plans-grid">
              {Object.entries(PLAN_CONFIG).map(([key, plan]) => {
                const variantValues = plan.variants ? Object.values(plan.variants) : []
                const lowestMonthly = variantValues.length
                  ? Math.min(...variantValues.map(variant => variant.monthly ?? 0))
                  : null
                return (
                  <article
                    key={key}
                    className={`registration-plan-card ${
                      form.plan === key ? 'registration-plan-card--selected' : ''
                    } ${HIGHLIGHTED_PLANS.has(key) ? 'registration-plan-card--highlight' : ''}`}
                    onClick={() => selectPlan(key)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        selectPlan(key)
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={form.plan === key}
                  >
                    <header className="registration-plan-card__header">
                      <span className="registration-plan-card__pill">{plan.total ? 'Pagamento único' : 'Assinatura'}</span>
                      <h3>{plan.name}</h3>
                      <div className="registration-plan-card__price">
                        {plan.total ? (
                          <span>{formatBRL(plan.total)}</span>
                        ) : plan.variants ? (
                          <span>A partir de {formatBRL(lowestMonthly)}/mês</span>
                        ) : (
                          <span>{formatBRL(plan.mensal)}/mês</span>
                        )}
                        {plan.matricula && (
                          <div className="registration-plan-card__monthly">Matrícula: {formatBRL(plan.matricula)}</div>
                        )}
                      </div>
                    </header>

                    <p className="registration-plan-card__description">{plan.features?.[0] || ''}</p>

                    <button
                      type="button"
                      className="registration-plan-card__benefits-toggle"
                      onClick={(event) => {
                        event.stopPropagation()
                        togglePlanFeatures(key)
                      }}
                      aria-expanded={showFeaturesFor === key}
                    >
                      <span>Ver benefícios</span>
                      <i className={`fas ${showFeaturesFor === key ? 'fa-chevron-up' : 'fa-chevron-down'}`} aria-hidden="true" />
                    </button>

                    <ul
                      className={`registration-plan-card__benefits-list ${
                        showFeaturesFor === key ? 'is-active' : ''
                      }`}
                    >
                      {plan.features?.map((feature, index) => (
                        <li key={feature + index}>
                          <i className="fas fa-check-circle" aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      className="btn registration-plan-card__cta"
                      onClick={(event) => {
                        event.stopPropagation()
                        selectPlan(key)
                      }}
                    >
                      Escolher plano
                    </button>
                  </article>
                )
              })}
            </div>

            {planHasVariants && (
              <div className="form-group frequency-selection">
                <label>Frequência semanal *</label>
                <div className="radio-group frequency-options">
                  <label>
                    <input
                      type="radio"
                      id="frequency-3dias"
                      name="frequency"
                      value="3dias"
                      checked={form.frequency === '3dias'}
                      onChange={handleChange}
                    />
                    3 dias por semana
                  </label>
                  <label>
                    <input
                      type="radio"
                      id="frequency-todos"
                      name="frequency"
                      value="todos"
                      checked={form.frequency === 'todos'}
                      onChange={handleChange}
                    />
                    Todos os dias
                  </label>
                </div>
                {errors.frequency && <span className="error-message" role="alert">{errors.frequency}</span>}
              </div>
            )}

            {selectedPlan && (!planHasVariants || (planHasVariants && form.frequency)) && (
              <div className="summary-box">
                <h4>Resumo</h4>
                {summary.enrollment > 0 && <p>Matrícula: {formatBRL(summary.enrollment)}</p>}
                {summary.monthly > 0 && <p>Mensalidade: {formatBRL(summary.monthly)}</p>}
                <p className="total">Total: {formatBRL(summary.total)}</p>
              </div>
            )}

            {errors.plan && <span className="error-message" role="alert">{errors.plan}</span>}

            <div className="form-navigation">
              <button type="button" onClick={goToPreviousStep} className="btn btn-prev">
                Voltar
              </button>
              <button type="button" onClick={goToNextStep} className="btn btn-next">
                Avançar
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step">
            <h2>Informações Pessoais</h2>
            <p className="section-description">Preencha seus dados para montarmos seu cadastro</p>

            <div className="form-group">
              <label htmlFor="name">Nome completo *</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Seu nome completo"
                className={errors.name ? 'error' : ''}
                aria-required="true"
                aria-invalid={!!errors.name}
                autoComplete="name"
              />
              {errors.name && <span className="error-message" role="alert">{errors.name}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Telefone *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(99) 99999-9999"
                  className={errors.phone ? 'error' : ''}
                  aria-required="true"
                  autoComplete="tel"
                />
                {errors.phone && <span className="error-message" role="alert">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="birthdate">Data de nascimento *</label>
                <input
                  id="birthdate"
                  name="birthdate"
                  type="date"
                  value={form.birthdate}
                  onChange={handleChange}
                  className={errors.birthdate ? 'error' : ''}
                  aria-required="true"
                  autoComplete="bday"
                />
                {errors.birthdate && <span className="error-message" role="alert">{errors.birthdate}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className={errors.email ? 'error' : ''}
                aria-required="true"
                aria-invalid={!!errors.email}
                autoComplete="email"
              />
              {errors.email && <span className="error-message" role="alert">{errors.email}</span>}
            </div>

            <div className="form-group cep-group">
              <label htmlFor="zipcode">CEP *</label>
              <div className="cep-input-wrapper">
                <input
                  id="zipcode"
                  name="zipcode"
                  value={form.zipcode}
                  onChange={handleChange}
                  placeholder="00000-000"
                  className={errors.zipcode ? 'error' : ''}
                  aria-required="true"
                  autoComplete="postal-code"
                />
                <button type="button" onClick={handleFetchAddress} className="btn btn-cep" disabled={cepLoading}>
                  {cepLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin" aria-hidden="true" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search-location" aria-hidden="true" />
                      Buscar endereço
                    </>
                  )}
                </button>
              </div>
              {errors.zipcode && <span className="error-message" role="alert">{errors.zipcode}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="address">Endereço *</label>
              <input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Rua, Avenida, etc"
                className={errors.address ? 'error' : ''}
                aria-required="true"
                autoComplete="address-line1"
              />
              {errors.address && <span className="error-message" role="alert">{errors.address}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="addressNumber">Número</label>
                <input
                  id="addressNumber"
                  name="addressNumber"
                  value={form.addressNumber}
                  onChange={handleChange}
                  placeholder="Número da residência"
                  autoComplete="address-line2"
                />
              </div>

              <div className="form-group">
                <label htmlFor="neighborhood">Bairro</label>
                <input
                  id="neighborhood"
                  name="neighborhood"
                  value={form.neighborhood}
                  onChange={handleChange}
                  placeholder="Bairro"
                  autoComplete="address-line3"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">Cidade *</label>
                <input
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Cidade"
                  className={errors.city ? 'error' : ''}
                  aria-required="true"
                  autoComplete="address-level2"
                />
                {errors.city && <span className="error-message" role="alert">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="state">Estado *</label>
                <input
                  id="state"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="UF"
                  maxLength="2"
                  className={errors.state ? 'error' : ''}
                  aria-required="true"
                  autoComplete="address-level1"
                />
                {errors.state && <span className="error-message" role="alert">{errors.state}</span>}
              </div>
            </div>

            <div className="form-navigation">
              <button type="button" onClick={goToPreviousStep} className="btn btn-prev">
                Voltar
              </button>
              <button type="button" onClick={goToNextStep} className="btn btn-next">
                Avançar
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="form-step form-step--wellness">
            <h2>Problemas de Saúde</h2>
            <p className="section-description">Conte-nos se possui algum ponto de atenção para personalizarmos o treino</p>
            <div className="step-highlight">
              <i className="fas fa-heartbeat" aria-hidden="true" />
              <span>Compartilhe informações importantes para cuidarmos da sua experiência com toda atenção.</span>
            </div>
            <div className="form-group">
              <fieldset>
                <legend>Você possui algum problema de saúde? *</legend>
                <div className="radio-group radio-group--cards">
                  {HEALTH_OPTIONS.map(option => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name="healthIssue"
                        value={option.value}
                        checked={form.healthIssue === option.value}
                        onChange={handleChange}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {errors.healthIssue && <span className="error-message" role="alert">{errors.healthIssue}</span>}
            </div>

            {form.healthIssue === 'Outro' && (
              <div className="form-group">
                <label htmlFor="otherHealthDescription">Descreva seu problema de saúde</label>
                <textarea
                  id="otherHealthDescription"
                  name="otherHealthDescription"
                  value={form.otherHealthDescription}
                  onChange={handleChange}
                  placeholder="Descreva aqui..."
                  rows="3"
                />
              </div>
            )}

            <div className="form-navigation">
              <button type="button" onClick={goToPreviousStep} className="btn btn-prev">
                Voltar
              </button>
              <button type="button" onClick={goToNextStep} className="btn btn-next">
                Avançar
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="form-step form-step--goals">
            <h2>Objetivo de Treino</h2>
            <p className="section-description">Selecione o foco principal do seu treinamento</p>
            <div className="step-highlight">
              <i className="fas fa-bullseye" aria-hidden="true" />
              <span>Conte para a gente qual é o seu objetivo para indicarmos o melhor caminho.</span>
            </div>
            <div className="form-group">
              <fieldset>
                <legend>Qual seu principal objetivo? *</legend>
                <div className="radio-group radio-group--cards">
                  {TRAINING_GOALS.map(option => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name="trainingGoal"
                        value={option.value}
                        checked={form.trainingGoal === option.value}
                        onChange={handleChange}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {errors.trainingGoal && <span className="error-message" role="alert">{errors.trainingGoal}</span>}
            </div>

            <div className="form-navigation">
              <button type="button" onClick={goToPreviousStep} className="btn btn-prev">
                Voltar
              </button>
              <button type="button" onClick={goToNextStep} className="btn btn-next">
                Avançar
              </button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="form-step form-step--checkout">
            <h2>Forma de Pagamento</h2>
            <p className="section-description">Escolha como deseja efetuar o pagamento</p>
            <div className="step-highlight step-highlight--whatsapp">
              <i className="fab fa-whatsapp" aria-hidden="true" />
              <div>
                <strong>Envio direto pelo WhatsApp</strong>
                <span>Seu cadastro será enviado automaticamente para (83) 99372-5984.</span>
              </div>
            </div>
            <div className="form-group">
              <fieldset>
                <legend>Escolha a forma de pagamento *</legend>
                <div className="radio-group radio-group--cards">
                  {PAYMENT_METHODS.map(option => (
                    <label key={option}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={option}
                        checked={form.paymentMethod === option}
                        onChange={handleChange}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {errors.paymentMethod && <span className="error-message" role="alert">{errors.paymentMethod}</span>}
            </div>

            <div className="summary-box final-summary">
              <h3>Resumo do Pedido</h3>
              <p>
                <strong>Unidade:</strong>{' '}
                {form.unit === 'cuites' ? 'Cuítes' : form.unit === 'palmeira' ? 'Palmeira' : '-'}
              </p>
              <p>
                <strong>Plano:</strong> {selectedPlan?.name || '-'}
              </p>
              {form.frequency && (
                <p>
                  <strong>Frequência:</strong> {form.frequency === '3dias' ? '3 dias/semana' : 'Todos os dias'}
                </p>
              )}
              {summary.enrollment > 0 && <p>Matrícula: {formatBRL(summary.enrollment)}</p>}
              {summary.monthly > 0 && <p>Mensalidade: {formatBRL(summary.monthly)}</p>}
              <p className="total">
                <strong>Total: {formatBRL(summary.total)}</strong>
              </p>
            </div>

            <div className="whatsapp-preview" aria-live="polite">
              <div className="whatsapp-preview__header">
                <i className="fab fa-whatsapp" aria-hidden="true" />
                <div>
                  <span>Mensagem para</span>
                  <strong>(83) 99372-5984</strong>
                </div>
              </div>
              <p className="whatsapp-preview__note">Revise abaixo o texto que será enviado para nossa equipe.</p>
              <pre className="whatsapp-preview__message">{whatsappInfo.messageText}</pre>
            </div>

            <div className="form-navigation">
              <button type="button" onClick={goToPreviousStep} className="btn btn-prev">
                Voltar
              </button>
              <button type="submit" className="btn btn-submit">
                Enviar via WhatsApp
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
