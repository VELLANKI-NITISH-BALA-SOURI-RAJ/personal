import { NextResponse } from 'next/server';
import { generateRecommendations, QuestionnaireInput } from '../../../lib/recommendationEngine';
import { dbService } from '../../../lib/dbService';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const input: QuestionnaireInput = {
      budget: Number(body.budget) || 5000,
      category: body.category || 'any',
      usage: body.usage || 'all-rounder',
      wiredWireless: body.wiredWireless || 'either',
      ancNeeded: !!body.ancNeeded,
      batteryExpectation: body.batteryExpectation || 'any',
      preferredBrands: Array.isArray(body.preferredBrands) ? body.preferredBrands : [],
      compatibility: body.compatibility || 'any',
      comfortImportance: !!body.comfortImportance,
      micImportance: !!body.micImportance,
      soundPreference: body.soundPreference || 'any',
    };

    // Calculate recommendations
    const results = generateRecommendations(input);

    // Save search query to history in background/local
    try {
      const categoryLabel = input.category === 'any' ? 'Accessories' : input.category.toUpperCase();
      await dbService.saveSearch(
        `${categoryLabel} under ₹${input.budget} for ${input.usage}`,
        input.category,
        input.budget
      );
    } catch (dbErr) {
      console.error('Failed to log search history:', dbErr);
    }

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error: any) {
    console.error('API Recommendation Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process recommendation engine requirements.',
      },
      { status: 500 }
    );
  }
}
