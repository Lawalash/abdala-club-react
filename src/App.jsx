// src/App.jsx
import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

// caminhos corrigidos — apontando para o arquivo dentro da pasta
import HomePage from './pages/HomePage/HomePage'
import AcademiasPage from './pages/AcademiasPage/AcademiasPage'
import CadastroPage from './pages/CadastroPage/CadastroPage'
import Header from './components/Header/Header'
import Sidebar from './components/Sidebar/Sidebar'
import Footer from './components/Footer/Footer'
import WhatsappButton from './components/WhatsappButton/WhatsappButton'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <Header onToggleSidebar={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/academias" element={<AcademiasPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
        </Routes>
      </main>
      <Footer />
      <WhatsappButton />
    </>
  )
}
