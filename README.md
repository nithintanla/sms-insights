# SMS Insights Dashboard

A real-time analytics and insights dashboard for SMS messaging data, powered by ClickHouse and Next.js.

## Features

- Real-time SMS message volume analytics
- Message delivery rate tracking
- Historical trend analysis
- Performance metrics

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Visualization:** Recharts
- **Data Storage:** ClickHouse Database
- **Authentication:** Next-Auth

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Access to ClickHouse database

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd sms-insights
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file with your configuration:

```
CLICKHOUSE_HOST=http://10.10.3.67:8123
CLICKHOUSE_USER=dlh_user
CLICKHOUSE_PASSWORD=12zBxmXf
CLICKHOUSE_DATABASE=default
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

The project structure follows Next.js conventions:

- `app/`: Next.js App Router pages and API routes
- `src/components/`: React components
- `src/lib/`: Utility functions and database connections

## License

[MIT License](LICENSE)
