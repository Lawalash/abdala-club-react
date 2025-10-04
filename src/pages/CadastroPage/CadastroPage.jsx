import React from 'react'
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm'
import '../CadastroPage/CadastroPage.css'

export default function CadastroPage(){
  return (
    <main>
      <section className="form-section">
        <div className="form-container">
          <RegistrationForm />
        </div>
      </section>
    </main>
  )
}
