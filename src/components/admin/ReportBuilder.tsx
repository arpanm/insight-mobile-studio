
import { useState } from 'react';
import { Database, JoinIcon, Filter, BarChart3, Save, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface ReportBuilderProps {
  onSave: () => void;
  onPreview: () => void;
}

export const ReportBuilder = ({ onSave, onPreview }: ReportBuilderProps) => {
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedChart, setSelectedChart] = useState('');
  const [reportName, setReportName] = useState('');

  const tables = [
    { value: 'sales', label: 'Sales Data' },
    { value: 'customers', label: 'Customer Data' },
    { value: 'products', label: 'Product Data' },
    { value: 'regions', label: 'Regional Data' }
  ];

  const chartTypes = [
    { value: 'bar', label: 'Bar Chart', icon: '📊' },
    { value: 'line', label: 'Line Chart', icon: '📈' },
    { value: 'pie', label: 'Pie Chart', icon: '🥧' },
    { value: 'table', label: 'Data Table', icon: '📋' },
    { value: 'gauge', label: 'Gauge Chart', icon: '⏱️' },
    { value: 'area', label: 'Area Chart', icon: '📉' }
  ];

  const aggregations = [
    { value: 'sum', label: 'Sum' },
    { value: 'avg', label: 'Average' },
    { value: 'count', label: 'Count' },
    { value: 'min', label: 'Minimum' },
    { value: 'max', label: 'Maximum' }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Report Builder</h1>
          <p className="text-gray-600 mt-2">Create custom reports with drag-and-drop interface</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onPreview}>
            <Eye className="w-5 h-5 mr-2" />
            Preview
          </Button>
          <Button onClick={onSave} className="bg-green-600 hover:bg-green-700">
            <Save className="w-5 h-5 mr-2" />
            Save Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Data Sources */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2 text-blue-600" />
            Data Sources
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Table
              </label>
              <Select value={selectedTable} onValueChange={setSelectedTable}>
                <SelectTrigger>
                  <SelectValue placeholder="Select table" />
                </SelectTrigger>
                <SelectContent>
                  {tables.map((table) => (
                    <SelectItem key={table.value} value={table.value}>
                      {table.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium text-gray-800 mb-3">Available Fields</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {['Revenue', 'Customer ID', 'Product Name', 'Region', 'Date', 'Quantity'].map((field) => (
                  <div key={field} className="p-2 bg-gray-50 rounded text-sm cursor-move hover:bg-gray-100 transition-colors">
                    {field}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Report Configuration */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
            Report Configuration
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Name
              </label>
              <Input 
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Enter report name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visualization Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {chartTypes.map((chart) => (
                  <button
                    key={chart.value}
                    onClick={() => setSelectedChart(chart.value)}
                    className={`p-4 border rounded-lg text-center transition-all ${
                      selectedChart === chart.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{chart.icon}</div>
                    <div className="text-sm font-medium">{chart.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  X-Axis Field
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="region">Region</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Y-Axis Field
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="quantity">Quantity</SelectItem>
                    <SelectItem value="profit">Profit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aggregation
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select aggregation" />
                </SelectTrigger>
                <SelectContent>
                  {aggregations.map((agg) => (
                    <SelectItem key={agg.value} value={agg.value}>
                      {agg.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Filters & Settings */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Filter className="w-5 h-5 mr-2 text-orange-600" />
            Filters & Settings
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Date Filters</h3>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7days">Last 7 days</SelectItem>
                  <SelectItem value="last30days">Last 30 days</SelectItem>
                  <SelectItem value="last3months">Last 3 months</SelectItem>
                  <SelectItem value="lastyear">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium text-gray-800 mb-3">Export Options</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm">Allow PDF export</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm">Allow Excel export</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Allow CSV export</span>
                </label>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium text-gray-800 mb-3">Refresh Settings</h3>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Auto-refresh" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5min">Every 5 minutes</SelectItem>
                  <SelectItem value="15min">Every 15 minutes</SelectItem>
                  <SelectItem value="1hour">Every hour</SelectItem>
                  <SelectItem value="manual">Manual only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
