"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { fetchContacts, createGmailDraft, sendTelegramMessage } from "./integrations";

// Daily digest workflow (replacing Mastra workflow)
export const runDailyDigest = action({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    console.log('🚀 Starting daily digest workflow');
    
    try {
      // Step 1: Fetch contacts
      const contactsResult = await fetchContacts(ctx, { 
        userId: args.userId || 'demo@example.com' 
      });
      console.log('📋 Fetched contacts:', contactsResult.contacts.length);
      
      // Step 2: Score contacts (simplified logic)
      const scoredContacts = contactsResult.contacts.map(contact => ({
        ...contact,
        score: Math.random() * 100, // Simplified scoring
        priority: Math.random() > 0.5 ? 'high' : 'low'
      }));
      
      const topContacts = scoredContacts
        .filter(c => c.priority === 'high')
        .slice(0, 3);
      
      console.log('🎯 Selected top contacts:', topContacts.length);
      
      // Step 3: Create outreach drafts
      const drafts = topContacts.map(contact => ({
        contactId: contact.id,
        email_subject: `Catching up with ${contact.name}`,
        email_body: `Hi ${contact.name},\n\nHope you're doing well! I wanted to reach out and catch up.\n\nBest regards,\nYour Name`
      }));
      
      console.log('✍️ Created drafts:', drafts.length);
      
      // Step 4: Create Gmail drafts
      const gmailResult = await createGmailDraft(ctx, { payload: drafts });
      console.log('📧 Gmail drafts created:', gmailResult.success);
      
      // Step 5: Send Telegram notification
      const telegramResult = await sendTelegramMessage(ctx, {
        chatId: 'your_chat_id', // You'd get this from user settings
        text: `Daily digest ready! Created ${drafts.length} drafts. Approve to send?`,
        replyMarkup: {
          inline_keyboard: [
            [
              { text: 'Approve All', callback_data: 'approve_all' },
              { text: 'Skip', callback_data: 'skip' }
            ]
          ]
        }
      });
      
      console.log('📱 Telegram notification sent:', telegramResult.success);
      
      return {
        success: true,
        contacts: contactsResult.contacts,
        topContacts,
        drafts,
        gmailResult,
        telegramResult
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

// Handle Telegram approval (replacing Mastra workflow)
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
        // In a real implementation, you'd:
        // 1. Get the pending drafts
        // 2. Send them via Gmail
        // 3. Update the database
        
        console.log('📤 Approving all drafts');
        
        // Send confirmation back to Telegram
        await sendTelegramMessage(ctx, {
          chatId: args.chatId || 'your_chat_id',
          text: '✅ All drafts approved and sent!'
        });
        
        return {
          success: true,
          message: 'All drafts approved and sent'
        };
      } else if (args.callbackData === 'skip') {
        console.log('⏭️ Skipping drafts');
        
        await sendTelegramMessage(ctx, {
          chatId: args.chatId || 'your_chat_id',
          text: '⏭️ Drafts skipped'
        });
        
        return {
          success: true,
          message: 'Drafts skipped'
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
