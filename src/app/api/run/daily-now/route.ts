import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    // Call Convex action to run daily digest workflow
    const result = await convex.action(api.workflows.runDailyDigest, {});
    
    return NextResponse.json({ 
      ok: true, 
      message: 'Daily digest workflow triggered',
      result 
    });
  } catch (e) {
    console.error('Daily digest error:', e);
    return NextResponse.json(
      { ok: false, error: String(e) }, 
      { status: 500 }
    );
  }
}
