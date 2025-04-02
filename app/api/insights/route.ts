import { NextResponse } from 'next/server';
import clickhouseClient from '../../../src/lib/db';

export async function GET() {
  try {
    // Query to fetch aggregated data from agg_sms_classification table
    const result = await clickhouseClient.query({
      query: `
        SELECT 
          toDate(date) as date,
          sum(count) as message_count 
        FROM agg_sms_classification 
        WHERE date >= now() - INTERVAL 30 DAY 
        GROUP BY date 
        ORDER BY date
      `,
      format: 'JSONEachRow',
    });
    
    const data = await result.json();
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching insights data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch insights data' },
      { status: 500 }
    );
  }
} 