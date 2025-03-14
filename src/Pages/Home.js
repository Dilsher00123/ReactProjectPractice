import React, { useState } from 'react';

function Home({ onLogin, loggedIn }) {
  const [username, setUsername] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username) {
      onLogin(username);
    }
  };

  return (
    <>
      {!loggedIn && (
        <div className="login-container">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
            <input type="submit" value="Login" />
          </form>
        </div>
      )}
    </>
  );
}

export default Home;
