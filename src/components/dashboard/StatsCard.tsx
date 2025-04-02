'use client';

import React from 'react';

type StatsCardProps = {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease';
  icon?: React.ReactNode;
};

export default function StatsCard({ title, value, change, changeType, icon }: StatsCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          {icon && (
            <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
              {icon}
            </div>
          )}
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
              {change && (
                <dd className="flex items-baseline">
                  <p
                    className={`text-sm font-semibold ${
                      changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {change}
                  </p>
                </dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
} 