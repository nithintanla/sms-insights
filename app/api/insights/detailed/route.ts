import { NextResponse } from 'next/server';
import clickhouseClient from '../../../../src/lib/db';

export async function GET() {
  try {
    // Query to fetch detailed aggregated data by category
    const result = await clickhouseClient.query({
      query: `
        SELECT 
          toDate(date) as date,
          classification_name,
          sum(count) as message_count,
          classification_type
        FROM agg_sms_classification 
        WHERE date >= now() - INTERVAL 30 DAY 
        GROUP BY date, classification_name, classification_type
        ORDER BY date, classification_name
      `,
      format: 'JSONEachRow',
    });
    
    const data = await result.json();
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching detailed insights data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch detailed insights data' },
      { status: 500 }
    );
  }
} 