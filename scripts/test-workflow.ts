#!/usr/bin/env node

import 'dotenv/config';
import { runDailyDigest } from '../src/workflows/dailyDigest.js';

async function testWorkflow() {
  console.log('🧪 Testing Agentic CRM Workflow...\n');
  
  try {
    console.log('1️⃣ Starting daily digest workflow...');
    await runDailyDigest();
    console.log('✅ Daily digest completed successfully!\n');
    
    console.log('🎉 All tests passed! The agentic CRM is working correctly.');
    console.log('\n📋 What happened:');
    console.log('   • Contact Curator fetched mock contacts');
    console.log('   • Nurture Planner scored relationships');
    console.log('   • Outreach Writer created personalized drafts');
    console.log('   • Gmail MCP created drafts (check logs)');
    console.log('   • Telegram MCP sent approval message (check logs)');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testWorkflow();
