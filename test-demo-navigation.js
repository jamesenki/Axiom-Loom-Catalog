// Simple manual test to check View Demo navigation
console.log('Testing View Demo navigation...');

// Open browser and navigate to the page manually
console.log('1. Open http://localhost:3000/repository/appliances-co-water-heater-platform');
console.log('2. Look for "View Demo" button');
console.log('3. Click "View Demo" button');  
console.log('4. Check if it navigates to: http://localhost:3000/coming-soon/demo/appliances-co-water-heater-platform');
console.log('5. If it doesn\'t navigate, the button click is being prevented or overridden');

// Check the route directly
console.log('\nTesting direct navigation:');
console.log('Open: http://localhost:3000/coming-soon/demo/appliances-co-water-heater-platform');
console.log('Should show: DocsComingSoon component with demo-specific content');