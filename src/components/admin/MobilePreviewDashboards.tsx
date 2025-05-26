
import { useState } from 'react';
import { Smartphone, BarChart3, Users, ShoppingCart, Target, TrendingUp, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export const MobilePreviewDashboards = () => {
  const [selectedDataPoint, setSelectedDataPoint] = useState<any>(null);

  // Sample data for different charts
  const salesData = [
    { month: 'Jan', revenue: 4000, orders: 24 },
    { month: 'Feb', revenue: 3000, orders: 22 },
    { month: 'Mar', revenue: 5000, orders: 29 },
    { month: 'Apr', revenue: 4500, orders: 20 },
  ];

  const pieData = [
    { name: 'Electronics', value: 35, fill: '#8884d8' },
    { name: 'Clothing', value: 25, fill: '#82ca9d' },
    { name: 'Books', value: 20, fill: '#ffc658' },
    { name: 'Others', value: 20, fill: '#ff7c7c' },
  ];

  const customerData = [
    { region: 'North', customers: 150 },
    { region: 'South', customers: 120 },
    { region: 'East', customers: 180 },
    { region: 'West', customers: 90 },
  ];

  const handleDrillDown = (data: any, reportName: string) => {
    setSelectedDataPoint({ ...data, reportName });
    console.log('Drill-down triggered for:', reportName, data);
  };

  return (
    <div className="max-w-sm mx-auto border-8 border-gray-800 rounded-3xl bg-gray-800 p-2">
      <div className="bg-white rounded-2xl h-[600px] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold">Dashboard</h1>
            <Smartphone className="w-5 h-5" />
          </div>
        </div>

        <Tabs defaultValue="overview" className="h-full">
          <TabsList className="grid w-full grid-cols-3 px-2 py-1">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="sales" className="text-xs">Sales</TabsTrigger>
            <TabsTrigger value="customers" className="text-xs">Customers</TabsTrigger>
          </TabsList>

          {/* Overview Dashboard */}
          <TabsContent value="overview" className="p-4 space-y-4 h-full overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Total Revenue</p>
                    <p className="text-lg font-bold">$12.5K</p>
                  </div>
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Orders</p>
                    <p className="text-lg font-bold">156</p>
                  </div>
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
              </Card>
            </div>

            {/* Revenue Trend Chart with Drill-down */}
            <Card className="p-3">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                Revenue Trend
                <Target className="w-3 h-3 ml-2 text-red-500" />
              </h3>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={salesData}>
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 3 }}
                    activeDot={{ 
                      r: 5, 
                      onClick: (data) => handleDrillDown(data.payload, 'Revenue Trend')
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-blue-600 mt-1">💡 Tap data points for details</p>
            </Card>

            {/* Category Distribution */}
            <Card className="p-3">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <BarChart3 className="w-4 h-4 mr-1" />
                Category Sales
              </h3>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={50}
                    dataKey="value"
                    onClick={(data) => handleDrillDown(data, 'Category Sales')}
                    style={{ cursor: 'pointer' }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {selectedDataPoint && (
              <Card className="p-3 bg-blue-50 border-blue-200">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Drill-down Details</h4>
                <p className="text-xs text-blue-600">Report: {selectedDataPoint.reportName}</p>
                <div className="text-xs mt-1">
                  {Object.entries(selectedDataPoint).map(([key, value]) => 
                    key !== 'reportName' && (
                      <div key={key} className="flex justify-between">
                        <span>{key}:</span>
                        <span>{String(value)}</span>
                      </div>
                    )
                  )}
                </div>
                <Button 
                  size="sm" 
                  className="w-full mt-2 h-6 text-xs"
                  onClick={() => setSelectedDataPoint(null)}
                >
                  View Full Report
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Sales Dashboard */}
          <TabsContent value="sales" className="p-4 space-y-4 h-full overflow-y-auto">
            <Card className="p-3">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <BarChart3 className="w-4 h-4 mr-1" />
                Monthly Sales
                <Target className="w-3 h-3 ml-2 text-red-500" />
              </h3>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={salesData}>
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Bar 
                    dataKey="revenue" 
                    fill="#8884d8"
                    onClick={(data) => handleDrillDown(data, 'Monthly Sales')}
                    style={{ cursor: 'pointer' }}
                  />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-blue-600 mt-1">💡 Tap bars for regional breakdown</p>
            </Card>

            <Card className="p-3">
              <h3 className="text-sm font-medium mb-2">Order Volume</h3>
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={salesData}>
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 text-center">
                <p className="text-2xl font-bold text-green-600">$5.2K</p>
                <p className="text-xs text-gray-600">Avg. Monthly</p>
              </Card>
              <Card className="p-3 text-center">
                <p className="text-2xl font-bold text-orange-600">23.5%</p>
                <p className="text-xs text-gray-600">Growth Rate</p>
              </Card>
            </div>
          </TabsContent>

          {/* Customers Dashboard */}
          <TabsContent value="customers" className="p-4 space-y-4 h-full overflow-y-auto">
            <Card className="p-3">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Users className="w-4 h-4 mr-1" />
                Customer Distribution
                <Target className="w-3 h-3 ml-2 text-red-500" />
              </h3>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={customerData}>
                  <XAxis dataKey="region" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Bar 
                    dataKey="customers" 
                    fill="#ffc658"
                    onClick={(data) => handleDrillDown(data, 'Customer Distribution')}
                    style={{ cursor: 'pointer' }}
                  />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-blue-600 mt-1">💡 Tap regions for customer details</p>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 text-center">
                <p className="text-2xl font-bold text-blue-600">540</p>
                <p className="text-xs text-gray-600">Total Customers</p>
              </Card>
              <Card className="p-3 text-center">
                <p className="text-2xl font-bold text-purple-600">89%</p>
                <p className="text-xs text-gray-600">Satisfaction</p>
              </Card>
            </div>

            <Card className="p-3">
              <h3 className="text-sm font-medium mb-2">Customer Segments</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs">Premium</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                    <span className="text-xs">35%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">Standard</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <span className="text-xs">45%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">Basic</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                    <span className="text-xs">20%</span>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
