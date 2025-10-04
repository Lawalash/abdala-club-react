import React, { useState } from 'react'

export default function RegistrationForm(){
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    unit: '', plan: '', name: '', phone:'', email:'', birthdate:'', address:'', city:'', state:'', zipcode:'', healthIssue:'', otherHealthDescription:'', trainingGoal:'', paymentMethod:''
  })

  function handleChange(e){ setForm({...form, [e.target.id]: e.target.value}) }
  function next(){ setStep(s => Math.min(6, s+1)) }
  function prev(){ setStep(s => Math.max(1, s-1)) }
  function submit(e){ e.preventDefault(); console.log('Enviar cadastro:', form); alert('Cadastro enviado (simulação)') }

  return (
    <form onSubmit={submit} id="registrationForm" className="registration-form">
      {step === 1 && (
        <div className="form-step">
          <h4>Escolha da Unidade</h4>
          <select id="unit" value={form.unit} onChange={handleChange} required>
            <option value="">Selecione a unidade</option>
            <option value="centro">Abdala Club Academia Cuítes</option>
            <option value="norte">Abdala Club Academia Palmeira</option>
          </select>
          <div className="form-navigation">
            <button type="button" onClick={next} className="btn btn-next">Avançar</button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="form-step">
          <h4>Escolha seu Plano</h4>
          {/* aqui você poderia mapear cards iguais ao componente Plans e setar form.plan */}
          <div className="form-navigation">
            <button type="button" onClick={prev} className="btn btn-prev">Voltar</button>
            <button type="button" onClick={next} className="btn btn-next">Avançar</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="form-step">
          <h4>Informações Pessoais</h4>
          <input id="name" value={form.name} onChange={handleChange} placeholder="Nome completo" required />
          <input id="phone" value={form.phone} onChange={handleChange} placeholder="(99) 99999-9999" required />
          <input id="email" value={form.email} onChange={handleChange} type="email" placeholder="email" required />
          <input id="birthdate" value={form.birthdate} onChange={handleChange} type="date" required />
          <div className="form-navigation">
            <button type="button" onClick={prev} className="btn btn-prev">Voltar</button>
            <button type="button" onClick={next} className="btn btn-next">Avançar</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="form-step">
          <h4>Problemas de Saúde</h4>
          <label><input type="radio" name="health" value="Nenhum" onChange={e => setForm({...form, healthIssue: e.target.value})}/> Não, saudável</label>
          <label><input type="radio" name="health" value="Cardíaco" onChange={e => setForm({...form, healthIssue: e.target.value})}/> Problemas cardíacos</label>
          <div className="form-navigation">
            <button type="button" onClick={prev} className="btn btn-prev">Voltar</button>
            <button type="button" onClick={next} className="btn btn-next">Avançar</button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="form-step">
          <h4>Objetivo de Treino</h4>
          <label><input type="radio" name="goal" value="Perda de peso" onChange={e => setForm({...form, trainingGoal: e.target.value})} /> Perda de peso</label>
          <div className="form-navigation">
            <button type="button" onClick={prev} className="btn btn-prev">Voltar</button>
            <button type="button" onClick={next} className="btn btn-next">Avançar</button>
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="form-step">
          <h4>Forma de Pagamento</h4>
          <label><input type="radio" name="payment" value="Cartão" onChange={e => setForm({...form, paymentMethod: e.target.value})} /> Cartão</label>
          <div className="form-navigation">
            <button type="button" onClick={prev} className="btn btn-prev">Voltar</button>
            <button type="submit" className="btn btn-submit">Enviar Cadastro</button>
          </div>
        </div>
      )}
    </form>
  )
}
