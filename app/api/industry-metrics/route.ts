import { NextResponse } from 'next/server';
import clickhouseClient from '../../../src/lib/db';

export async function GET() {
  try {
    console.log('Executing industry metrics query...');
    // Query for dashboard 1: Count of iEntityID, iTemplateID, iTelemarketerID by vcIndustryType
    const result = await clickhouseClient.query({
      query: `
        SELECT 
          vcIndustryType,
          count(DISTINCT iEntityID) as entity_count,
          count(DISTINCT iTemplateID) as template_count,
          count(DISTINCT iTelemarketerID) as telemarketer_count
        FROM agg_sms_classification
        GROUP BY vcIndustryType
        ORDER BY vcIndustryType
      `,
      format: 'JSONEachRow',
    });
    
    const data = await result.json();
    console.log('Industry metrics query successful, row count:', data.length);
    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Error fetching industry metrics:', error);
    
    // Return a more detailed error response
    return NextResponse.json(
      { 
        error: 'Failed to fetch industry metrics', 
        details: error.message,
        stack: error.stack,
        query: `
          SELECT 
            vcIndustryType,
            count(DISTINCT iEntityID) as entity_count,
            count(DISTINCT iTemplateID) as template_count,
            count(DISTINCT iTelemarketerID) as telemarketer_count
          FROM agg_sms_classification
          GROUP BY vcIndustryType
          ORDER BY vcIndustryType
        `
      },
      { status: 500 }
    );
  }
} 