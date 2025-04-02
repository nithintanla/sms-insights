import { NextResponse } from 'next/server';
import clickhouseClient from '../../../../src/lib/db';

export async function GET() {
  try {
    console.log('Executing insights summary queries...');
    
    // First verify connection
    await clickhouseClient.ping();
    
    const [templatesResult, telemarketerResult, industriesResult] = await Promise.all([
      // Top 5 templates by message count and success rate
      clickhouseClient.query({
        query: `
          SELECT 
            iTemplateID as templateId,
            count(*) as messageCount,
            avg(case when iDeliveryStatus = 1 then 1 else 0 end) as successRate
          FROM agg_sms_classification
          GROUP BY iTemplateID
          ORDER BY messageCount DESC
          LIMIT 5
        `,
        format: 'JSONEachRow',
      }).catch(err => {
        console.error('Template query failed:', err);
        return { json: () => [] };
      }),

      // Top 5 telemarketers by message count and success rate
      clickhouseClient.query({
        query: `
          SELECT 
            iTelemarketerID as telemarketerId,
            count(*) as messageCount,
            avg(case when iDeliveryStatus = 1 then 1 else 0 end) as successRate
          FROM agg_sms_classification
          GROUP BY iTelemarketerID
          ORDER BY messageCount DESC
          LIMIT 5
        `,
        format: 'JSONEachRow',
      }).catch(err => {
        console.error('Telemarketer query failed:', err);
        return { json: () => [] };
      }),

      // Top 5 industries by message count and unique entities
      clickhouseClient.query({
        query: `
          SELECT 
            vcIndustryType as industry,
            count(*) as messageCount,
            uniqExact(iEntityID) as entityCount
          FROM agg_sms_classification
          WHERE vcIndustryType IS NOT NULL
          GROUP BY vcIndustryType
          ORDER BY messageCount DESC
          LIMIT 5
        `,
        format: 'JSONEachRow',
      }).catch(err => {
        console.error('Industry query failed:', err);
        return { json: () => [] };
      }),
    ]);

    console.log('Fetching JSON results...');
    const [topTemplates, topTelemarketers, topIndustries] = await Promise.all([
      templatesResult.json(),
      telemarketerResult.json(),
      industriesResult.json(),
    ]);

    console.log('Summary data fetched successfully');
    console.log(`Templates: ${topTemplates.length}, Telemarketers: ${topTelemarketers.length}, Industries: ${topIndustries.length}`);

    return NextResponse.json({
      data: {
        topTemplates,
        topTelemarketers,
        topIndustries,
      }
    });
  } catch (error: any) {
    console.error('Error fetching insights summary:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch insights summary', 
        details: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
