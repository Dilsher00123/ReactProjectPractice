import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ loggedIn, children }) {
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!loggedIn) {
      setMessage('You must log in to access this page.');
      setTimeout(() => {
        setMessage('');
        setRedirect(true); // Trigger redirect after 2 seconds
      }, 2000);
    }
  }, [loggedIn]);

  if (redirect) {
    return <Navigate to="/home" state={{ from: location }} />;
  }

  if (loggedIn) {
    return children;
  }

  return (
    <div className="message-container">
      <p className="login-message">{message}</p>
    </div>
  );
}

export default ProtectedRoute;
