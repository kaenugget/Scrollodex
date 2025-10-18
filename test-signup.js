const puppeteer = require('puppeteer');

async function testSignupFlow() {
  const browser = await puppeteer.launch({ 
    headless: false, // Run in non-headless mode so we can see what's happening
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to signup page...');
    await page.goto('http://localhost:3000/signup', { waitUntil: 'networkidle0' });
    
    // Wait for the form to load
    await page.waitForSelector('input[id="firstName"]', { timeout: 10000 });
    
    console.log('Form loaded, checking initial state...');
    
    // Check if Next button is disabled initially
    const nextButton = await page.$('button[type="button"]:last-of-type');
    const isDisabled = await page.evaluate(button => button.disabled, nextButton);
    console.log('Next button initially disabled:', isDisabled);
    
    // Clear existing values first
    await page.click('input[id="firstName"]', { clickCount: 3 });
    await page.type('input[id="firstName"]', 'Brent');
    
    // Wait for state update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check button state after first name
    const isDisabledAfterFirstName = await page.evaluate(button => button.disabled, nextButton);
    console.log('Next button disabled after first name:', isDisabledAfterFirstName);
    
    // Clear and fill last name
    await page.click('input[id="lastName"]', { clickCount: 3 });
    await page.type('input[id="lastName"]', 'Deverman');
    
    // Wait for state update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check button state after both names
    const isDisabledAfterBothNames = await page.evaluate(button => button.disabled, nextButton);
    console.log('Next button disabled after both names:', isDisabledAfterBothNames);
    
    // Get the button text and classes to debug
    const buttonInfo = await page.evaluate(button => ({
      text: button.textContent,
      disabled: button.disabled,
      className: button.className,
      innerHTML: button.innerHTML
    }), nextButton);
    
    console.log('Button info:', buttonInfo);
    
    // Check the canProceed function logic by evaluating the form state
    const formState = await page.evaluate(() => {
      const firstName = document.getElementById('firstName')?.value || '';
      const lastName = document.getElementById('lastName')?.value || '';
      return {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        firstNameLength: firstName.trim().length,
        lastNameLength: lastName.trim().length,
        bothFilled: firstName.trim() && lastName.trim()
      };
    });
    
    console.log('Form state:', formState);
    
    // Wait a bit to see the UI
    await new Promise(resolve => setTimeout(resolve, 3000));
    
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    await browser.close();
  }
}

testSignupFlow();
