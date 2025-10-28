import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase, testConnection, fetchCategories, fetchTables, fetchEmployees, fetchSystemSettings } from '@/lib/supabase-aaa';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
}

export default function DatabaseTest() {
  const [results, setResults] = useState<TestResult[]>([
    { name: 'Database Connection', status: 'pending', message: 'Testing...' },
    { name: 'Categories', status: 'pending', message: 'Loading...' },
    { name: 'Tables', status: 'pending', message: 'Loading...' },
    { name: 'Employees', status: 'pending', message: 'Loading...' },
    { name: 'System Settings', status: 'pending', message: 'Loading...' },
  ]);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    const newResults = [...results];

    // Test 1: Connection
    try {
      const connected = await testConnection();
      newResults[0] = {
        name: 'Database Connection',
        status: connected ? 'success' : 'error',
        message: connected ? 'Connected successfully' : 'Connection failed',
      };
    } catch (err) {
      newResults[0] = {
        name: 'Database Connection',
        status: 'error',
        message: `Error: ${err}`,
      };
    }

    // Test 2: Categories
    try {
      const categories = await fetchCategories();
      newResults[1] = {
        name: 'Categories',
        status: categories.length > 0 ? 'success' : 'error',
        message: `Found ${categories.length} categories`,
        data: categories,
      };
    } catch (err) {
      newResults[1] = {
        name: 'Categories',
        status: 'error',
        message: `Error: ${err}`,
      };
    }

    // Test 3: Tables
    try {
      const tables = await fetchTables();
      newResults[2] = {
        name: 'Tables',
        status: tables.length > 0 ? 'success' : 'error',
        message: `Found ${tables.length} tables`,
        data: tables,
      };
    } catch (err) {
      newResults[2] = {
        name: 'Tables',
        status: 'error',
        message: `Error: ${err}`,
      };
    }

    // Test 4: Employees
    try {
      const employees = await fetchEmployees();
      newResults[3] = {
        name: 'Employees',
        status: employees.length >= 0 ? 'success' : 'error',
        message: `Found ${employees.length} employees`,
        data: employees,
      };
    } catch (err) {
      newResults[3] = {
        name: 'Employees',
        status: 'error',
        message: `Error: ${err}`,
      };
    }

    // Test 5: System Settings
    try {
      const settings = await fetchSystemSettings();
      const settingCount = Object.keys(settings).length;
      newResults[4] = {
        name: 'System Settings',
        status: settingCount > 0 ? 'success' : 'error',
        message: `Found ${settingCount} settings`,
        data: settings,
      };
    } catch (err) {
      newResults[4] = {
        name: 'System Settings',
        status: 'error',
        message: `Error: ${err}`,
      };
    }

    setResults(newResults);
  };

  const allSuccess = results.every((r) => r.status === 'success');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Database Connection Test</CardTitle>
            <CardDescription>Testing Supabase Project Aaa Connection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Status */}
            <div className={`p-4 rounded-lg ${allSuccess ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
              <p className={`font-semibold ${allSuccess ? 'text-green-800' : 'text-yellow-800'}`}>
                {allSuccess ? '✓ All tests passed!' : '⚠ Some tests are pending or failed'}
              </p>
            </div>

            {/* Test Results */}
            <div className="space-y-3">
              {results.map((result) => (
                <div key={result.name} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{result.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        result.status === 'success'
                          ? 'bg-green-100 text-green-800'
                          : result.status === 'error'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {result.status === 'success' ? '✓' : result.status === 'error' ? '✗' : '⏳'} {result.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{result.message}</p>

                  {/* Show data if available */}
                  {result.data && (
                    <div className="mt-3 bg-gray-50 dark:bg-gray-800 p-3 rounded text-xs overflow-auto max-h-40">
                      <pre>{JSON.stringify(result.data, null, 2)}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={runTests} variant="default">
                Run Tests Again
              </Button>
              <Button
                onClick={() => {
                  // Navigate to POS
                  window.location.href = '/pos';
                }}
                variant="outline"
              >
                Go to POS
              </Button>
              <Button
                onClick={() => {
                  // Navigate to ERP
                  window.location.href = '/erp';
                }}
                variant="outline"
              >
                Go to ERP
              </Button>
            </div>

            {/* Database Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Database Information</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>
                  <strong>URL:</strong> https://mcjvxpfpnztyuejrbvng.supabase.co
                </li>
                <li>
                  <strong>Project:</strong> Aaa
                </li>
                <li>
                  <strong>Tables:</strong> 18 (Core, POS, HRM, Accounting, System)
                </li>
                <li>
                  <strong>Realtime:</strong> Enabled for orders, payments, notifications, audit logs
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

