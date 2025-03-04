import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api') // This will proxy to http://localhost:5000/api
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to HireHub</h1>
        <p>{message || 'Loading HireHub API...'}</p>
      </header>
    </div>
  );
}

export default App;