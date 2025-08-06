const fetch = require('node-fetch');

(async () => {
  try {
    console.log('Testing API endpoint...');
    const response = await fetch('http://localhost:3001/api/repositories');
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());
    
    if (response.ok) {
      const data = await response.json();
      console.log('Number of repositories:', data.length);
      console.log('First repository:', data[0]);
    } else {
      const text = await response.text();
      console.log('Error response:', text);
    }
  } catch (error) {
    console.error('Fetch error:', error.message);
  }
})();