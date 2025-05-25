import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './StudentCourses.css';
import Navbar from './Navbar';
import ChatBot from './ChatBot'; // 👈 Import chatbot

function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [domainFilter, setDomainFilter] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';

  useEffect(() => {
    fetchCourses();
  }, [location.search]);

  useEffect(() => {
    applyFilters();
  }, [courses, domainFilter, startDate, endDate]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/courses');
      setCourses(res.data);
    } catch (err) {
      console.error('Eroare la aducerea cursurilor:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...courses];
    if (initialSearch) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(initialSearch.toLowerCase())
      );
    }
    if (domainFilter) {
      filtered = filtered.filter(c =>
        c.domain.toLowerCase().includes(domainFilter.toLowerCase())
      );
    }
    if (startDate && endDate) {
      filtered = filtered.filter(
        c =>
          new Date(c.startdate) >= startDate &&
          new Date(c.enddate) <= endDate
      );
    }
    if (user?.language?.length) {
      filtered.sort((a, b) => {
        const aMatch = a.availablelanguage.some(lang => user.language.includes(lang));
        const bMatch = b.availablelanguage.some(lang => user.language.includes(lang));
        return bMatch - aMatch;
      });
    }
    setFilteredCourses(filtered);
  };

  const handleEnroll = async (courseID) => {
    if (!user || !localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        'http://localhost:8080/api/enrollments/addEnrollment',
        { courseID },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      const updatedUser = {
        ...user,
        enrollments: [...(user.enrollments || []), { courseId: courseID }],
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.location.reload();
    } catch (err) {
      console.error('Eroare la înrolare:', err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="courses-page">
        <h1>Catalog Cursuri</h1>
        <div className="filters">
          <input
            type="text"
            placeholder="Filtru domeniu (ex: informatică)"
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
          />
          <div className="date-filters">
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} placeholderText="De la data" />
            <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} placeholderText="Până la data" />
          </div>
        </div>

        <div className="course-list">
          {filteredCourses.map(course => (
            <div key={course.id} className="course-card">
              <h3>Titlu: {course.title}</h3>
              <p><strong>Descriere:</strong> {course.description}</p>
              <p><strong>Domeniu:</strong> {course.domain}</p>
              <p><strong>Perioadă:</strong> {course.startdate} - {course.enddate}</p>
              <p><strong>Cost:</strong> {course.cost} RON</p>
              {course.offer ? (
                <p style={{ color: 'green' }}>
                  Discount: {course.offer.discount}% → Preț redus: {Number(course.offer.discountedPrice).toFixed(2)} RON
                </p>
              ) : (
                <p><em>Fără ofertă</em></p>
              )}
              <p><strong>Locuri:</strong> {course.availablespots}</p>
              <p><strong>Limbi:</strong> {course.availablelanguage.join(', ')}</p>
              {user && user.enrollments?.some(e => e.courseId === course.id) ? (
                <button className="btn enrolled" disabled>Înrolat</button>
              ) : (
                <button className="btn" onClick={() => handleEnroll(course.id)}>Înrolează-te</button>
              )}
            </div>
          ))}
        </div>
      </div>

      <ChatBot /> {/* 👈 Afișează chatbotul */}
    </>
  );
}

export default StudentCourses;
