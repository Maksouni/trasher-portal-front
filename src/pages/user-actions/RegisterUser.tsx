import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RegisterUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: {[key: string]: string} = {};
    
    if (!username) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';
    if (!role) newErrors.role = 'Role is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setMessage('User registered successfully');
    setErrors({});
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '800px',
        width: '100%'
      }}>
        <nav style={{ 
          marginBottom: '20px',
          textAlign: 'right'
        }}>
          <Link to="/users" style={{ 
            textDecoration: 'none',
            color: '#0066cc'
          }}>
            User List
          </Link>
        </nav>

        <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Register User</h1>
      
      <form onSubmit={handleRegister} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: errors.username ? '1px solid red' : '1px solid #ddd',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
          {errors.username && <span style={{ color: 'red', fontSize: '12px' }}>{errors.username}</span>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: errors.password ? '1px solid red' : '1px solid #ddd',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
          {errors.password && <span style={{ color: 'red', fontSize: '12px' }}>{errors.password}</span>}
        </div>

        <div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: errors.role ? '1px solid red' : '1px solid #ddd',
              width: '100%'
            }}
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <span style={{ color: 'red', fontSize: '12px' }}>{errors.role}</span>}
        </div>

        <button 
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Register
        </button>
      </form>
      {message && (
        <p style={{ textAlign: 'center', marginTop: '20px', color: 'green' }}>
          {message}
        </p>
      )}
      </div>
    </div>
  );
};

export default RegisterUser;