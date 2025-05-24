
import { useState } from 'react';
import { Bell, AlertTriangle, TrendingUp, TrendingDown, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface AlertBuilderProps {
  onSave: () => void;
}

export const AlertBuilder = ({ onSave }: AlertBuilderProps) => {
  const [alertName, setAlertName] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('');
  const [condition, setCondition] = useState('');
  const [threshold, setThreshold] = useState('');

  const metrics = [
    { value: 'revenue', label: 'Total Revenue' },
    { value: 'orders', label: 'Number of Orders' },
    { value: 'conversion', label: 'Conversion Rate' },
    { value: 'customers', label: 'New Customers' }
  ];

  const conditions = [
    { value: 'greater', label: 'Greater than', icon: TrendingUp },
    { value: 'less', label: 'Less than', icon: TrendingDown },
    { value: 'equal', label: 'Equal to', icon: AlertTriangle },
    { value: 'change', label: 'Change by %', icon: TrendingUp }
  ];

  const frequencies = [
    { value: 'realtime', label: 'Real-time' },
    { value: '5min', label: 'Every 5 minutes' },
    { value: '15min', label: 'Every 15 minutes' },
    { value: '1hour', label: 'Hourly' },
    { value: 'daily', label: 'Daily' }
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Alert Builder</h1>
          <p className="text-gray-600 mt-2">Create SLA alerts and KPI notifications</p>
        </div>
        <Button onClick={onSave} className="bg-orange-600 hover:bg-orange-700">
          <Save className="w-5 h-5 mr-2" />
          Save Alert
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Alert Configuration */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-orange-600" />
            Alert Configuration
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alert Name
              </label>
              <Input 
                value={alertName}
                onChange={(e) => setAlertName(e.target.value)}
                placeholder="e.g., Low Revenue Alert"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metric to Monitor
              </label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger>
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  {metrics.map((metric) => (
                    <SelectItem key={metric.value} value={metric.value}>
                      {metric.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((cond) => {
                      const IconComponent = cond.icon;
                      return (
                        <SelectItem key={cond.value} value={cond.value}>
                          <div className="flex items-center">
                            <IconComponent className="w-4 h-4 mr-2" />
                            {cond.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Threshold Value
                </label>
                <Input 
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  placeholder="Enter value"
                  type="number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check Frequency
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium text-gray-800 mb-3">Notification Settings</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm">Mobile push notification</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm">In-app notification</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" />
                  <span className="text-sm">Email notification</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" />
                  <span className="text-sm">SMS notification</span>
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Alert Preview & Examples */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Alert Preview
          </h2>

          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-medium text-orange-800">
                    {alertName || 'Alert Name'} Triggered
                  </h3>
                  <p className="text-orange-700 text-sm mt-1">
                    {selectedMetric && condition && threshold 
                      ? `${metrics.find(m => m.value === selectedMetric)?.label} is ${conditions.find(c => c.value === condition)?.label.toLowerCase()} ${threshold}`
                      : 'Configure alert to see preview'
                    }
                  </p>
                  <p className="text-orange-600 text-xs mt-2">
                    Triggered at: {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Existing Alerts */}
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Existing Alerts</h3>
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-green-800 text-sm">Revenue Target Met</h4>
                      <p className="text-green-700 text-xs">Revenue {'>'} $50,000</p>
                    </div>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Active</span>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-red-800 text-sm">Low Conversion Rate</h4>
                      <p className="text-red-700 text-xs">Conversion Rate {'<'} 2%</p>
                    </div>
                    <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Triggered</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-blue-800 text-sm">Daily Order Goal</h4>
                      <p className="text-blue-700 text-xs">Orders {'>'} 100</p>
                    </div>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
