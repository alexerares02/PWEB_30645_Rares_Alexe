// ✅ ProfessorDashboard.jsx cu calcul corect al prețului cu ofertă din backend

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Chart from 'chart.js/auto';
import './ProfessorDashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

let chartInstance = null;

function ProfessorDashboard() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [nrMeetings, setNrMeetings] = useState('');
  const [cost, setCost] = useState('');
  const [spots, setSpots] = useState('');
  const [language, setLanguage] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:8080/api/courses/professor/enrollment-stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
      renderChart(res.data);
    } catch (err) {
      console.error('Eroare la fetchCourses:', err);
    }
  };

  const addCourse = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:8080/api/courses/addCourse', {
      title,
      description,
      domain,
      startdate: startDate,
      enddate: endDate,
      nrmeetings: Number(nrMeetings),
      cost: Number(cost),
      availablespots: Number(spots),
      availablelanguage: language.split(',').map((l) => l.trim()),
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCourses();
    e.target.reset();
  };

  const addOffer = async (courseID, discount) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:8080/api/offers/add', { courseID, discount }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCourses();
    } catch (err) {
      console.error('Eroare la adaugare oferta:', err);
    }
  };

  const deleteCourse = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8080/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCourses();
    } catch (err) {
      console.error("Eroare la ștergere curs:", err);
    }
  };

  const renderChart = (courses) => {
    const ctx = document.getElementById('enrollmentChart');
    if (chartInstance) chartInstance.destroy();

    const labels = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Noi', 'Dec'];

    const datasets = courses.map((course) => {
      const monthlyData = Array(12).fill(0);
      if (course.monthlyEnrollments) {
        Object.entries(course.monthlyEnrollments).forEach(([month, count]) => {
          monthlyData[parseInt(month)] = count;
        });
      }
      return {
        label: course.title,
        data: monthlyData,
        backgroundColor: 'rgba(106, 17, 203, 0.5)',
        borderColor: 'rgba(106, 17, 203, 1)',
        borderWidth: 1,
      };
    });

    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true, precision: 0 } },
      },
    });
  };

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <h1>Dashboard Profesor</h1>

        <form onSubmit={addCourse} className="course-form">
          <input placeholder="Titlu" onChange={(e) => setTitle(e.target.value)} required />
          <textarea placeholder="Descriere" onChange={(e) => setDescription(e.target.value)} required />
          <input placeholder="Domeniu" onChange={(e) => setDomain(e.target.value)} required />
          <input type="date" onChange={(e) => setStartDate(e.target.value)} required />
          <input type="date" onChange={(e) => setEndDate(e.target.value)} required />
          <input placeholder="Întâlniri" type="number" onChange={(e) => setNrMeetings(e.target.value)} required />
          <input placeholder="Cost" type="number" onChange={(e) => setCost(e.target.value)} required />
          <input placeholder="Locuri disponibile" type="number" onChange={(e) => setSpots(e.target.value)} required />
          <input placeholder="Limbi (ex: romana, engleza)" onChange={(e) => setLanguage(e.target.value)} required />
          <button type="submit">Adaugă Curs</button>
        </form>

        <div className="course-list">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <h3>{course.title}</h3>
              <p><strong>Cost inițial:</strong> {course.cost} RON</p>
              {course.discount ? (
                <>
                  <p><strong>Reducere:</strong> {course.discount}%</p>
                  <p><strong>Preț redus:</strong> {course.discountedPrice} RON</p>
                </>
              ) : (
                <p><em>Fără ofertă</em></p>
              )}
              <form onSubmit={(e) => {
                e.preventDefault();
                const discount = e.target.discount.value;
                addOffer(course.id, discount);
              }}>
                <input type="number" name="discount" placeholder="Discount (%)" min="1" max="100" required />
                <button type="submit">Aplică Ofertă</button>
              </form>
              <p><strong>Înrolări:</strong> {course.enrollmentCount || 0}</p>
              <button onClick={() => setEditingCourse(course)}>Editează</button>
              <button onClick={() => deleteCourse(course.id)}>Șterge</button>
            </div>
          ))}
        </div>

        <div className="calendar-section">
          <h2>Calendar Înrolări</h2>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={courses
              .filter((c) => (c.enrollmentCount || 0) > 0)
              .map((course) => ({ title: course.title, start: course.startdate, end: course.enddate }))}
          />
        </div>

        <div className="stats-section">
          <h2>Statistici Înrolări pe lună</h2>
          <canvas id="enrollmentChart"></canvas>
        </div>
      </div>
    </>
  );
}

export default ProfessorDashboard;
