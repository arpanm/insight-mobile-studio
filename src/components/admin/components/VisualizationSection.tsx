
import { BarChart3, Target, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getColumnsForTable } from '../utils/tableUtils';

interface SelectedTable {
  id: string;
  name: string;
  alias: string;
  selectedColumns: string[];
}

interface DrillDownRule {
  id: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  label: string;
}

interface ChartConfig {
  xAxis?: string;
  yAxis?: string;
  groupBy?: string;
  aggregation?: string;
  colorBy?: string;
  valueColumn?: string;
  labelColumn?: string;
  showLegend?: boolean;
  showDataLabels?: boolean;
  stacked?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  maxItems?: number;
}

interface VisualizationSectionProps {
  selectedTables: SelectedTable[];
  drillDownRules: DrillDownRule[];
  setDrillDownRules: (rules: DrillDownRule[]) => void;
  selectedChart: string;
  setSelectedChart: (chart: string) => void;
  chartConfig: ChartConfig;
  setChartConfig: (config: ChartConfig) => void;
  reportName: string;
  setReportName: (name: string) => void;
}

export const VisualizationSection = ({
  selectedTables,
  drillDownRules,
  setDrillDownRules,
  selectedChart,
  setSelectedChart,
  chartConfig,
  setChartConfig,
  reportName,
  setReportName
}: VisualizationSectionProps) => {
  const availableTables = [
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

  const aggregationTypes = [
    { value: 'sum', label: 'Sum' },
    { value: 'avg', label: 'Average' },
    { value: 'count', label: 'Count' },
    { value: 'max', label: 'Maximum' },
    { value: 'min', label: 'Minimum' }
  ];

  const addDrillDownRule = () => {
    const newDrillDown: DrillDownRule = {
      id: Date.now().toString(),
      fromColumn: '',
      toTable: '',
      toColumn: '',
      label: ''
    };
    setDrillDownRules([...drillDownRules, newDrillDown]);
  };

  const updateDrillDownRule = (drillDownId: string, field: keyof DrillDownRule, value: string) => {
    setDrillDownRules(drillDownRules.map(rule => 
      rule.id === drillDownId ? { ...rule, [field]: value } : rule
    ));
  };

  const removeDrillDownRule = (drillDownId: string) => {
    setDrillDownRules(drillDownRules.filter(r => r.id !== drillDownId));
  };

  const updateChartConfig = (field: keyof ChartConfig, value: any) => {
    setChartConfig({ ...chartConfig, [field]: value });
  };

  const getAllSelectedColumns = () => {
    return selectedTables.flatMap(table => 
      table.selectedColumns.map(col => ({ table: table.name, column: col }))
    );
  };

  const renderChartSpecificInputs = () => {
    const allColumns = getAllSelectedColumns();
    
    if (!selectedChart) return null;

    switch (selectedChart) {
      case 'bar':
      case 'line':
      case 'area':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">X-Axis</label>
                <Select value={chartConfig.xAxis} onValueChange={(value) => updateChartConfig('xAxis', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select X-axis column" />
                  </SelectTrigger>
                  <SelectContent>
                    {allColumns.map((col, idx) => (
                      <SelectItem key={idx} value={`${col.table}.${col.column}`}>
                        {col.table}.{col.column}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Y-Axis</label>
                <Select value={chartConfig.yAxis} onValueChange={(value) => updateChartConfig('yAxis', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Y-axis column" />
                  </SelectTrigger>
                  <SelectContent>
                    {allColumns.map((col, idx) => (
                      <SelectItem key={idx} value={`${col.table}.${col.column}`}>
                        {col.table}.{col.column}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aggregation</label>
                <Select value={chartConfig.aggregation} onValueChange={(value) => updateChartConfig('aggregation', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select aggregation" />
                  </SelectTrigger>
                  <SelectContent>
                    {aggregationTypes.map((agg) => (
                      <SelectItem key={agg.value} value={agg.value}>
                        {agg.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group By</label>
                <Select value={chartConfig.groupBy} onValueChange={(value) => updateChartConfig('groupBy', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Group by column" />
                  </SelectTrigger>
                  <SelectContent>
                    {allColumns.map((col, idx) => (
                      <SelectItem key={idx} value={`${col.table}.${col.column}`}>
                        {col.table}.{col.column}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {selectedChart === 'bar' && (
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="stacked"
                  checked={chartConfig.stacked || false}
                  onChange={(e) => updateChartConfig('stacked', e.target.checked)}
                />
                <label htmlFor="stacked" className="text-sm">Stacked bars</label>
              </div>
            )}
          </div>
        );

      case 'pie':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value Column</label>
              <Select value={chartConfig.valueColumn} onValueChange={(value) => updateChartConfig('valueColumn', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select value column" />
                </SelectTrigger>
                <SelectContent>
                  {allColumns.map((col, idx) => (
                    <SelectItem key={idx} value={`${col.table}.${col.column}`}>
                      {col.table}.{col.column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label Column</label>
              <Select value={chartConfig.labelColumn} onValueChange={(value) => updateChartConfig('labelColumn', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select label column" />
                </SelectTrigger>
                <SelectContent>
                  {allColumns.map((col, idx) => (
                    <SelectItem key={idx} value={`${col.table}.${col.column}`}>
                      {col.table}.{col.column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'gauge':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value Column</label>
              <Select value={chartConfig.valueColumn} onValueChange={(value) => updateChartConfig('valueColumn', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select value column" />
                </SelectTrigger>
                <SelectContent>
                  {allColumns.map((col, idx) => (
                    <SelectItem key={idx} value={`${col.table}.${col.column}`}>
                      {col.table}.{col.column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <Select value={chartConfig.sortBy} onValueChange={(value) => updateChartConfig('sortBy', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by column" />
                  </SelectTrigger>
                  <SelectContent>
                    {allColumns.map((col, idx) => (
                      <SelectItem key={idx} value={`${col.table}.${col.column}`}>
                        {col.table}.{col.column}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <Select value={chartConfig.sortOrder} onValueChange={(value) => updateChartConfig('sortOrder', value as 'asc' | 'desc')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Items</label>
              <Input 
                type="number"
                value={chartConfig.maxItems || ''}
                onChange={(e) => updateChartConfig('maxItems', parseInt(e.target.value) || undefined)}
                placeholder="Limit number of rows"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AccordionItem value="visualization">
      <Card>
        <AccordionTrigger className="px-6 py-4 hover:no-underline">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
            Visualization
          </h2>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-6">
          <div className="space-y-4">
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
              <div className="grid grid-cols-2 gap-2">
                {chartTypes.map((chart) => (
                  <button
                    key={chart.value}
                    onClick={() => setSelectedChart(chart.value)}
                    className={`p-3 border rounded-lg text-center transition-all ${
                      selectedChart === chart.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg mb-1">{chart.icon}</div>
                    <div className="text-xs font-medium">{chart.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {selectedChart && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Chart Configuration</h3>
                  {renderChartSpecificInputs()}
                </div>
              </>
            )}

            <Separator />

            <div>
              <h3 className="font-medium text-gray-800 mb-3">Display Options</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={chartConfig.showLegend || false}
                    onChange={(e) => updateChartConfig('showLegend', e.target.checked)}
                  />
                  <span className="text-sm">Show legend</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={chartConfig.showDataLabels || false}
                    onChange={(e) => updateChartConfig('showDataLabels', e.target.checked)}
                  />
                  <span className="text-sm">Show data labels</span>
                </label>
              </div>
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
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-800 flex items-center">
                  <Target className="w-4 h-4 mr-2 text-red-600" />
                  Drill-Down Rules
                </h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addDrillDownRule}
                  disabled={selectedTables.length === 0}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {drillDownRules.map((drillDown) => (
                  <div key={drillDown.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium">Drill-Down Rule</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeDrillDownRule(drillDown.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Input 
                        value={drillDown.label}
                        onChange={(e) => updateDrillDownRule(drillDown.id, 'label', e.target.value)}
                        placeholder="Drill-down label"
                      />

                      <Select value={drillDown.fromColumn} onValueChange={(value) => updateDrillDownRule(drillDown.id, 'fromColumn', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="From column" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAllSelectedColumns().map((col, idx) => (
                            <SelectItem key={idx} value={`${col.table}.${col.column}`}>
                              {col.table}.{col.column}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={drillDown.toTable} onValueChange={(value) => updateDrillDownRule(drillDown.id, 'toTable', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="To table" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTables.map((table) => (
                            <SelectItem key={table.value} value={table.value}>
                              {table.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={drillDown.toColumn} onValueChange={(value) => updateDrillDownRule(drillDown.id, 'toColumn', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="To column" />
                        </SelectTrigger>
                        <SelectContent>
                          {drillDown.toTable && getColumnsForTable(drillDown.toTable).map((column) => (
                            <SelectItem key={column} value={column}>
                              {column}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
                
                {drillDownRules.length === 0 && selectedTables.length > 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    Click + to add drill-down rules
                  </div>
                )}
              </div>
            </div>
          </div>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
};
