import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Login.css' 
import Navbar from './Navbar';


function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [language, setLanguage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'));
  const [searchQuery, setSearchQuery] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
  
    
    if (!name || !email || !password || !role || !language) {
      setError('Te rugăm să completezi toate câmpurile.');
      return;
    }
  
    if (password.length < 3) {
      setError('Parola trebuie să aibă minim 3 caractere.');
      return;
    }
  
    if (!['student', 'professor'].includes(role)) {
      setError("Rolul trebuie să fie 'student' sau 'professor'.");
      return;
    }
  
    const languageArray = language
      .split(',')
      .map(l => l.trim())
      .filter(l => l !== '');
  
    if (languageArray.length === 0) {
      setError('Introdu cel puțin o limbă.');
      return;
    }
  
    try {
      const res = await axios.post('http://localhost:8080/api/users/register', {
        name,
        email,
        password,
        role,
        language: languageArray
      });
  
      console.log(res.data.message);
      setError('');
      navigate('/login');
    } catch (err) {
      if (err.response?.data) {
        setError(err.response.data);
      } else {
        setError('Eroare de rețea.');
      }
    }
  };
  

  return (
    <>
      <Navbar />

      <div className="container">
        <div className="form-box">
          <h2>Înregistrare</h2>
          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label htmlFor="name">Nume</label>
              <input
                type="text"
                id="name"
                placeholder="Introdu numele tău"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Introdu emailul tău"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Parolă</label>
              <input
                type="password"
                id="password"
                placeholder="Creează o parolă"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="role">Rol</label>
              <select
                id="role"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Selectează rolul</option>
                <option value="student">Student</option>
                <option value="professor">Profesor</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="language">Limbi cunoscute</label>
              <input
                type="text"
                id="language"
                placeholder="Ex: română, engleză, franceză"
                required
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
            </div>

            {error && (
              <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>
            )}

            <button type="submit" className="btn">Înregistrează-te</button>

            <p className="switch">
              Ai deja un cont? <Link to="/login">Autentifică-te</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Register
