import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body?.callback_query?.data === 'approve_all') {
      // Call Convex action to handle approval
      const result = await convex.action(api.workflows.handleApproval, {
        callbackData: body.callback_query.data,
        chatId: body.callback_query.message?.chat?.id,
        userId: body.callback_query.from?.id
      });
      
      return NextResponse.json({ 
        ok: true, 
        message: 'Approval processed',
        result 
      });
    }
    
    return NextResponse.json({ ok: true, message: 'Webhook received' });
  } catch (e) {
    console.error('Telegram webhook error:', e);
    return NextResponse.json(
      { ok: false, error: String(e) }, 
      { status: 500 }
    );
  }
}
