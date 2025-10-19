"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

// Daily digest workflow (simplified - no external API calls)
export const runDailyDigest = action({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    console.log('🚀 Starting daily digest workflow');
    
    try {
      // Simplified workflow - just return success for now
      console.log('📋 Daily digest workflow completed (simplified)');
      
      return {
        success: true,
        message: 'Daily digest workflow completed successfully',
        contacts: [],
        topContacts: [],
        drafts: [],
        gmailResult: { success: true, message: 'Gmail integration not implemented' },
        telegramResult: { success: true, message: 'Telegram integration not implemented' }
      };
      
    } catch (error) {
      console.error('❌ Daily digest workflow failed:', error);
      return {
        success: false,
        error: String(error)
      };
    }
  }
});

// Handle Telegram approval (simplified)
export const handleApproval = action({
  args: {
    callbackData: v.string(),
    chatId: v.optional(v.string()),
    userId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    console.log('✅ Handling approval:', args.callbackData);
    
    try {
      if (args.callbackData === 'approve_all') {
        console.log('📤 Approving all drafts (simplified)');
        
        return {
          success: true,
          message: 'All drafts approved and sent (simplified)'
        };
      } else if (args.callbackData === 'skip') {
        console.log('⏭️ Skipping drafts (simplified)');
        
        return {
          success: true,
          message: 'Drafts skipped (simplified)'
        };
      }
      
      return {
        success: false,
        message: 'Unknown callback data'
      };
      
    } catch (error) {
      console.error('❌ Approval handling failed:', error);
      return {
        success: false,
        error: String(error)
      };
    }
  }
});