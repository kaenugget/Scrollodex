import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const { contactId, userId, relationshipHealth } = await request.json();

    if (!contactId || !userId || relationshipHealth === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: contactId, userId, and relationshipHealth are required' },
        { status: 400 }
      );
    }

    console.log('🐣 API: Starting pet generation with:', { contactId, userId, relationshipHealth });

    // Call Convex action to hatch pet (actions are called differently than mutations)
    const result = await convex.action(api.pets.hatchPet, {
      contactId,
      userId,
      relationshipHealth,
    });

    console.log('🐣 API: Pet generation completed:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('🐣 API: Pet hatching error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to hatch pet';
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (errorMsg.includes('Connection lost')) {
      errorMessage = 'Pet generation timed out. Please try again.';
    } else if (errorMsg.includes('permission')) {
      errorMessage = 'You do not have permission to generate a pet for this contact.';
    } else if (errorMsg.includes('not found')) {
      errorMessage = 'Contact not found.';
    }
    
    return NextResponse.json(
      { error: errorMessage, details: errorMsg },
      { status: 500 }
    );
  }
}
