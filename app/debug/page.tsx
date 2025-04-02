import React from 'react';
import Link from 'next/link';
import DashboardLayout from '../../src/components/dashboard/DashboardLayout';

export default function DebugPage() {
  // List of API endpoints to test
  const endpoints = [
    { name: 'Test API', path: '/api/test' },
    { name: 'Schema API', path: '/api/schema' },
    { name: 'Raw Data API', path: '/api/raw-data' },
    { name: 'Industry Metrics API', path: '/api/industry-metrics' },
    { name: 'Entity Metrics API', path: '/api/entity-metrics' },
  ];
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">API Debugging</h1>
        <p className="mt-4 text-gray-500">
          Test API endpoints directly to troubleshoot issues
        </p>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">API Endpoints</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Click on an endpoint to test it directly</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            {endpoints.map((endpoint, index) => (
              <div key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
                <dt className="text-sm font-medium text-gray-500">{endpoint.name}</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <a 
                    href={endpoint.path} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    {endpoint.path}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </DashboardLayout>
  );
} 