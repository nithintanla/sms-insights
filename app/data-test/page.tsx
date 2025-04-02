import React from 'react';
import DashboardLayout from '../../src/components/dashboard/DashboardLayout';
import clickhouseClient from '../../src/lib/db';

// Direct server-side data fetching
async function fetchDirectData() {
  try {
    console.log('Attempting to fetch data directly from ClickHouse...');
    
    // First try a simple ping test
    const pingResult = await clickhouseClient.ping();
    console.log('ClickHouse ping result:', pingResult);
    
    // List available databases
    console.log('Fetching available databases...');
    const databasesResult = await clickhouseClient.query({
      query: `SHOW DATABASES`,
      format: 'JSONEachRow',
    });
    const databases = await databasesResult.json();
    console.log('Available databases:', databases.map(db => db.name));
    
    // List available tables in the insights database
    console.log('Fetching available tables...');
    const tablesResult = await clickhouseClient.query({
      query: `SHOW TABLES FROM insights`,
      format: 'JSONEachRow',
    });
    const tables = await tablesResult.json();
    console.log('Available tables in insights:', tables.map(table => table.name));
    
    // Fetch data from agg_sms_classification directly
    console.log('Fetching data from agg_sms_classification table...');
    try {
      const dataResult = await clickhouseClient.query({
        query: `
          SELECT *
          FROM agg_sms_classification
          LIMIT 5
        `,
        format: 'JSONEachRow',
      });
      
      const sampleData = await dataResult.json();
      console.log('Successfully fetched data - row count:', sampleData.length);
      
      if (sampleData.length > 0) {
        console.log('Column names:', Object.keys(sampleData[0]));
      }
      
      return { 
        success: true, 
        data: sampleData,
        databases,
        tables,
        ping: pingResult 
      };
    } catch (tableError) {
      console.error('Error fetching from agg_sms_classification:', tableError);
      
      // If the specific table fetch fails, try to get data from the first available table
      let sampleData = [];
      let queryTable = '';
      let queryDatabase = 'insights';
      
      if (tables.length > 0) {
        queryTable = tables[0].name;
      } else if (databases.some(db => db.name === 'default')) {
        queryDatabase = 'default';
        console.log('No tables found in insights, checking default database...');
        const defaultTablesResult = await clickhouseClient.query({
          query: `SHOW TABLES FROM default`,
          format: 'JSONEachRow',
        });
        const defaultTables = await defaultTablesResult.json();
        console.log('Available tables in default:', defaultTables.map(table => table.name));
        
        if (defaultTables.length > 0) {
          queryTable = defaultTables[0].name;
        }
      }
      
      if (queryTable) {
        console.log(`Fetching data from ${queryDatabase}.${queryTable}...`);
        const fallbackResult = await clickhouseClient.query({
          query: `
            SELECT *
            FROM ${queryDatabase}.${queryTable}
            LIMIT 5
          `,
          format: 'JSONEachRow',
        });
        
        sampleData = await fallbackResult.json();
      }
      
      return { 
        success: true,
        data: sampleData,
        databases,
        tables,
        ping: pingResult,
        tableError: tableError.message
      };
    }
  } catch (error) {
    console.error('Error fetching data directly:', error);
    return { 
      success: false, 
      error: error.message,
      stack: error.stack,
      ping: null
    };
  }
}

// Create a simple table display component
function DataTable({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }
  
  const columns = Object.keys(data[0]);
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th 
                key={column}
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td key={`${rowIndex}-${column}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {typeof row[column] === 'object' 
                    ? JSON.stringify(row[column]) 
                    : String(row[column] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function DataTestPage() {
  const result = await fetchDirectData();
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Direct Database Test</h1>
        <p className="mt-4 text-gray-500">
          Testing direct connection to ClickHouse without going through API routes
        </p>
      </div>
      
      <div className="mb-6 p-4 bg-white shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
        {result.success ? (
          <div className="p-4 bg-green-50 text-green-700 rounded-md">
            <p>✅ Database connection successful</p>
            <p>Ping status: {result.ping ? 'Success' : 'Failed'}</p>
            {result.data && <p>Data rows: {result.data?.length || 0}</p>}
            {result.tableError && (
              <div className="mt-2 p-2 bg-yellow-50 text-yellow-700 rounded">
                <p>⚠️ Table specific error: {result.tableError}</p>
                <p>Showing fallback data instead.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 bg-red-50 text-red-700 rounded-md">
            <p>❌ Database connection failed</p>
            <p>Error: {result.error}</p>
            <pre className="mt-2 text-xs overflow-auto max-h-40 p-2 bg-gray-100 rounded">
              {result.stack}
            </pre>
          </div>
        )}
      </div>
      
      {result.success && result.databases && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Available Databases</h2>
          <div className="bg-white shadow overflow-hidden rounded-lg p-6">
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {result.databases.map((db: any, index: number) => (
                <li key={index} className="p-2 border rounded">
                  {db.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {result.success && result.tables && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Available Tables in 'insights' Database</h2>
          <div className="bg-white shadow overflow-hidden rounded-lg p-6">
            {result.tables.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {result.tables.map((table: any, index: number) => (
                  <li key={index} className="p-2 border rounded">
                    {table.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tables found in the 'insights' database</p>
            )}
          </div>
        </div>
      )}
      
      {result.success && result.data && result.data.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Sample Data (5 rows)</h2>
          <div className="bg-white shadow overflow-hidden rounded-lg p-6">
            <DataTable data={result.data} />
          </div>
        </div>
      )}
      
      {result.success && result.data && result.data.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Table Schema Information</h2>
          <div className="bg-white shadow overflow-hidden rounded-lg p-6">
            <div>
              <h3 className="font-medium mb-2">Available Columns:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(result.data[0]).map((column) => (
                  <div key={column} className="p-3 border rounded">
                    <p className="font-medium">{column}</p>
                    <p className="text-sm text-gray-500">
                      Sample value: {typeof result.data[0][column] === 'object' 
                        ? JSON.stringify(result.data[0][column]) 
                        : String(result.data[0][column] ?? '')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
} 