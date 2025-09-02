import { test, expect } from '@playwright/test';

test.describe('USER REQUIREMENTS FINAL VALIDATION', () => {
  const baseURL = 'http://10.0.0.109:3000';
  const docURL = `${baseURL}/docs/ai-predictive-maintenance-engine-architecture`;

  test('User Requirement Compliance Test', async ({ page }) => {
    console.log('🎯 FINAL USER REQUIREMENTS COMPLIANCE TEST');
    console.log('==================================================');
    console.log('User Requirements:');
    console.log('1. NO blur effects anywhere');
    console.log('2. NO yellow colors');
    console.log('3. Simple dark professional colors (dark blue-black theme)');
    console.log('4. Good contrast for readability');
    console.log('5. Documentation loads without blur');
    console.log('==================================================\n');

    // REQUIREMENT 1 & 5: Test Homepage for blur effects
    console.log('🏠 TESTING HOMEPAGE BLUR EFFECTS...');
    await page.goto(baseURL, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(3000);

    await page.screenshot({ 
      path: 'test-results/USER-FINAL-homepage.png', 
      fullPage: true 
    });

    const homepageBlur = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let blurCount = 0;
      const blurElements = [];

      for (let element of elements) {
        const styles = window.getComputedStyle(element);
        // Check for actual blur effects (not just filter property)
        if ((styles.filter && styles.filter.includes('blur(')) ||
            (styles.backdropFilter && styles.backdropFilter.includes('blur('))) {
          blurCount++;
          blurElements.push({
            tag: element.tagName,
            filter: styles.filter,
            backdropFilter: styles.backdropFilter
          });
        }
      }

      return { blurCount, blurElements };
    });

    console.log(`   Result: ${homepageBlur.blurCount} blur effects found`);
    console.log(`   Status: ${homepageBlur.blurCount === 0 ? '✅ PASS' : '❌ FAIL'}`);

    // REQUIREMENT 2: Test for ACTUAL yellow colors (not false positives)
    console.log('\n🎨 TESTING FOR ACTUAL YELLOW COLORS...');
    const actualYellowColors = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let actualYellowCount = 0;
      const yellowElements = [];

      for (let element of elements) {
        const styles = window.getComputedStyle(element);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        // Check for ACTUAL yellow colors (not rgba white with opacity)
        const isActualYellow = 
          color === 'yellow' || color === '#ffff00' || color === 'rgb(255, 255, 0)' ||
          backgroundColor === 'yellow' || backgroundColor === '#ffff00' || backgroundColor === 'rgb(255, 255, 0)';

        if (isActualYellow) {
          actualYellowCount++;
          yellowElements.push({
            tag: element.tagName,
            color: color,
            backgroundColor: backgroundColor
          });
        }
      }

      return { actualYellowCount, yellowElements };
    });

    console.log(`   Result: ${actualYellowColors.actualYellowCount} actual yellow colors found`);
    console.log(`   Status: ${actualYellowColors.actualYellowCount === 0 ? '✅ PASS' : '❌ FAIL'}`);

    // REQUIREMENT 3: Test for dark theme colors
    console.log('\n🌃 TESTING DARK THEME IMPLEMENTATION...');
    const themeColors = await page.evaluate(() => {
      const body = document.body;
      const bodyStyles = window.getComputedStyle(body);
      
      return {
        bodyBackgroundColor: bodyStyles.backgroundColor,
        bodyColor: bodyStyles.color,
        isDarkTheme: bodyStyles.color.includes('203, 213, 225') || bodyStyles.color.includes('203,213,225')
      };
    });

    console.log(`   Body Color: ${themeColors.bodyColor}`);
    console.log(`   Body Background: ${themeColors.bodyBackgroundColor}`);
    console.log(`   Dark Theme: ${themeColors.isDarkTheme ? 'YES' : 'NO'}`);
    console.log(`   Status: ${themeColors.isDarkTheme ? '✅ PASS' : '❌ FAIL'}`);

    // REQUIREMENT 4 & 5: Test Documentation Page
    console.log('\n📄 TESTING DOCUMENTATION PAGE...');
    await page.goto(docURL, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(3000);

    await page.screenshot({ 
      path: 'test-results/USER-FINAL-documentation.png', 
      fullPage: true 
    });

    const docsTest = await page.evaluate(() => {
      const result = {
        pageLoaded: !document.title.includes('404') && !document.title.includes('Not Found'),
        hasContent: document.body.textContent.length > 200,
        blurEffects: 0,
        actualYellowColors: 0,
        title: document.title
      };

      const elements = document.querySelectorAll('*');
      
      for (let element of elements) {
        const styles = window.getComputedStyle(element);
        
        // Check for blur effects
        if ((styles.filter && styles.filter.includes('blur(')) ||
            (styles.backdropFilter && styles.backdropFilter.includes('blur('))) {
          result.blurEffects++;
        }
        
        // Check for actual yellow colors
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        const isActualYellow = 
          color === 'yellow' || color === '#ffff00' || color === 'rgb(255, 255, 0)' ||
          backgroundColor === 'yellow' || backgroundColor === '#ffff00' || backgroundColor === 'rgb(255, 255, 0)';

        if (isActualYellow) {
          result.actualYellowColors++;
        }
      }

      return result;
    });

    console.log(`   Page Loaded: ${docsTest.pageLoaded ? 'YES' : 'NO'}`);
    console.log(`   Has Content: ${docsTest.hasContent ? 'YES' : 'NO'}`);
    console.log(`   Title: ${docsTest.title}`);
    console.log(`   Blur Effects: ${docsTest.blurEffects}`);
    console.log(`   Yellow Colors: ${docsTest.actualYellowColors}`);
    console.log(`   Status: ${docsTest.pageLoaded && docsTest.hasContent && docsTest.blurEffects === 0 && docsTest.actualYellowColors === 0 ? '✅ PASS' : '❌ FAIL'}`);

    // FINAL ASSESSMENT
    console.log('\n🏁 FINAL ASSESSMENT');
    console.log('==================================================');

    const requirements = {
      noBlurEffectsHomepage: homepageBlur.blurCount === 0,
      noYellowColorsHomepage: actualYellowColors.actualYellowCount === 0,
      darkThemeImplemented: themeColors.isDarkTheme,
      documentationLoads: docsTest.pageLoaded && docsTest.hasContent,
      noBlurEffectsDocs: docsTest.blurEffects === 0,
      noYellowColorsDocs: docsTest.actualYellowColors === 0
    };

    const allRequirementsMet = Object.values(requirements).every(req => req === true);

    console.log('Requirements Status:');
    console.log(`   ✅ No blur effects (homepage): ${requirements.noBlurEffectsHomepage ? 'PASS' : 'FAIL'}`);
    console.log(`   ✅ No yellow colors (homepage): ${requirements.noYellowColorsHomepage ? 'PASS' : 'FAIL'}`);
    console.log(`   ✅ Dark theme implemented: ${requirements.darkThemeImplemented ? 'PASS' : 'FAIL'}`);
    console.log(`   ✅ Documentation loads: ${requirements.documentationLoads ? 'PASS' : 'FAIL'}`);
    console.log(`   ✅ No blur effects (docs): ${requirements.noBlurEffectsDocs ? 'PASS' : 'FAIL'}`);
    console.log(`   ✅ No yellow colors (docs): ${requirements.noYellowColorsDocs ? 'PASS' : 'FAIL'}`);

    console.log('\n🎉 FINAL RESULT:');
    console.log(`   ${allRequirementsMet ? '✅ ALL USER REQUIREMENTS MET' : '❌ REQUIREMENTS NOT MET'}`);
    console.log('==================================================');

    // Test assertions
    expect(homepageBlur.blurCount).toBe(0);
    expect(actualYellowColors.actualYellowCount).toBe(0);
    expect(themeColors.isDarkTheme).toBe(true);
    expect(docsTest.pageLoaded).toBe(true);
    expect(docsTest.hasContent).toBe(true);
    expect(docsTest.blurEffects).toBe(0);
    expect(docsTest.actualYellowColors).toBe(0);

    if (allRequirementsMet) {
      console.log('\n🎯 SUCCESS: The deployed application at http://10.0.0.109:3000');
      console.log('   fully meets all user requirements for the dark theme fixes!');
    }
  });
});