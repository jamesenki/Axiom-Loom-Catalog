const fetch = require('node-fetch');

async function testRawResponse() {
  console.log('Testing raw API response for velocityforge-sdv-platform-architecture...\n');
  
  try {
    const response = await fetch('http://127.0.0.1:3000/api/detect-apis/velocityforge-sdv-platform-architecture');
    const data = await response.json();
    
    console.log('Full response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testRawResponse();