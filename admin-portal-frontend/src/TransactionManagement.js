import React, { useState, useEffect } from 'react';

const TransactionManagement = () => {
  const [customerRequests, setCustomerRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      return;
    }

    fetch('http://localhost:3001/api/customer-requests', {
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
            throw new Error('Forbidden. You do not have permission to view customer requests.');
          } else {
            throw new Error(`Error fetching customer requests: ${response.statusText}`);
          }
        }
        return response.json();
      })
      .then(data => {
        setCustomerRequests(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading customer requests...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h2>Transaction Management</h2>
      <ul>
        {customerRequests.map(({ id, name, description }) => (
          <li key={id} style={{ marginBottom: '1rem' }}>
            <strong>{name}</strong><br />
            <small>{description}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionManagement;
