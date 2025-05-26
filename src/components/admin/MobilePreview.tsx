
import { useState } from 'react';
import { ArrowLeft, BarChart3, Bell, Filter, Download, RefreshCw, Target, TrendingUp, PieChart, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface MobilePreviewProps {
  onBack: () => void;
}

interface Dashboard {
  id: string;
  name: string;
  reports: Report[];
}

interface Report {
  id: string;
  name: string;
  type: 'bar' | 'line' | 'pie' | 'table';
  hasDrillDown: boolean;
  data: any[];
}

export const MobilePreview = ({ onBack }: MobilePreviewProps) => {
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [selectedDashboard, setSelectedDashboard] = useState('sales');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [drillDownData, setDrillDownData] = useState<any>(null);

  const dashboards: Dashboard[] = [
    {
      id: 'sales',
      name: 'Sales Performance',
      reports: [
        {
          id: 'revenue-trend',
          name: 'Revenue Trends',
          type: 'line',
          hasDrillDown: true,
          data: [40, 65, 45, 80, 60, 75, 90]
        },
        {
          id: 'product-sales',
          name: 'Product Sales',
          type: 'bar',
          hasDrillDown: true,
          data: [30, 50, 35, 70, 45, 60, 80]
        }
      ]
    },
    {
      id: 'customers',
      name: 'Customer Analytics',
      reports: [
        {
          id: 'customer-segments',
          name: 'Customer Segments',
          type: 'pie',
          hasDrillDown: false,
          data: [25, 35, 20, 20]
        },
        {
          id: 'customer-list',
          name: 'Top Customers',
          type: 'table',
          hasDrillDown: true,
          data: [
            { name: 'John Doe', revenue: '$12,500', orders: 15 },
            { name: 'Jane Smith', revenue: '$9,800', orders: 12 },
            { name: 'Bob Johnson', revenue: '$8,750', orders: 9 }
          ]
        }
      ]
    },
    {
      id: 'operations',
      name: 'Operations Dashboard',
      reports: [
        {
          id: 'efficiency-metrics',
          name: 'Efficiency Metrics',
          type: 'bar',
          hasDrillDown: false,
          data: [85, 92, 78, 88, 95, 82, 90]
        }
      ]
    }
  ];

  const mockNotifications = [
    {
      id: '1',
      title: 'Revenue Target Met',
      message: 'Monthly revenue exceeded $75,000',
      time: '2 min ago',
      type: 'success'
    },
    {
      id: '2',
      title: 'Low Conversion Alert',
      message: 'Conversion rate dropped below 2%',
      time: '5 min ago',
      type: 'warning'
    }
  ];

  const currentDashboard = dashboards.find(d => d.id === selectedDashboard) || dashboards[0];

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
  };

  const handleDrillDown = (dataPoint: any) => {
    setDrillDownData(dataPoint);
  };

  const renderChart = (report: Report) => {
    switch (report.type) {
      case 'line':
        return (
          <div className="h-20 bg-gradient-to-t from-blue-100 to-transparent rounded flex items-end justify-around">
            {report.data.map((height, i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className="bg-blue-500 w-1 rounded-t cursor-pointer"
                  style={{ height: `${height * 0.6}%` }}
                  onClick={() => report.hasDrillDown && handleDrillDown({ period: `Week ${i+1}`, value: height })}
                />
                <div className="w-1 h-1 bg-blue-600 rounded-full mt-1" />
              </div>
            ))}
          </div>
        );
      
      case 'bar':
        return (
          <div className="h-20 bg-gradient-to-t from-green-100 to-transparent rounded flex items-end justify-around">
            {report.data.map((height, i) => (
              <div 
                key={i} 
                className="bg-green-500 w-4 rounded-t cursor-pointer"
                style={{ height: `${height}%` }}
                onClick={() => report.hasDrillDown && handleDrillDown({ category: `Cat ${i+1}`, value: height })}
              />
            ))}
          </div>
        );
      
      case 'pie':
        return (
          <div className="h-20 flex items-center justify-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400" />
              <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                <PieChart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        );
      
      case 'table':
        return (
          <div className="space-y-1">
            {report.data.slice(0, 3).map((row: any, i) => (
              <div 
                key={i} 
                className="flex justify-between text-xs p-1 bg-gray-50 rounded cursor-pointer"
                onClick={() => report.hasDrillDown && handleDrillDown(row)}
              >
                <span className="truncate">{row.name}</span>
                <span className="text-green-600">{row.revenue}</span>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button variant="outline" onClick={onBack} className="mr-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Builder
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Mobile Preview</h1>
          <p className="text-gray-600 mt-2">See how your dashboards look on mobile devices</p>
        </div>
      </div>

      <div className="flex justify-center">
        {/* Mobile Frame */}
        <div className="relative">
          {/* Phone Frame */}
          <div className="w-80 h-[640px] bg-black rounded-[3rem] p-2 shadow-2xl">
            <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden flex flex-col">
              {/* Status Bar */}
              <div className="bg-gray-900 text-white px-6 py-3 text-center">
                <div className="flex justify-between items-center text-sm">
                  <span>9:41</span>
                  <span className="font-semibold">BI Dashboard</span>
                  <span>100%</span>
                </div>
              </div>

              {/* App Content */}
              <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-blue-600 text-white p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-lg font-semibold">{currentDashboard.name}</h1>
                      <p className="text-blue-100 text-sm">Updated 2 min ago</p>
                    </div>
                    {selectedReport && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-white border-white"
                        onClick={() => setSelectedReport(null)}
                      >
                        Back
                      </Button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  {selectedTab === 'dashboard' && (
                    <div className="p-4 space-y-4">
                      {!selectedReport ? (
                        <>
                          {/* Dashboard Selector */}
                          <div className="flex space-x-2 mb-4">
                            {dashboards.map((dashboard) => (
                              <button
                                key={dashboard.id}
                                onClick={() => setSelectedDashboard(dashboard.id)}
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  selectedDashboard === dashboard.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700'
                                }`}
                              >
                                {dashboard.name.split(' ')[0]}
                              </button>
                            ))}
                          </div>

                          {/* KPI Cards */}
                          <div className="grid grid-cols-2 gap-3">
                            <Card className="p-3 bg-gradient-to-r from-green-500 to-green-600 text-white">
                              <div className="text-2xl font-bold">$78.5K</div>
                              <div className="text-green-100 text-sm">Revenue</div>
                            </Card>
                            <Card className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                              <div className="text-2xl font-bold">156</div>
                              <div className="text-blue-100 text-sm">Orders</div>
                            </Card>
                          </div>

                          {/* Reports */}
                          <div className="space-y-3">
                            {currentDashboard.reports.map((report) => (
                              <Card key={report.id} className="p-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h3 className="font-semibold text-gray-800 text-sm">{report.name}</h3>
                                  <div className="flex items-center space-x-1">
                                    {report.hasDrillDown && (
                                      <Target className="w-3 h-3 text-blue-500" />
                                    )}
                                    <button
                                      onClick={() => handleReportClick(report)}
                                      className="text-blue-600 text-xs"
                                    >
                                      View
                                    </button>
                                  </div>
                                </div>
                                {renderChart(report)}
                              </Card>
                            ))}
                          </div>
                        </>
                      ) : (
                        /* Selected Report Detail */
                        <div className="p-4 space-y-4">
                          <div className="flex justify-between items-center">
                            <h2 className="font-semibold text-gray-800">{selectedReport.name}</h2>
                            {selectedReport.hasDrillDown && (
                              <span className="text-xs text-blue-600">Click data points to drill down</span>
                            )}
                          </div>
                          
                          <Card className="p-4">
                            <div className="h-32">
                              {renderChart(selectedReport)}
                            </div>
                          </Card>

                          {drillDownData && (
                            <Card className="p-4">
                              <h3 className="font-medium text-gray-800 mb-2">Drill-Down Details</h3>
                              <div className="space-y-1 text-sm">
                                {Object.entries(drillDownData).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="text-gray-600 capitalize">{key}:</span>
                                    <span>{String(value)}</span>
                                  </div>
                                ))}
                              </div>
                            </Card>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {selectedTab === 'alerts' && (
                    <div className="p-4">
                      <h2 className="font-semibold text-gray-800 mb-4">Recent Alerts</h2>
                      <div className="space-y-3">
                        {mockNotifications.map((notification) => (
                          <Card key={notification.id} className="p-3">
                            <div className="flex items-start">
                              <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                                notification.type === 'success' ? 'bg-green-500' : 'bg-orange-500'
                              }`} />
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-800 text-sm">
                                  {notification.title}
                                </h3>
                                <p className="text-gray-600 text-xs mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-gray-400 text-xs mt-1">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Navigation */}
                <div className="border-t border-gray-200 bg-white">
                  <div className="flex">
                    <button 
                      onClick={() => setSelectedTab('dashboard')}
                      className={`flex-1 p-4 text-center ${
                        selectedTab === 'dashboard' 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-500'
                      }`}
                    >
                      <BarChart3 className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-xs">Dashboard</span>
                    </button>
                    <button 
                      onClick={() => setSelectedTab('alerts')}
                      className={`flex-1 p-4 text-center ${
                        selectedTab === 'alerts' 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-500'
                      }`}
                    >
                      <Bell className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-xs">Alerts</span>
                    </button>
                    <button className="flex-1 p-4 text-center text-gray-500">
                      <Filter className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-xs">Filters</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Refresh Button */}
          <Button 
            className="absolute -right-16 top-4 bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
