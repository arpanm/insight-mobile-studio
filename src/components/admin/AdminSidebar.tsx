
import { 
  LayoutDashboard, 
  BarChart3, 
  Bell, 
  Smartphone, 
  Settings,
  Plus,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminView } from '@/pages/Index';

interface AdminSidebarProps {
  activeView: AdminView;
  onViewChange: (view: AdminView) => void;
  selectedDashboard: string | null;
}

export const AdminSidebar = ({ activeView, onViewChange, selectedDashboard }: AdminSidebarProps) => {
  const menuItems = [
    {
      id: 'dashboards' as AdminView,
      label: 'Dashboards',
      icon: LayoutDashboard,
      color: 'text-blue-600'
    },
    {
      id: 'dashboard-builder' as AdminView,
      label: 'Dashboard Builder',
      icon: Plus,
      color: 'text-green-600',
      disabled: false
    },
    {
      id: 'report-builder' as AdminView,
      label: 'Report Builder',
      icon: BarChart3,
      color: 'text-purple-600'
    },
    {
      id: 'alert-builder' as AdminView,
      label: 'Alert Builder',
      icon: Bell,
      color: 'text-orange-600'
    },
    {
      id: 'preview' as AdminView,
      label: 'Mobile Preview',
      icon: Smartphone,
      color: 'text-pink-600'
    }
  ];

  return (
    <div className="w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">BI Admin Panel</h1>
        <p className="text-sm text-gray-500 mt-1">Self-Service Analytics</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={cn(
                    "w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 group",
                    isActive 
                      ? "bg-blue-50 text-blue-700 shadow-sm" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  )}
                >
                  <Icon 
                    className={cn(
                      "w-5 h-5 mr-3 transition-colors",
                      isActive ? item.color : "text-gray-400 group-hover:text-gray-600"
                    )} 
                  />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <Settings className="w-5 h-5 mr-3" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};
