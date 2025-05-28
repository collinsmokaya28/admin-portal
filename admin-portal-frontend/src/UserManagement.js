import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      return;
    }

    fetch('http://localhost:3001/api/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized. Please log in again.');
          } else if (response.status === 403) {
            throw new Error('Forbidden. You do not have access to view users.');
          } else {
            throw new Error(`Failed to fetch users: ${response.statusText}`);
          }
        }
        return response.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h2>User Management</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users.map(({ id, name, email }) => (
          <li key={id} style={{ marginBottom: '0.75rem' }}>
            <strong>{name}</strong> — <em>{email}</em>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
