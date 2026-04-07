import React, { useState } from "react";
import "../styles/Login.css";

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "vignan" && password === "vgntcse") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      {/* LEFT PANEL WITH VIDEO */}
      <div className="login-left">
        <video autoPlay loop muted>
          <source src="/videos/bg1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="left-content">
          <h1>Autonomous Timetable System</h1>
          <p>Smart timetable generation for modern institutions.</p>
          <p>Plan. Manage. Optimize.</p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Sign in</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign in</button>
        </form>
      </div>
    </div>
  );
}

export default Login;