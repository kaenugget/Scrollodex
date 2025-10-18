import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const { contactId, relationshipHealth } = await request.json();

    if (!contactId || relationshipHealth === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Call Convex function to hatch pet
    const result = await convex.mutation(api.pets.hatchPet, {
      contactId,
      relationshipHealth,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Pet hatching API error:', error);
    return NextResponse.json(
      { error: 'Failed to hatch pet' },
      { status: 500 }
    );
  }
}
