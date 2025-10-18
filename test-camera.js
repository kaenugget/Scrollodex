const puppeteer = require('puppeteer');

async function testCameraFunctionality() {
  const browser = await puppeteer.launch({ 
    headless: false, // Run in non-headless mode so we can see what's happening
    defaultViewport: null,
    args: ['--start-maximized', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream']
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to signup page...');
    await page.goto('http://localhost:3000/signup', { waitUntil: 'networkidle0' });
    
    // Navigate to selfie step
    console.log('Filling name fields...');
    await page.type('input[id="firstName"]', 'Test');
    await page.type('input[id="lastName"]', 'User');
    
    // Click Next to go to email step
    await page.click('button:has-text("Next")');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Fill email and go to selfie step
    await page.type('input[id="email"]', 'test@example.com');
    await page.click('button:has-text("Next")');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Now on selfie step, testing camera functionality...');
    
    // Check if Start Camera button exists
    const startCameraButton = await page.$('button:has-text("Start Camera")');
    if (startCameraButton) {
      console.log('Start Camera button found, clicking...');
      await page.click('button:has-text("Start Camera")');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if video element appears
      const videoElement = await page.$('video');
      if (videoElement) {
        console.log('Video element found!');
        
        // Check if Capture button exists
        const captureButton = await page.$('button:has-text("Capture")');
        if (captureButton) {
          console.log('Capture button found, clicking...');
          await page.click('button:has-text("Capture")');
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Check if selfie preview appears
          const selfiePreview = await page.$('img[alt="Selfie preview"]');
          if (selfiePreview) {
            console.log('Selfie captured successfully!');
          } else {
            console.log('Selfie capture failed - no preview image');
          }
        } else {
          console.log('Capture button not found');
        }
      } else {
        console.log('Video element not found after starting camera');
      }
    } else {
      console.log('Start Camera button not found');
    }
    
    // Check for any console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Browser console error:', msg.text());
      }
    });
    
    // Wait to see the result
    await new Promise(resolve => setTimeout(resolve, 3000));
    
  } catch (error) {
    console.error('Error during camera test:', error);
  } finally {
    await browser.close();
  }
}

testCameraFunctionality();



