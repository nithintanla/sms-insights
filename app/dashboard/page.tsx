import { Suspense } from 'react';
import DashboardLayout from '../../src/components/dashboard/DashboardLayout';
import IndustryMetricsTable from '../../src/components/dashboard/IndustryMetricsTable';
import EntityMetricsTable from '../../src/components/dashboard/EntityMetricsTable';

async function fetchIndustryMetrics() {
  try {
    console.log('Fetching industry metrics from:', `${process.env.NEXT_PUBLIC_API_URL || ''}/api/industry-metrics`);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/industry-metrics`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      const errorText = await res.text(); // Get the error details from the response
      console.error('Industry metrics API error response:', errorText);
      throw new Error(`Failed to fetch industry metrics data: ${res.status} ${res.statusText}`);
    }
    
    return res.json();
  } catch (error) {
    console.error('Error loading industry metrics data:', error);
    return { data: [] };
  }
}

async function fetchEntityMetrics() {
  try {
    console.log('Fetching entity metrics from:', `${process.env.NEXT_PUBLIC_API_URL || ''}/api/entity-metrics`);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/entity-metrics`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      const errorText = await res.text(); // Get the error details from the response
      console.error('Entity metrics API error response:', errorText);
      throw new Error(`Failed to fetch entity metrics data: ${res.status} ${res.statusText}`);
    }
    
    return res.json();
  } catch (error) {
    console.error('Error loading entity metrics data:', error);
    return { data: [] };
  }
}

export default async function DashboardPage() {
  // Fetch all needed data
  const [industryMetricsData, entityMetricsData] = await Promise.allSettled([
    fetchIndustryMetrics(),
    fetchEntityMetrics()
  ]);
  
  const industryData = industryMetricsData.status === 'fulfilled' ? industryMetricsData.value.data || [] : [];
  const entityData = entityMetricsData.status === 'fulfilled' ? entityMetricsData.value.data || [] : [];
  
  const hasErrors = industryMetricsData.status === 'rejected' || entityMetricsData.status === 'rejected';
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">SMS Insights Dashboard</h1>
        <p className="mt-4 text-gray-500">
          Analytics by industry and entity metrics
        </p>
      </div>
      
      {hasErrors && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
          <h3 className="text-lg font-medium">API Error</h3>
          <p>There was an error fetching some data. Some insights may be incomplete.</p>
          <p className="mt-2 text-sm">Please check the browser console for detailed error messages.</p>
        </div>
      )}
      
      <div className="space-y-8">
        {/* Industry Metrics Dashboard */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">SMS Industry Analytics</h2>
          <p className="mb-6 text-gray-600">
            Count of entities, templates, and telemarketers by industry type
          </p>
          <Suspense fallback={<div>Loading industry metrics...</div>}>
            <IndustryMetricsTable data={industryData || []} />
          </Suspense>
        </div>
        
        {/* Entity Metrics Dashboard */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">SMS Entity Analytics</h2>
          <p className="mb-6 text-gray-600">
            Count of unique values for each entity ID
          </p>
          <Suspense fallback={<div>Loading entity metrics...</div>}>
            <EntityMetricsTable data={entityData || []} />
          </Suspense>
        </div>
      </div>
    </DashboardLayout>
  );
} 