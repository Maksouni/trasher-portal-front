import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  return (
    <header style={{
      backgroundColor: '#f8f9fa',
      padding: '1rem',
      borderBottom: '1px solid #dee2e6',
      marginBottom: '2rem',
      width: '100%'
    }}>
      <nav style={{
        display: 'flex',
        justifyContent: 'flex-end',
        maxWidth: '800px',
        margin: '0 auto',
        gap: '20px'
      }}>
        {location.pathname !== '/users' && (
          <Link to="/users" style={{
            textDecoration: 'none',
            color: '#0066cc',
            fontWeight: 'bold'
          }}>
            User List
          </Link>
        )}
        {location.pathname !== '/register' && (
          <Link to="/register" style={{
            textDecoration: 'none',
            color: '#0066cc',
            fontWeight: 'bold'
          }}>
            Register New User
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;