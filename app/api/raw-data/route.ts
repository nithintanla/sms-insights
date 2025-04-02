import { NextResponse } from 'next/server';
import clickhouseClient from '../../../src/lib/db';

export async function GET() {
  try {
    // Simple query to fetch 5 rows of raw data with all columns
    const result = await clickhouseClient.query({
      query: `
        SELECT *
        FROM agg_sms_classification
        LIMIT 5
      `,
      format: 'JSONEachRow',
    });
    
    const data = await result.json();
    
    // Log detailed information for troubleshooting
    console.log('Successfully fetched raw data');
    console.log('Number of rows:', data.length);
    
    if (data.length > 0) {
      console.log('Columns available:', Object.keys(data[0]));
    }
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching raw data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch raw data', 
        details: error.message,
        stack: error.stack 
      },
      { status: 500 }
    );
  }
} 