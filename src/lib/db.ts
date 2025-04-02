import { createClient } from '@clickhouse/client';

// Print configuration for debugging
const url = process.env.CLICKHOUSE_HOST || 'http://10.10.3.67:8123';
const username = process.env.CLICKHOUSE_USER || 'dlh_user';
const password = process.env.CLICKHOUSE_PASSWORD || '12zBxmXf';
const database = process.env.CLICKHOUSE_DATABASE || 'insights';

console.log('ClickHouse Connection Config:');
console.log(`URL: ${url}`);
console.log(`Username: ${username}`);
console.log(`Database: ${database}`);

// ClickHouse database connection configuration
const clickhouseClient = createClient({
  url,  // Using url instead of host
  username,
  password,
  database,
  request_timeout: 30000, // Longer timeout for queries
  compression: {
    response: true, // Enable response compression
  }
});

// Enable debug info
try {
  console.log('Testing ClickHouse connection...');
  clickhouseClient.ping().then(() => {
    console.log('ClickHouse connection successful');
  }).catch((error) => {
    console.error('ClickHouse connection failed:', error);
  });
} catch (error) {
  console.error('Error testing ClickHouse connection:', error);
}

export default clickhouseClient;