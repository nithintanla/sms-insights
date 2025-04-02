'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

type ClassificationData = {
  date: string;
  classification_name: string;
  message_count: number;
  classification_type: string;
};

type ProcessedData = {
  name: string;
  [key: string]: string | number;
};

type ClassificationChartProps = {
  data: ClassificationData[];
};

export default function ClassificationChart({ data }: ClassificationChartProps) {
  // Process data for visualization - group by classification_name
  const processData = (): ProcessedData[] => {
    const groupedByDay: { [key: string]: ProcessedData } = {};
    
    data.forEach(item => {
      const dayKey = format(parseISO(item.date), 'MMM dd');
      
      if (!groupedByDay[dayKey]) {
        groupedByDay[dayKey] = { name: dayKey };
      }
      
      // Use classification_name as the key for the count
      groupedByDay[dayKey][item.classification_name] = item.message_count;
    });
    
    return Object.values(groupedByDay);
  };
  
  // Get unique classification names
  const getClassificationNames = (): string[] => {
    const names = new Set<string>();
    data.forEach(item => names.add(item.classification_name));
    return Array.from(names);
  };
  
  const processedData = processData();
  const classificationNames = getClassificationNames();
  
  // Create a color map for the bars
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'];
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900 mb-4">SMS Classification Distribution</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={processedData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {classificationNames.map((name, index) => (
              <Bar 
                key={name}
                dataKey={name} 
                fill={colors[index % colors.length]}
                stackId="a"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 