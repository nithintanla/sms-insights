import React from 'react';

type InsightData = {
  topTemplates: Array<{
    templateId: number;
    messageCount: number;
    successRate: number;
  }>;
  topTelemarketers: Array<{
    telemarketerId: number;
    messageCount: number;
    successRate: number;
  }>;
  topIndustries: Array<{
    industry: string;
    messageCount: number;
    entityCount: number;
  }>;
};

type InsightsSummaryProps = {
  data: InsightData;
};

export default function InsightsSummary({ data }: InsightsSummaryProps) {
  const InsightCard = ({ title, items }: { title: string; items: any[] }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Object.keys(items[0] || {}).map((key) => (
                <th
                  key={key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, index) => (
              <tr key={index}>
                {Object.entries(item).map(([key, value]) => (
                  <td key={key} className="px-4 py-3 text-sm text-gray-500">
                    {typeof value === 'number' && key.toLowerCase().includes('rate')
                      ? `${(value * 100).toFixed(1)}%`
                      : String(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <InsightCard title="Top 5 Performing Templates" items={data.topTemplates} />
      <InsightCard title="Top 5 Telemarketers" items={data.topTelemarketers} />
      <InsightCard title="Top 5 Industries" items={data.topIndustries} />
    </div>
  );
}
