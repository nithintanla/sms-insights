import { Suspense } from 'react';
import DashboardLayout from '../../src/components/dashboard/DashboardLayout';
import RawDataTable from '../../src/components/data/RawDataTable';
import InsightsSummary from '../../src/components/insights/InsightsSummary';

async function fetchRawData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/raw-data`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch raw data');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error loading raw data:', error);
    return { data: [], error: error.message };
  }
}

async function fetchInsightsSummary() {
  try {
    console.log('Fetching insights summary...');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/insights/summary`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      console.error('Insights summary error:', errorData);
      throw new Error(`Failed to fetch insights summary: ${errorData.details || res.statusText}`);
    }
    
    const data = await res.json();
    if (!data || !data.data) {
      throw new Error('Invalid insights data format');
    }
    
    return { data: data.data, error: null };
  } catch (error: any) {
    console.error('Error loading insights summary:', error);
    return { 
      data: {
        topTemplates: [],
        topTelemarketers: [],
        topIndustries: []
      }, 
      error: error.message 
    };
  }
}

export default async function RawDataPage() {
  const [{ data: rawData, error: rawError }, { data: insightsData, error: insightsError }] = 
    await Promise.all([fetchRawData(), fetchInsightsSummary()]);
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Insights Summary Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Performance Insights</h2>
          <Suspense fallback={<div>Loading insights...</div>}>
            {insightsData ? (
              <InsightsSummary data={insightsData} />
            ) : (
              <div className="bg-red-50 p-4 rounded">
                <p className="text-red-700">Error loading insights: {insightsError}</p>
              </div>
            )}
          </Suspense>
        </div>

        {/* Raw Data Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Raw Data Sample</h2>
          <Suspense fallback={<div>Loading raw data...</div>}>
            {rawError ? (
              <div className="bg-red-50 p-4 rounded">
                <p className="text-red-700">{rawError}</p>
              </div>
            ) : (
              <RawDataTable data={rawData || []} />
            )}
          </Suspense>
        </div>
      </div>
    </DashboardLayout>
  );
}