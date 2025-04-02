import { NextResponse } from 'next/server';
import clickhouseClient from '../../../../src/lib/db';

export async function GET() {
  try {
    const [templatesResult, telemarketerResult, industriesResult] = await Promise.all([
      // Top 5 templates by message count and success rate
      clickhouseClient.query({
        query: `
          SELECT 
            iTemplateID as templateId,
            count(*) as messageCount,
            avg(iDeliveryStatus = 1) as successRate
          FROM agg_sms_classification
          GROUP BY iTemplateID
          ORDER BY messageCount DESC
          LIMIT 5
        `,
        format: 'JSONEachRow',
      }),

      // Top 5 telemarketers by message count and success rate
      clickhouseClient.query({
        query: `
          SELECT 
            iTelemarketerID as telemarketerId,
            count(*) as messageCount,
            avg(iDeliveryStatus = 1) as successRate
          FROM agg_sms_classification
          GROUP BY iTelemarketerID
          ORDER BY messageCount DESC
          LIMIT 5
        `,
        format: 'JSONEachRow',
      }),

      // Top 5 industries by message count and unique entities
      clickhouseClient.query({
        query: `
          SELECT 
            vcIndustryType as industry,
            count(*) as messageCount,
            uniqExact(iEntityID) as entityCount
          FROM agg_sms_classification
          GROUP BY vcIndustryType
          ORDER BY messageCount DESC
          LIMIT 5
        `,
        format: 'JSONEachRow',
      }),
    ]);

    const [topTemplates, topTelemarketers, topIndustries] = await Promise.all([
      templatesResult.json(),
      telemarketerResult.json(),
      industriesResult.json(),
    ]);

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
      { error: 'Failed to fetch insights summary', details: error.message },
      { status: 500 }
    );
  }
}
