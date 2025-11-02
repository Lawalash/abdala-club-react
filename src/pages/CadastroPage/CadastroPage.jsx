import React from 'react'
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm'
import './CadastroPage.css'

export default function CadastroPage() {
  return (
    <div className="cadastro-page">
      <section className="cadastro-hero" aria-labelledby="cadastro-title">
        <div className="cadastro-hero__content">
          <h1 id="cadastro-title">Finalize seu cadastro</h1>
          <p>
            Complete o formulário para escolher a unidade, o plano ideal e garantir sua vaga no Abdala Club.
          </p>
        </div>
      </section>

      <section className="cadastro-form-area" aria-label="Formulário de cadastro">
        <RegistrationForm />
      </section>
    </div>
  )
}
