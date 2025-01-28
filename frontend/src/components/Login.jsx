import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
  
      // Log the response to confirm userId and token
      console.log(response.data); // This will log the userId and token
  
      // Store userId and token in localStorage
      localStorage.setItem('userId', response.data.userId);  // Store userId
      localStorage.setItem('token', response.data.token);    // Store token
  
      // Redirect to trivia game page
      navigate('/game');
    } catch (error) {
      console.error(error);
      alert('Login failed!');
    }
  };
  

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
