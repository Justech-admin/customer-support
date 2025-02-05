import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
// import '../styles/login.css';  // Correct import path


export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Temporarily log the username and password (hashed) for debugging
    console.log("Username:", username);
    
    // Hash the password and log it to the console (temporary debugging)
    const bcrypt = require('bcryptjs');
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error generating hash:', err);
      } else {
        console.log('Hashed password:', hashedPassword);
      }
    });

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setErrorMessage("Invalid username or password!");
    } else {
      router.push("/"); // Redirect to home page after successful login
    }
  };

  return (
    <div className="login-container">
      {/* Left Section with Image */}
      <div className="login-image">
        <img src="/img/Cust.png" alt="Customer Service" />
      </div>

      {/* Right Section with Login Form */}
      <div className="login-form">
        {/* Logo Section */}
        <div className="logo-container">
          <img src="/img/jatayu-logo.jpeg" alt="Jatayu Logo" className="logo" />
        </div>

        <h2>Jatayu Support Portal</h2>

        {/* Error Message */}
        {errorMessage && <p className="error">{errorMessage}</p>}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">Login</button>
        </form>

        <div className="footer">
          <a href="/forget">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}
