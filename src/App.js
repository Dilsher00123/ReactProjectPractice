import './App.css';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Budget from './Pages/Budget';
import About from './Pages/About';
import Home from './Pages/Home';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate(); // Hook to navigate

  // Check localStorage on component mount to persist login state
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    if (isLoggedIn) {
      setUserName(localStorage.getItem('userName'));
    }
    setLoggedIn(isLoggedIn);
  }, []);
  
  // Function to handle login
  const onLogin = (name) => {
    setLoggedIn(true);
    setUserName(name);
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('userName', name);
  };

  // Function to handle logout and redirect to home
  const onLogout = () => {
    setLoggedIn(false);
    setUserName('');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userName');
    navigate("/home"); // Redirect to Home after logout
  };

  return (
    <div className="ProjectBody">
      <nav className="nav-container">
      <Link to="/home">
        <img src="/logoimage.jpg" alt="Logo" className="nav-logo" />
      </Link>

        {loggedIn && (
          <div className="nav-welcome">
            <h2>Welcome, {userName}</h2>
          </div>
        )}

        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/budget">Budget</Link></li>
          <li><Link to="/about">About</Link></li>
          {loggedIn && <li><button className="logout-button" onClick={onLogout}>Logout</button></li>}
        </ul>
      </nav>

      <Routes>
        {/* Home Route */}
        <Route path="/home" element={<Home onLogin={onLogin} loggedIn={loggedIn} />} />
        <Route path="/budget" element={loggedIn ? <Budget /> : <RedirectToHome />} />
        <Route path="/about" element={loggedIn ? <About /> : <RedirectToHome />} />
      </Routes>
    </div>
  );
}

// Component to handle redirecting back to the Home page with a message
function RedirectToHome() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('You are not logged in. Please log in to access this page.');

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 3000); // Redirect after 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>{message}</h2>
    </div>
  );
}

export default App;
