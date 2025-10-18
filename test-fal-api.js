// Test script to verify Fal AI API key and connection
// Run this with: node test-fal-api.js

const FAL_KEY = process.env.FAL_KEY;

if (!FAL_KEY) {
  console.error('❌ FAL_KEY environment variable not set');
  console.log('Please set your FAL_KEY in your .env file');
  process.exit(1);
}

console.log('🔑 FAL_KEY found:', FAL_KEY.substring(0, 10) + '...');

async function testFluxAPI() {
  console.log('🖼️ Testing Flux image generation...');
  
  // Try different Flux endpoints
  const endpoints = [
    "https://fal.run/fal-ai/flux-pro",
    "https://fal.run/fal-ai/flux-dev",
    "https://fal.run/fal-ai/flux-schnell",
    "https://fal.run/fal-ai/flux"
  ];
  
  for (const endpoint of endpoints) {
    console.log(`\n🔍 Trying endpoint: ${endpoint}`);
    
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Key ${FAL_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: "A cute orange cat, kawaii style, digital art",
          image_size: "square_hd",
          num_inference_steps: 4, // Very fast for testing
          enable_safety_checker: true,
        }),
      });

      console.log('📊 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Flux API working!');
        console.log('📸 Image URL:', data.data?.images?.[0]?.url || data.images?.[0]?.url || 'No URL found');
        console.log('📋 Full response:', JSON.stringify(data, null, 2));
        return; // Found working endpoint, exit
      } else {
        const errorText = await response.text();
        console.error('❌ Flux API error:', response.status, response.statusText);
        console.error('📋 Error details:', errorText);
      }
    } catch (error) {
      console.error('❌ Flux API test failed:', error.message);
    }
  }
  
  console.log('❌ No working Flux endpoint found');
}

async function testVeoAPI() {
  console.log('🎬 Testing Veo video generation...');
  
  try {
    const response = await fetch("https://fal.run/fal-ai/veo3.1/fast", {
      method: "POST",
      headers: {
        "Authorization": `Key ${FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: "A cute orange cat sitting calmly, kawaii style, digital art",
        duration: "4s",
        aspect_ratio: "1:1",
        resolution: "720p",
        generate_audio: false,
        enhance_prompt: true,
        auto_fix: true,
      }),
    });

    console.log('📊 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Veo API working!');
      console.log('🎥 Video URL:', data.data?.video?.url || data.video?.url || 'No URL found');
      console.log('📋 Full response:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.error('❌ Veo API error:', response.status, response.statusText);
      console.error('📋 Error details:', errorText);
    }
  } catch (error) {
    console.error('❌ Veo API test failed:', error.message);
  }
}

async function runTests() {
  console.log('🧪 Starting Fal AI API tests...\n');
  
  await testFluxAPI();
  console.log('\n' + '='.repeat(50) + '\n');
  await testVeoAPI();
  
  console.log('\n🏁 Tests completed!');
}

runTests().catch(console.error);
