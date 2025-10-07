// Simple manual test for double-click functionality
// Run this in browser console on http://localhost:3000

console.log('Testing double-click functionality on repository cards...');

// Wait for page to load
setTimeout(() => {
  const cards = document.querySelectorAll('[data-testid="repository-card"]');
  console.log(`Found ${cards.length} repository cards`);
  
  if (cards.length > 0) {
    const firstCard = cards[0];
    console.log('First card:', firstCard);
    
    // Test double-click
    console.log('Simulating double-click on first card...');
    const event = new MouseEvent('dblclick', {
      view: window,
      bubbles: true,
      cancelable: true,
      detail: 2
    });
    
    firstCard.dispatchEvent(event);
    console.log('Double-click event dispatched');
    
    // Check if URL changed after a short delay
    setTimeout(() => {
      if (window.location.pathname.includes('/repository/')) {
        console.log('SUCCESS: Navigation worked! Current URL:', window.location.href);
      } else {
        console.log('FAILED: No navigation detected. Current URL:', window.location.href);
      }
    }, 1000);
  } else {
    console.log('ERROR: No repository cards found on the page');
    console.log('Page HTML snippet:', document.body.innerHTML.substring(0, 500));
  }
}, 3000);