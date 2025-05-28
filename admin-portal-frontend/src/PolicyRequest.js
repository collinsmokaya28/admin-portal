import React, { useState, useEffect } from 'react';

const PolicyRequest = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      return;
    }

    fetch('http://localhost:3001/api/registrations', {
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
            throw new Error('Forbidden. You do not have permission to view registrations.');
          } else {
            throw new Error(`Failed to fetch registrations: ${response.statusText}`);
          }
        }
        return response.json();
      })
      .then(data => {
        setRegistrations(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading registrations...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h2>Policy Request</h2>
      <ul>
        {registrations.map(({ id, name, description }) => (
          <li key={id} style={{ marginBottom: '1em' }}>
            <strong>{name}</strong><br />
            <small>{description}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PolicyRequest;
