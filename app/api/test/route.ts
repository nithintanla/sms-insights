import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simple test response 
    return NextResponse.json({ 
      status: 'ok',
      message: 'API is working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in test API:', error);
    return NextResponse.json(
      { error: 'Test API failed' },
      { status: 500 }
    );
  }
} 