import { NextResponse } from 'next/server';
import clickhouseClient from '../../../src/lib/db';

export async function GET() {
  try {
    console.log('Executing entity metrics query...');
    // Query for dashboard 2: For each iEntityID, count of unique values
    const result = await clickhouseClient.query({
      query: `
        SELECT 
          iEntityID,
          count(DISTINCT vcExistingCustomer) as existing_customer_types,
          count(DISTINCT vcMessageType) as message_types,
          count(DISTINCT vcIndustryType) as industry_types,
          count(DISTINCT vcIndustrySubType) as industry_subtypes
        FROM agg_sms_classification
        GROUP BY iEntityID
        ORDER BY iEntityID
      `,
      format: 'JSONEachRow',
    });
    
    const data = await result.json();
    console.log('Entity metrics query successful, row count:', data.length);
    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Error fetching entity metrics:', error);
    
    // Return a more detailed error response
    return NextResponse.json(
      { 
        error: 'Failed to fetch entity metrics', 
        details: error.message,
        stack: error.stack,
        query: `
          SELECT 
            iEntityID,
            count(DISTINCT vcExistingCustomer) as existing_customer_types,
            count(DISTINCT vcMessageType) as message_types,
            count(DISTINCT vcIndustryType) as industry_types,
            count(DISTINCT vcIndustrySubType) as industry_subtypes
          FROM agg_sms_classification
          GROUP BY iEntityID
          ORDER BY iEntityID
        `
      },
      { status: 500 }
    );
  }
}