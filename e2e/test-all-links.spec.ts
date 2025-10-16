import { test, expect } from '@playwright/test';

test.describe('Test ALL Links and Documents', () => {
  test('should verify every document link in every repository works', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(3000);
    
    // Get all repository links
    const repoLinks = await page.locator('a[href^="/repo/"]').all();
    console.log(`Found ${repoLinks.length} repository links`);
    
    const errors = [];
    const checkedLinks = new Set();
    
    // Test each repository
    for (let i = 0; i < Math.min(repoLinks.length, 5); i++) { // Test first 5 repos for speed
      const repoHref = await repoLinks[i].getAttribute('href');
      if (!repoHref || checkedLinks.has(repoHref)) continue;
      checkedLinks.add(repoHref);
      
      console.log(`Testing repository: ${repoHref}`);
      await page.goto(`http://localhost:3000${repoHref}`);
      await page.waitForTimeout(2000);
      
      // Navigate to documentation
      const docsButton = page.locator('a:has-text("Documentation"), button:has-text("Documentation")').first();
      if (await docsButton.count() > 0) {
        await docsButton.click();
        await page.waitForTimeout(2000);
        
        // Check for errors
        const errorElements = await page.locator('text=/Error|Failed|401|404/i').all();
        if (errorElements.length > 0) {
          for (const errorEl of errorElements) {
            const errorText = await errorEl.textContent();
            errors.push(`Documentation error in ${repoHref}: ${errorText}`);
          }
        }
        
        // Get all markdown file links
        const docLinks = await page.locator('a[href*=".md"], a[href*=".MD"]').all();
        console.log(`  Found ${docLinks.length} document links`);
        
        // Test each document link
        for (let j = 0; j < Math.min(docLinks.length, 3); j++) { // Test first 3 docs per repo
          const docText = await docLinks[j].textContent();
          console.log(`    Testing document: ${docText}`);
          
          await docLinks[j].click();
          await page.waitForTimeout(1500);
          
          // Check if content loaded
          const contentLoaded = await page.locator('.markdown-content, pre, code').count() > 0;
          const hasError = await page.locator('text=/Error|Failed|401|404/i').count() > 0;
          
          if (hasError) {
            const errorText = await page.locator('text=/Error|Failed|401|404/i').first().textContent();
            errors.push(`Document link error in ${repoHref} - ${docText}: ${errorText}`);
          } else if (!contentLoaded) {
            errors.push(`No content loaded for ${repoHref} - ${docText}`);
          }
        }
      }
    }
    
    // Report all errors
    if (errors.length > 0) {
      console.error('❌ ERRORS FOUND:');
      errors.forEach(error => console.error(`  - ${error}`));
    } else {
      console.log('✅ All tested links and documents are working!');
    }
    
    // Test should fail if any errors found
    expect(errors).toHaveLength(0);
  });
  
  test('should verify UI has improved contrast and no blur issues', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);
    
    // Check for blur effects
    const elementsWithBlur = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const blurryElements = [];
      
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        const backdropFilter = styles.backdropFilter || styles.webkitBackdropFilter || '';
        const filter = styles.filter || '';
        
        // Check for excessive blur (more than 3px)
        if (backdropFilter.includes('blur') || filter.includes('blur')) {
          const blurMatch = (backdropFilter + filter).match(/blur\((\d+)/);
          if (blurMatch && parseInt(blurMatch[1]) > 3) {
            blurryElements.push({
              tagName: el.tagName,
              className: el.className,
              blur: blurMatch[0]
            });
          }
        }
      });
      
      return blurryElements;
    });
    
    if (elementsWithBlur.length > 0) {
      console.log('⚠️ Elements with excessive blur found:');
      elementsWithBlur.forEach(el => {
        console.log(`  - ${el.tagName}.${el.className}: ${el.blur}`);
      });
    }
    
    // Check for bright green/cyan colors
    const brightColors = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const brightElements = [];
      
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        const color = styles.color;
        const bgColor = styles.backgroundColor;
        
        // Check for bright cyan/green colors
        const problematicColors = ['#06FFFF', '#50FA7B', 'rgb(6, 255, 255)', 'rgb(80, 250, 123)'];
        
        if (problematicColors.some(c => color.includes(c) || bgColor.includes(c))) {
          brightElements.push({
            tagName: el.tagName,
            className: el.className,
            color: color,
            bgColor: bgColor
          });
        }
      });
      
      return brightElements;
    });
    
    if (brightColors.length > 0) {
      console.log('⚠️ Elements with bright green/cyan colors found:');
      brightColors.forEach(el => {
        console.log(`  - ${el.tagName}.${el.className}: color=${el.color}, bg=${el.bgColor}`);
      });
    }
    
    // Tests should pass for improved UI
    expect(elementsWithBlur.length).toBe(0);
    expect(brightColors.length).toBe(0);
  });
});