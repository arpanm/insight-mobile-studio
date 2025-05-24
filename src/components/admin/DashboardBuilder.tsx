
import { useState } from 'react';
import { Plus, Settings, BarChart3, Eye, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface DashboardBuilderProps {
  dashboardId: string | null;
  onAddReport: () => void;
  onPreview: () => void;
}

export const DashboardBuilder = ({ dashboardId, onAddReport, onPreview }: DashboardBuilderProps) => {
  const [dashboardName, setDashboardName] = useState('Sales Performance Dashboard');
  const [dashboardDescription, setDashboardDescription] = useState('Track sales metrics, conversion rates, and revenue trends');

  const mockReports = [
    {
      id: '1',
      name: 'Revenue Trends',
      type: 'Line Chart',
      description: 'Monthly revenue trends over time'
    },
    {
      id: '2',
      name: 'Sales by Region',
      type: 'Bar Chart',
      description: 'Sales performance across different regions'
    },
    {
      id: '3',
      name: 'Top Products',
      type: 'Table',
      description: 'Best performing products by revenue'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Builder</h1>
          <p className="text-gray-600 mt-2">Design and configure your dashboard</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onPreview}
            className="px-6 py-3"
          >
            <Eye className="w-5 h-5 mr-2" />
            Preview
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 px-6 py-3">
            <Save className="w-5 h-5 mr-2" />
            Save Dashboard
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Dashboard Configuration */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-blue-600" />
              Dashboard Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dashboard Name
                </label>
                <Input 
                  value={dashboardName}
                  onChange={(e) => setDashboardName(e.target.value)}
                  placeholder="Enter dashboard name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea 
                  value={dashboardDescription}
                  onChange={(e) => setDashboardDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe your dashboard"
                />
              </div>

              <Separator />
              
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Access Control</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm">Role-based access</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm">Geography-based filters</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Hierarchy-based access</span>
                  </label>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Reports Section */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                Reports & Visualizations
              </h2>
              <Button 
                onClick={onAddReport}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Report
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockReports.map((report) => (
                <Card key={report.id} className="p-4 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">{report.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {report.type}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </Card>
              ))}
              
              {/* Add Report Placeholder */}
              <Card className="p-4 border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors cursor-pointer">
                <div 
                  className="flex flex-col items-center justify-center h-32 text-gray-500 hover:text-purple-600 transition-colors"
                  onClick={onAddReport}
                >
                  <Plus className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">Add New Report</span>
                </div>
              </Card>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
