// Debug script to monitor pet state in browser console
// Run this in your browser's developer console while on the contact detail page

console.log('🐛 Pet Debug Monitor Started');

// Function to check pet state
function checkPetState() {
  console.log('🐛 === Pet State Check ===');
  
  // Check if we're on a contact detail page
  const petModelElement = document.querySelector('[class*="PetModel"]');
  if (!petModelElement) {
    console.log('🐛 Not on a contact detail page with PetModel');
    return;
  }
  
  // Check for debug panel
  const debugPanel = document.querySelector('[class*="bg-yellow-50"]');
  if (debugPanel) {
    console.log('🐛 Debug panel found - check the yellow debug box on the page');
  } else {
    console.log('🐛 Debug panel not found - PetModel component may not be loaded');
  }
  
  // Check console logs
  console.log('🐛 Check the console for logs starting with 🐣');
  console.log('🐛 Look for these specific log patterns:');
  console.log('🐛   - "PetModel: State check:"');
  console.log('🐛   - "PetModel: Pet existence debug:"');
  console.log('🐛   - "PetModel: Relationship health calculation:"');
  console.log('🐛   - "Convex: getPetData called"');
  console.log('🐛   - "Convex: updatePetData called"');
}

// Function to simulate hatch button click
function simulateHatchClick() {
  const hatchButton = document.querySelector('button:has-text("Hatch Pet")') || 
                     Array.from(document.querySelectorAll('button')).find(btn => 
                       btn.textContent.includes('Hatch Pet'));
  
  if (hatchButton) {
    console.log('🐛 Found hatch button, clicking...');
    hatchButton.click();
  } else {
    console.log('🐛 Hatch button not found');
  }
}

// Function to clear pet data (for testing)
function clearPetData() {
  console.log('🐛 This would clear pet data - implement if needed for testing');
  console.log('🐛 You can manually clear pet data in Convex dashboard or add a mutation');
}

// Export functions to global scope
window.debugPet = {
  checkState: checkPetState,
  simulateHatch: simulateHatchClick,
  clearData: clearPetData
};

console.log('🐛 Debug functions available:');
console.log('🐛   debugPet.checkState() - Check current pet state');
console.log('🐛   debugPet.simulateHatch() - Simulate hatch button click');
console.log('🐛   debugPet.clearData() - Clear pet data (placeholder)');

// Auto-check state every 5 seconds
setInterval(checkPetState, 5000);

checkPetState();
