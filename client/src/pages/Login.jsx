import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Login.css'
import Navbar from './Navbar';


function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'));
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post('http://localhost:8080/api/users/login', {
        email,
        password,
      });
  
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
  
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            localStorage.setItem('userLocation', JSON.stringify(location));
            navigate('/');
          },
          (err) => {
            console.warn('Nu s-a putut obține locația:', err);
            navigate('/');
          }
        );
      } else {
        navigate('/');
      }
  
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Eroare la conectare cu serverul.');
      }
    }
  };
  

  return (
    <>
        <Navbar />

      <div className="container">
        <div className="form-box">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Introduceți emailul"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Parolă</label>
              <input
                type="password"
                id="password"
                placeholder="Introduceți parola"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '5px' }}>
                {error}
              </p>
            )}

            <button type="submit" className="btn">Login</button>

            <p className="switch">
              Nu ai cont? <Link to="/register">Înregistrează-te</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login
