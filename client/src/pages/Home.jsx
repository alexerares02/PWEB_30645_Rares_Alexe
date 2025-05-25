import './Home.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';

function Home() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/courses');
      setCourses(res.data.slice(0, 2)); // 👉 Primele 2 cursuri
    } catch (err) {
      console.error('Eroare la încărcarea cursurilor:', err);
    }
  };

  return (
    <>
      <Navbar />

      <header className="hero">
        <h1>Bine ai venit la EduLearn</h1>
        <p>Descoperă cele mai bune cursuri online pentru dezvoltarea ta!</p>
        <a href="/courses" className="btn">Explorează Cursurile</a>
      </header>

      <section id="courses" className="course-section">
        <h2>Cursuri Populare</h2>
        <div className="course-list">
          {courses.map(course => (
            <div key={course.id} className="course-item">
              <h3>{course.title}</h3>
              <Link to="/courses" className="btn">Vezi cursuri</Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;
