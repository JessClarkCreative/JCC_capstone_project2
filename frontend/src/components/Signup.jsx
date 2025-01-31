import React, { useState } from 'react';
import { Form, Button, Message } from 'semantic-ui-react';

const Signup = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setError('Signup failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSignup} error={!!error} loading={loading}>
      {error && (
        <Message
          error
          header="Signup Failed"
          content={error}
        />
      )}
      <Form.Input
        fluid
        icon="user"
        iconPosition="left"
        label="Username"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
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
        Sign Up
      </Button>
    </Form>
  );
};

export default Signup;