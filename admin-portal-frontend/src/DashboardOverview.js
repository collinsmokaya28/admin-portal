import React, { useState, useEffect } from 'react';

const DashboardOverview = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      return;
    }

    fetch('http://localhost:3001/api/metrics', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized. Please log in again.');
          }
          if (response.status === 403) {
            throw new Error('Forbidden. You do not have access to this resource.');
          }
          throw new Error(`Failed to fetch metrics: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        setMetrics(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading metrics...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h2>Dashboard Overview</h2>
      <ul>
        {metrics.map(metric => (
          <li key={metric.id}>
            <strong style={{ marginRight: 10 }}>{metric.name}:</strong>
            {metric.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardOverview;
