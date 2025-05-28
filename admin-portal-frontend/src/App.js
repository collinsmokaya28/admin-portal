import React, { useEffect, useState } from 'react';
import DashboardOverview from './DashboardOverview';
import UserManagement from './UserManagement';
import PolicyRequest from './PolicyRequest';
import TransactionManagement from './TransactionManagement';

const App = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // track if component is mounted to avoid setting state on unmounted component
    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    fetch('http://localhost:3001/api/data', { headers })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        if (isMounted) {
          console.log('Data received:', data);
          setData(data);
        }
      })
      .catch(error => {
        if (isMounted) {
          console.error('Error fetching data:', error);
          setError(error.message);
        }
      });

    return () => {
      isMounted = false; // cleanup flag
    };
  }, []);

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">App</h1>
      <DashboardOverview data={data} />
      <UserManagement data={data} />
      <PolicyRequest data={data} />
      <TransactionManagement data={data} />
    </div>
  );
};

export default App;

