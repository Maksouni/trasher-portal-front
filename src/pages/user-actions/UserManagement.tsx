import React, { useState } from 'react';
import { Link } from 'react-router-dom';


interface User {
  id: number;
  username: string;
  role: string;
}

const mockUsers: User[] = [
  { id: 1, username: 'admin', role: 'admin' },
  { id: 2, username: 'user1', role: 'user' },
  { id: 3, username: 'user2', role: 'user' },
];

const roles = ['user', 'admin'];

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);

  const handleRoleChange = (userId: number, newRole: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleDelete = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
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
          <Link to="/register" style={{ 
            textDecoration: 'none',
            color: '#0066cc'
          }}>
            Register New User
          </Link>
        </nav>

        <h1 style={{ textAlign: 'center', margin: '20px 0' }}>User Management</h1>
        
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse', 
          border: '1px solid #ddd',
          backgroundColor: '#e9ecef',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
        <thead>
          <tr style={{ backgroundColor: '#dee2e6' }}>
            <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #adb5bd', color: '#212529' }}>Username</th>
            <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #adb5bd', color: '#212529' }}>Current Role</th>
            <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #adb5bd', color: '#212529' }}>Actions</th>
            <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #adb5bd', color: '#212529' }}>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid #adb5bd', backgroundColor: '#e9ecef' }}>
              <td style={{ padding: '12px', color: '#212529' }}>{user.username}</td>
              <td style={{ padding: '12px', color: '#212529' }}>{user.role}</td>
              <td style={{ padding: '12px' }}>
                <select 
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  style={{ 
                    padding: '6px', 
                    borderRadius: '4px',
                    border: '1px solid #adb5bd',
                    cursor: 'pointer',
                    backgroundColor: 'white',
                    color: '#212529'
                  }}
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </td>
              <td style={{ padding: '12px' }}>
                <button
                  onClick={() => handleDelete(user.id)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default UserManagement;