import './contact.css'
import { Link } from 'react-router-dom';
import { useState } from 'react'
import {  useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from './Navbar';



function Contact() {

  const [error, setError] = useState('')
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'));
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <>
        <Navbar />
      <header className="hero">
        <h1>Contactează-ne</h1>
        <p>Ai întrebări? Suntem aici să te ajutăm!</p>
      </header>

      <section className="contact-section">
        <h2>Informații de Contact</h2>
        <p><strong>Email:</strong> support@edulearn.com</p>
        <p><strong>Telefon:</strong> +40 123 456 789</p>
        <p><strong>Adresă:</strong> UTCN</p>
      </section>
    </>
  )
}

export default Contact
