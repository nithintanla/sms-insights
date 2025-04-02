'use client';

import React from 'react';
import Link from 'next/link';

export default function DashboardHeader() {
  return (
    <div className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">SMS Classification Analytics</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-gray-500 hover:text-gray-700"
            >
              Dashboard
            </Link>
            <Link
              href="/raw-data"
              className="text-gray-500 hover:text-gray-700"
            >
              Raw Data
            </Link>
            <Link
              href="/data-test"
              className="text-gray-500 hover:text-gray-700"
            >
              Data Test
            </Link>
            <Link
              href="/debug"
              className="text-gray-500 hover:text-gray-700"
            >
              Debug
            </Link>
            <span className="ml-3 inline-flex rounded-md">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => window.location.reload()}
              >
                Refresh Data
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 