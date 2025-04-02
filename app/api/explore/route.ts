import { NextResponse } from 'next/server';
import clickhouseClient from '../../../src/lib/db';

export async function GET() {
  try {
    // List all databases
    const dbResult = await clickhouseClient.query({
      query: `
        SHOW DATABASES
      `,
      format: 'JSONEachRow',
    });
    
    const databases = await dbResult.json();
    
    // For each database, list its tables
    const databasesWithTables = [];
    
    for (const db of databases) {
      try {
        const tablesResult = await clickhouseClient.query({
          query: `
            SHOW TABLES FROM ${db.name}
          `,
          format: 'JSONEachRow',
        });
        
        const tables = await tablesResult.json();
        
        // For each table, get a column listing
        const tablesWithColumns = [];
        
        for (const table of tables) {
          try {
            const columnsResult = await clickhouseClient.query({
              query: `
                DESCRIBE ${db.name}.${table.name}
              `,
              format: 'JSONEachRow',
            });
            
            const columns = await columnsResult.json();
            
            // Search for specific columns that might indicate an SMS classification table
            const hasClassificationColumns = columns.some(col => 
              col.name.toLowerCase().includes('sms') || 
              col.name.toLowerCase().includes('classification') ||
              col.name.toLowerCase().includes('message') ||
              col.name.toLowerCase().includes('industry')
            );
            
            tablesWithColumns.push({
              name: table.name,
              columns: columns.map(col => ({ name: col.name, type: col.type })),
              potential_match: hasClassificationColumns
            });
          } catch (error) {
            console.error(`Error getting columns for ${db.name}.${table.name}:`, error);
            tablesWithColumns.push({
              name: table.name,
              error: error.message,
              columns: []
            });
          }
        }
        
        databasesWithTables.push({
          name: db.name,
          tables: tablesWithColumns
        });
      } catch (error) {
        console.error(`Error getting tables for ${db.name}:`, error);
        databasesWithTables.push({
          name: db.name,
          error: error.message,
          tables: []
        });
      }
    }
    
    return NextResponse.json({ 
      databases: databasesWithTables
    });
  } catch (error) {
    console.error('Error exploring databases:', error);
    return NextResponse.json(
      { error: 'Failed to explore databases', details: error.message },
      { status: 500 }
    );
  }
} 