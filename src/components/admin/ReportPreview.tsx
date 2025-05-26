
import { useState } from 'react';
import { ArrowLeft, Download, RefreshCw, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface ReportPreviewProps {
  reportName: string;
  chartType: string;
  chartConfig: any;
  selectedTables: any[];
  joinRules: any[];
  filterRules: any[];
  drillDownRules: any[];
  sqlQuery: string;
  onBack: () => void;
  onSave: () => void;
}

export const ReportPreview = ({
  reportName,
  chartType,
  chartConfig,
  selectedTables,
  joinRules,
  filterRules,
  drillDownRules,
  sqlQuery,
  onBack,
  onSave
}: ReportPreviewProps) => {
  const [selectedDataPoint, setSelectedDataPoint] = useState<any>(null);

  // Mock data for demonstration
  const sampleData = [
    { name: 'Jan', revenue: 4000, customers: 240, orders: 24 },
    { name: 'Feb', revenue: 3000, customers: 139, orders: 22 },
    { name: 'Mar', revenue: 2000, customers: 980, orders: 29 },
    { name: 'Apr', revenue: 2780, customers: 390, orders: 20 },
    { name: 'May', revenue: 1890, customers: 480, orders: 21 },
    { name: 'Jun', revenue: 2390, customers: 380, orders: 25 },
  ];

  const pieData = [
    { name: 'Electronics', value: 35, fill: '#8884d8' },
    { name: 'Clothing', value: 25, fill: '#82ca9d' },
    { name: 'Books', value: 20, fill: '#ffc658' },
    { name: 'Home & Garden', value: 15, fill: '#ff7c7c' },
    { name: 'Sports', value: 5, fill: '#8dd1e1' },
  ];

  const tableData = [
    { id: 1, customer: 'John Doe', revenue: 1200, orders: 5, region: 'North' },
    { id: 2, customer: 'Jane Smith', revenue: 980, orders: 3, region: 'South' },
    { id: 3, customer: 'Bob Johnson', revenue: 1500, orders: 7, region: 'East' },
    { id: 4, customer: 'Alice Brown', revenue: 800, orders: 2, region: 'West' },
    { id: 5, customer: 'Charlie Wilson', revenue: 1100, orders: 4, region: 'North' },
  ];

  const chartColorConfig = {
    revenue: { label: 'Revenue', color: '#8884d8' },
    customers: { label: 'Customers', color: '#82ca9d' },
    orders: { label: 'Orders', color: '#ffc658' },
  };

  const handleDrillDown = (dataPoint: any) => {
    setSelectedDataPoint(dataPoint);
    console.log('Drill-down triggered for:', dataPoint);
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ChartContainer config={chartColorConfig} className="h-[400px]">
            <BarChart data={sampleData}>
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              {chartConfig.showLegend && <ChartLegend content={<ChartLegendContent />} />}
              <Bar 
                dataKey="revenue" 
                fill="var(--color-revenue)" 
                onClick={handleDrillDown}
                style={{ cursor: drillDownRules.length > 0 ? 'pointer' : 'default' }}
              />
              {chartConfig.stacked && (
                <Bar dataKey="customers" fill="var(--color-customers)" stackId="a" />
              )}
            </BarChart>
          </ChartContainer>
        );

      case 'line':
        return (
          <ChartContainer config={chartColorConfig} className="h-[400px]">
            <LineChart data={sampleData}>
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              {chartConfig.showLegend && <ChartLegend content={<ChartLegendContent />} />}
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="var(--color-revenue)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-revenue)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, onClick: handleDrillDown }}
              />
            </LineChart>
          </ChartContainer>
        );

      case 'area':
        return (
          <ChartContainer config={chartColorConfig} className="h-[400px]">
            <AreaChart data={sampleData}>
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              {chartConfig.showLegend && <ChartLegend content={<ChartLegendContent />} />}
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="var(--color-revenue)" 
                fill="var(--color-revenue)" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ChartContainer>
        );

      case 'pie':
        return (
          <ChartContainer config={chartColorConfig} className="h-[400px]">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="value"
                onClick={handleDrillDown}
                style={{ cursor: drillDownRules.length > 0 ? 'pointer' : 'default' }}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              {chartConfig.showLegend && <ChartLegend content={<ChartLegendContent />} />}
            </PieChart>
          </ChartContainer>
        );

      case 'gauge':
        return (
          <div className="h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                <div className="absolute inset-0 rounded-full border-8 border-blue-500 border-t-transparent transform rotate-45"></div>
                <div className="absolute inset-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">75%</div>
                    <div className="text-sm text-gray-500">Performance</div>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">Current Value: 75 out of 100</p>
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="h-[400px] overflow-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(tableData[0]).map((header) => (
                    <th key={header} className="border border-gray-300 px-4 py-2 text-left font-medium">
                      {header.charAt(0).toUpperCase() + header.slice(1)}
                    </th>
                  ))}
                  {drillDownRules.length > 0 && (
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {tableData.slice(0, chartConfig.maxItems || tableData.length).map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {Object.entries(row).map(([key, value]) => (
                      <td key={key} className="border border-gray-300 px-4 py-2">
                        {value}
                      </td>
                    ))}
                    {drillDownRules.length > 0 && (
                      <td className="border border-gray-300 px-4 py-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDrillDown(row)}
                        >
                          <Target className="w-3 h-3 mr-1" />
                          Drill Down
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return (
          <div className="h-[400px] flex items-center justify-center text-gray-500">
            Select a visualization type to see the preview
          </div>
        );
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Builder
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{reportName || 'Report Preview'}</h1>
            <p className="text-gray-600 mt-1">Chart Type: {chartType.charAt(0).toUpperCase() + chartType.slice(1)}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={onSave} className="bg-green-600 hover:bg-green-700">
            Save Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-3 p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Data Visualization</h2>
            {drillDownRules.length > 0 && (
              <p className="text-sm text-blue-600 mb-4">
                💡 Click on data points to drill down for more details
              </p>
            )}
          </div>
          {renderChart()}
        </Card>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Configuration Summary */}
          <Card className="p-4">
            <h3 className="font-medium text-gray-800 mb-3">Configuration</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Chart Type:</span>
                <span className="capitalize">{chartType}</span>
              </div>
              {chartConfig.xAxis && (
                <div className="flex justify-between">
                  <span className="text-gray-600">X-Axis:</span>
                  <span>{chartConfig.xAxis}</span>
                </div>
              )}
              {chartConfig.yAxis && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Y-Axis:</span>
                  <span>{chartConfig.yAxis}</span>
                </div>
              )}
              {chartConfig.aggregation && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Aggregation:</span>
                  <span className="capitalize">{chartConfig.aggregation}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Drill-down Rules */}
          {drillDownRules.length > 0 && (
            <Card className="p-4">
              <h3 className="font-medium text-gray-800 mb-3">Drill-Down Available</h3>
              <div className="space-y-2">
                {drillDownRules.map((rule) => (
                  <div key={rule.id} className="text-sm p-2 bg-blue-50 rounded">
                    <div className="font-medium text-blue-800">{rule.label}</div>
                    <div className="text-blue-600 text-xs">
                      {rule.fromColumn} → {rule.toTable}.{rule.toColumn}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Selected Data Point */}
          {selectedDataPoint && (
            <Card className="p-4">
              <h3 className="font-medium text-gray-800 mb-3">Selected Data Point</h3>
              <div className="space-y-1 text-sm">
                {Object.entries(selectedDataPoint).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 capitalize">{key}:</span>
                    <span>{String(value)}</span>
                  </div>
                ))}
              </div>
              {drillDownRules.length > 0 && (
                <Button size="sm" className="w-full mt-3">
                  <Target className="w-3 h-3 mr-1" />
                  View Details
                </Button>
              )}
            </Card>
          )}

          {/* Data Source Info */}
          <Card className="p-4">
            <h3 className="font-medium text-gray-800 mb-3">Data Sources</h3>
            <div className="space-y-1 text-sm">
              {selectedTables.map((table) => (
                <div key={table.id} className="flex justify-between">
                  <span className="text-gray-600">{table.alias}:</span>
                  <span>{table.selectedColumns.length} columns</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
