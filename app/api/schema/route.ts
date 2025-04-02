import { NextResponse } from 'next/server';
import clickhouseClient from '../../../src/lib/db';

export async function GET() {
  try {
    // First, fetch list of tables
    const tablesResult = await clickhouseClient.query({
      query: `
        SHOW TABLES
      `,
      format: 'JSONEachRow',
    });
    
    const tables = await tablesResult.json();
    
    // Then get detailed schema of one table to examine column names
    const result = await clickhouseClient.query({
      query: `
        SELECT * FROM system.columns
        WHERE table = 'agg_sms_classification'
        ORDER BY position
      `,
      format: 'JSONEachRow',
    });
    
    const columns = await result.json();
    return NextResponse.json({ tables, columns });
  } catch (error) {
    console.error('Error fetching schema information:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schema information', details: error.message },
      { status: 500 }
    );
  }
} 