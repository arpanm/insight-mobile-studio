
import { Plus, Edit2, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DashboardListProps {
  onCreateDashboard: () => void;
  onEditDashboard: (id: string) => void;
}

export const DashboardList = ({ onCreateDashboard, onEditDashboard }: DashboardListProps) => {
  const dashboards = [
    {
      id: '1',
      name: 'Sales Performance Dashboard',
      description: 'Track sales metrics, conversion rates, and revenue trends',
      reports: 5,
      lastModified: '2 hours ago',
      status: 'Active'
    },
    {
      id: '2',
      name: 'Customer Analytics',
      description: 'Customer behavior, retention, and satisfaction metrics',
      reports: 8,
      lastModified: '1 day ago',
      status: 'Active'
    },
    {
      id: '3',
      name: 'Operational KPIs',
      description: 'Operational efficiency and performance indicators',
      reports: 12,
      lastModified: '3 days ago',
      status: 'Draft'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboards</h1>
          <p className="text-gray-600 mt-2">Create and manage your business intelligence dashboards</p>
        </div>
        <Button 
          onClick={onCreateDashboard}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Dashboard
        </Button>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboards.map((dashboard) => (
          <Card key={dashboard.id} className="p-6 hover:shadow-lg transition-shadow duration-200 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{dashboard.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{dashboard.description}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                dashboard.status === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {dashboard.status}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
              <span>{dashboard.reports} reports</span>
              <span>Modified {dashboard.lastModified}</span>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEditDashboard(dashboard.id)}
                className="flex-1"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
