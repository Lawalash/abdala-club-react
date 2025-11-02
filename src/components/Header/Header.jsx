import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../../assets/logo/logo-teste.png' // ajuste se necessário
import './Header.css'

export default function Header({ onToggleSidebar }) {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)
  const isRegistrationPage = location.pathname.startsWith('/cadastro')

  useEffect(() => {
    if (isRegistrationPage) {
      setScrolled(false)
      setVisible(true)
      lastScrollY.current = 0
      ticking.current = false
      return undefined
    }

    const handleScroll = () => {
      const currentY = window.scrollY

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          if (currentY > lastScrollY.current && currentY > 80) {
            setVisible(false)
          } else {
            setVisible(true)
          }

          setScrolled(currentY > 40)
          lastScrollY.current = currentY > 0 ? currentY : 0
          ticking.current = false
        })
        ticking.current = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isRegistrationPage])

  const menuItems = [
    { to: '/', label: 'Home' },
    { to: '/academias', label: 'Academias' },
    { to: '#plans', label: 'Planos' },
    { to: '#experience', label: 'Experiência' },
    { to: '#espacos', label: 'Espaços' },
    { to: '#contact', label: 'Contato' }
  ]

  const headerClassName = [
    'site-header',
    scrolled ? 'scrolled' : '',
    !visible ? 'hidden' : '',
    isRegistrationPage ? 'site-header--static' : ''
  ].filter(Boolean).join(' ')

  return (
    <header className={headerClassName} role="banner">
      <div className="site-header-inner">
        <button
          className="nav-toggle"
          onClick={onToggleSidebar}
          aria-label="Abrir menu"
          aria-expanded="false"
        >
          <span className="sr-only">Abrir menu</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </button>

        <Link to="/" className="logo" aria-label="Abdala Club - Home">
          <img src={logo} alt="Abdala Club" />
          <span className="logo-text">Abdala Club</span>
        </Link>

        <nav className="main-nav" role="navigation" aria-label="Menu principal">
          <ul>
            {menuItems.map((item) => (
              <li key={item.label}>
                {/* use Link quando for rota; para âncoras internas usamos <a> */}
                {item.to.startsWith('#') ? (
                  <a href={item.to}>{item.label}</a>
                ) : (
                  <Link to={item.to}>{item.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
