import React, { useState } from 'react';
import { Form, Button, Message } from 'semantic-ui-react';

const Login = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('token', data.token);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setError('Invalid email or password');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleLogin} error={!!error} loading={loading}>
      {error && (
        <Message
          error
          header="Login Failed"
          content={error}
        />
      )}
      <Form.Input
        fluid
        icon="mail"
        iconPosition="left"
        label="Email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Form.Input
        fluid
        icon="lock"
        iconPosition="left"
        label="Password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button 
        fluid 
        primary 
        size="large"
        loading={loading}
        disabled={loading}
      >
        Login
      </Button>
    </Form>
  );
};

export default Login;