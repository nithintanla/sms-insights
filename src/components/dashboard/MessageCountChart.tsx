'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

type MessageData = {
  date: string;
  message_count: number;
};

type MessageCountChartProps = {
  data: MessageData[];
};

export default function MessageCountChart({ data }: MessageCountChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900 mb-4">SMS Message Volume</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date"
              tickFormatter={(str) => {
                const date = parseISO(str);
                return format(date, 'MMM dd');
              }}
            />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [new Intl.NumberFormat().format(value), 'Messages']}
              labelFormatter={(label) => format(parseISO(label), 'MMMM dd, yyyy')}
            />
            <Area type="monotone" dataKey="message_count" stroke="#6366F1" fill="#C7D2FE" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 