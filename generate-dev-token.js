const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-secret-key-change-in-production';

// Create a development token
const devUser = {
  id: 'dev-user',
  email: 'dev@localhost',
  name: 'Developer User',
  role: 'developer',
  organizationId: 'local'
};

const token = jwt.sign(devUser, JWT_SECRET, { expiresIn: '24h' });

console.log('Development JWT Token:');
console.log(token);
console.log('\nUse this in the Authorization header:');
console.log(`Bearer ${token}`);
console.log('\nOr update setupProxy.js to use:');
console.log(`'Authorization': 'Bearer ${token}'`);