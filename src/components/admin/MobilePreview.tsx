
import { useState } from 'react';
import { ArrowLeft, BarChart3, Bell, Filter, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface MobilePreviewProps {
  onBack: () => void;
}

export const MobilePreview = ({ onBack }: MobilePreviewProps) => {
  const [selectedTab, setSelectedTab] = useState('dashboard');

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
          <p className="text-gray-600 mt-2">See how your dashboard looks on mobile devices</p>
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
                  <h1 className="text-lg font-semibold">Sales Performance</h1>
                  <p className="text-blue-100 text-sm">Updated 2 min ago</p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  {selectedTab === 'dashboard' && (
                    <div className="p-4 space-y-4">
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

                      {/* Chart */}
                      <Card className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-3">Revenue Trends</h3>
                        <div className="h-32 bg-gradient-to-t from-blue-100 to-transparent rounded flex items-end justify-around">
                          {[40, 65, 45, 80, 60, 75, 90].map((height, i) => (
                            <div 
                              key={i} 
                              className="bg-blue-500 w-6 rounded-t"
                              style={{ height: `${height}%` }}
                            />
                          ))}
                        </div>
                      </Card>

                      {/* Reports List */}
                      <Card className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-3">Reports</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-sm">Sales by Region</span>
                            <Download className="w-4 h-4 text-gray-500" />
                          </div>
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-sm">Top Products</span>
                            <Download className="w-4 h-4 text-gray-500" />
                          </div>
                        </div>
                      </Card>
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
