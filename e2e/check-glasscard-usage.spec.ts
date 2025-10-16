import { test, expect } from '@playwright/test';

test('Check for GlassCard component usage', async ({ page }) => {
  console.log('=== CHECKING FOR GLASSCARD COMPONENTS ===');
  
  await page.goto('/docs/ai-predictive-maintenance-engine-architecture');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Check for elements that might be GlassCard components
  const possibleGlassCards = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    const results: any[] = [];
    
    elements.forEach((el) => {
      const computed = window.getComputedStyle(el);
      const className = el.className;
      
      // Look for glass-like properties
      if (computed.backdropFilter !== 'none' || 
          computed.filter.includes('blur') ||
          className.includes('glass') ||
          className.includes('Glass')) {
        results.push({
          tagName: el.tagName,
          className: className,
          backdropFilter: computed.backdropFilter,
          filter: computed.filter,
          background: computed.background,
          position: computed.position
        });
      }
    });
    
    return results;
  });
  
  console.log(`Found ${possibleGlassCards.length} potential glass card elements:`);
  possibleGlassCards.forEach((card, i) => {
    console.log(`${i + 1}. ${card.tagName}.${card.className}`);
    console.log(`   backdrop-filter: ${card.backdropFilter}`);
    console.log(`   filter: ${card.filter}`);
    console.log(`   background: ${card.background}`);
    console.log(`   position: ${card.position}`);
    console.log('');
  });
  
  // Also check for any styled-components with 'sc-' prefixes that might be glass cards
  const styledComponents = await page.evaluate(() => {
    const elements = document.querySelectorAll('[class*="sc-"]');
    const results: any[] = [];
    
    elements.forEach((el) => {
      const computed = window.getComputedStyle(el);
      if (computed.backdropFilter !== 'none' || computed.filter.includes('blur')) {
        results.push({
          tagName: el.tagName,
          className: el.className,
          backdropFilter: computed.backdropFilter,
          filter: computed.filter
        });
      }
    });
    
    return results;
  });
  
  console.log(`Found ${styledComponents.length} styled-components with blur effects:`);
  styledComponents.forEach((comp, i) => {
    console.log(`${i + 1}. ${comp.tagName}.${comp.className}`);
    console.log(`   backdrop-filter: ${comp.backdropFilter}`);
    console.log(`   filter: ${comp.filter}`);
  });
  
  await page.screenshot({ path: 'glasscard-check.png', fullPage: true });
  console.log('📸 Screenshot saved for GlassCard check');
});