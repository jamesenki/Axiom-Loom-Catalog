import { test } from '@playwright/test';

test('check glass CSS effects', async ({ page }) => {
  await page.goto('http://10.0.0.109:3000/docs/ai-predictive-maintenance-engine-architecture');
  await page.waitForLoadState('networkidle');

  // Look for glass-related CSS variables and usage
  const glassEffectsInfo = await page.evaluate(() => {
    // Check CSS custom properties for glass variables
    const rootStyle = getComputedStyle(document.documentElement);
    const glassVars = [];
    
    // Check for glass-related CSS variables
    const properties = ['--glass-background', '--glass-border', '--glass-hover', '--glass-active'];
    properties.forEach(prop => {
      const value = rootStyle.getPropertyValue(prop);
      if (value) {
        glassVars.push({ property: prop, value: value.trim() });
      }
    });

    // Check for elements using glass variables
    const elementsWithGlass = [];
    const allElements = document.querySelectorAll('*');
    
    for (let el of allElements) {
      const style = window.getComputedStyle(el);
      
      // Check if background contains glass variable
      if (style.background && style.background.includes('glass')) {
        const tagName = el.tagName.toLowerCase();
        const className = el.className && typeof el.className === 'string' ? el.className : '';
        elementsWithGlass.push({
          element: `${tagName}${className ? '.' + className.split(' ')[0] : ''}`,
          background: style.background,
          backdropFilter: style.backdropFilter
        });
      }
    }

    return {
      glassVars,
      elementsWithGlass,
      hasBackdropFilter: !!document.querySelector('[style*="backdrop-filter"]')
    };
  });

  console.log('\n=== GLASS CSS EFFECTS ANALYSIS ===');
  
  console.log('\n🎨 Glass CSS Variables:');
  glassEffectsInfo.glassVars.forEach(item => {
    console.log(`  ${item.property}: ${item.value}`);
  });

  console.log(`\n🪟 Elements with glass effects: ${glassEffectsInfo.elementsWithGlass.length}`);
  glassEffectsInfo.elementsWithGlass.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.element}`);
    console.log(`     background: ${item.background}`);
    console.log(`     backdrop-filter: ${item.backdropFilter}`);
  });

  console.log(`\n🔍 Has backdrop-filter elements: ${glassEffectsInfo.hasBackdropFilter}`);

  // The key insight: Glass variables exist but are they actually causing blur?
  if (glassEffectsInfo.glassVars.length > 0) {
    console.log('\n⚠️ GLASS CSS VARIABLES DETECTED');
    console.log('   These may be causing the "fuzzing" effect if applied with backdrop-filter');
  } else {
    console.log('\n✅ NO GLASS CSS VARIABLES FOUND');
  }
});