import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const passwordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

    if (!passwordValid) {
      setMessage("Password must be at least 8 characters long and include uppercase, lowercase, and a number.");
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/signup', { email, password });
      setMessage(`${res.data.message}`);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setMessage(`${err.response.data.message}`);
      } else {
        setMessage('Signup failed.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>Signup</h2>
      <form onSubmit={handleSignup} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Signup</button>
        {message && <p>{message}</p>}
      </form>
    <p>
        Have an account?{' '}
        <button onClick={() => navigate('/login')}>
        Login
        </button>
    </p>
    </div>
  );
}

const styles = {
  container: { maxWidth: '400px', margin: '50px auto', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '10px', fontSize: '16px' },
  button: { padding: '10px', fontSize: '16px', backgroundColor: '#28a745', color: '#fff', border: 'none' }
};

export default Signup;
