import { useState } from 'react';
import { Database, Link, Filter, BarChart3, Save, Eye, Plus, X, Code, ChevronDown, MessageSquare, Layers, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PromptReportBuilder } from './PromptReportBuilder';
import { ReportPreview } from './ReportPreview';

interface ReportBuilderProps {
  onSave: () => void;
  onPreview: () => void;
}

interface SelectedTable {
  id: string;
  name: string;
  alias: string;
  selectedColumns: string[];
}

interface JoinRule {
  id: string;
  leftTable: string;
  leftColumn: string;
  rightTable: string;
  rightColumn: string;
  joinType: string;
}

interface FilterRule {
  id: string;
  table: string;
  column: string;
  operator: string;
  value: string;
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

export const ReportBuilder = ({ onSave, onPreview }: ReportBuilderProps) => {
  const [selectedTables, setSelectedTables] = useState<SelectedTable[]>([]);
  const [joinRules, setJoinRules] = useState<JoinRule[]>([]);
  const [filterRules, setFilterRules] = useState<FilterRule[]>([]);
  const [drillDownRules, setDrillDownRules] = useState<DrillDownRule[]>([]);
  const [selectedChart, setSelectedChart] = useState('');
  const [chartConfig, setChartConfig] = useState<ChartConfig>({});
  const [reportName, setReportName] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sqlQuery, setSqlQuery] = useState('');
  const [activeTab, setActiveTab] = useState('visual');
  const [showPreview, setShowPreview] = useState(false);

  const availableTables = [
    { 
      value: 'sales', 
      label: 'Sales Data',
      columns: ['order_id', 'customer_id', 'product_id', 'revenue', 'quantity', 'order_date', 'region']
    },
    { 
      value: 'customers', 
      label: 'Customer Data',
      columns: ['customer_id', 'customer_name', 'email', 'phone', 'city', 'country', 'signup_date']
    },
    { 
      value: 'products', 
      label: 'Product Data',
      columns: ['product_id', 'product_name', 'category', 'price', 'cost', 'brand', 'launch_date']
    },
    { 
      value: 'regions', 
      label: 'Regional Data',
      columns: ['region', 'country', 'manager', 'target', 'population']
    }
  ];

  const joinTypes = [
    { value: 'inner', label: 'Inner Join (Show matching records only)' },
    { value: 'left', label: 'Left Join (Show all from left table)' },
    { value: 'right', label: 'Right Join (Show all from right table)' },
    { value: 'full', label: 'Full Join (Show all records)' }
  ];

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'greater', label: 'Greater Than' },
    { value: 'less', label: 'Less Than' },
    { value: 'contains', label: 'Contains' },
    { value: 'starts_with', label: 'Starts With' }
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

  // Drill-down functions
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

  // Chart configuration functions
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

  // Render visualization section for all tabs
  const renderVisualizationSection = () => (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
        Visualization
      </h2>

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
      </div>
    </Card>
  );

  const addTable = (tableValue: string) => {
    const table = availableTables.find(t => t.value === tableValue);
    if (table && !selectedTables.find(t => t.name === tableValue)) {
      const newTable: SelectedTable = {
        id: Date.now().toString(),
        name: tableValue,
        alias: table.label,
        selectedColumns: []
      };
      setSelectedTables([...selectedTables, newTable]);
    }
  };

  const removeTable = (tableId: string) => {
    setSelectedTables(selectedTables.filter(t => t.id !== tableId));
    setJoinRules(joinRules.filter(j => j.leftTable !== tableId && j.rightTable !== tableId));
    setFilterRules(filterRules.filter(f => f.table !== tableId));
  };

  const toggleColumn = (tableId: string, column: string) => {
    setSelectedTables(selectedTables.map(table => {
      if (table.id === tableId) {
        const columns = table.selectedColumns.includes(column)
          ? table.selectedColumns.filter(c => c !== column)
          : [...table.selectedColumns, column];
        return { ...table, selectedColumns: columns };
      }
      return table;
    }));
  };

  const addJoinRule = () => {
    if (selectedTables.length >= 2) {
      const newJoin: JoinRule = {
        id: Date.now().toString(),
        leftTable: '',
        leftColumn: '',
        rightTable: '',
        rightColumn: '',
        joinType: 'inner'
      };
      setJoinRules([...joinRules, newJoin]);
    }
  };

  const updateJoinRule = (joinId: string, field: keyof JoinRule, value: string) => {
    setJoinRules(joinRules.map(join => 
      join.id === joinId ? { ...join, [field]: value } : join
    ));
  };

  const removeJoinRule = (joinId: string) => {
    setJoinRules(joinRules.filter(j => j.id !== joinId));
  };

  const addFilterRule = () => {
    const newFilter: FilterRule = {
      id: Date.now().toString(),
      table: '',
      column: '',
      operator: 'equals',
      value: ''
    };
    setFilterRules([...filterRules, newFilter]);
  };

  const updateFilterRule = (filterId: string, field: keyof FilterRule, value: string) => {
    setFilterRules(filterRules.map(filter => 
      filter.id === filterId ? { ...filter, [field]: value } : filter
    ));
  };

  const removeFilterRule = (filterId: string) => {
    setFilterRules(filterRules.filter(f => f.id !== filterId));
  };

  const getColumnsForTable = (tableName: string) => {
    const table = availableTables.find(t => t.value === tableName);
    return table ? table.columns : [];
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  if (showPreview) {
    return (
      <ReportPreview 
        reportName={reportName}
        chartType={selectedChart}
        chartConfig={chartConfig}
        selectedTables={selectedTables}
        joinRules={joinRules}
        filterRules={filterRules}
        drillDownRules={drillDownRules}
        sqlQuery={sqlQuery}
        onBack={() => setShowPreview(false)}
        onSave={onSave}
      />
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Report Builder</h1>
          <p className="text-gray-600 mt-2">Create custom reports with drag-and-drop interface</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePreview} disabled={!selectedChart}>
            <Eye className="w-5 h-5 mr-2" />
            Preview
          </Button>
          <Button onClick={onSave} className="bg-green-600 hover:bg-green-700" disabled={!reportName || !selectedChart}>
            <Save className="w-5 h-5 mr-2" />
            Save Report
          </Button>
        </div>
      </div>

      {/* Tabs for different modes */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="visual" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Visual Builder
          </TabsTrigger>
          <TabsTrigger value="prompt" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            AI Prompt
          </TabsTrigger>
          <TabsTrigger value="sql" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Advanced SQL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Data Sources & Tables */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Database className="w-5 h-5 mr-2 text-blue-600" />
                Data Sources
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Table
                  </label>
                  <Select onValueChange={addTable}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select table to add" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTables.map((table) => (
                        <SelectItem key={table.value} value={table.value}>
                          {table.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Selected Tables</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedTables.map((table) => (
                      <div key={table.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-sm">{table.alias}</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeTable(table.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-gray-600 mb-2">Select columns:</p>
                          {getColumnsForTable(table.name).map((column) => (
                            <label key={column} className="flex items-center">
                              <input 
                                type="checkbox"
                                className="mr-2 text-xs"
                                checked={table.selectedColumns.includes(column)}
                                onChange={() => toggleColumn(table.id, column)}
                              />
                              <span className="text-xs">{column}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Join Rules */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Link className="w-5 h-5 mr-2 text-green-600" />
                  Table Joins
                </h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addJoinRule}
                  disabled={selectedTables.length < 2}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4 max-h-64 overflow-y-auto">
                {joinRules.map((join) => (
                  <div key={join.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium">Join Rule</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeJoinRule(join.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Select value={join.joinType} onValueChange={(value) => updateJoinRule(join.id, 'joinType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Join type" />
                        </SelectTrigger>
                        <SelectContent>
                          {joinTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className="grid grid-cols-2 gap-2">
                        <Select value={join.leftTable} onValueChange={(value) => updateJoinRule(join.id, 'leftTable', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Left table" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedTables.map((table) => (
                              <SelectItem key={table.id} value={table.id}>
                                {table.alias}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select value={join.rightTable} onValueChange={(value) => updateJoinRule(join.id, 'rightTable', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Right table" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedTables.map((table) => (
                              <SelectItem key={table.id} value={table.id}>
                                {table.alias}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Select value={join.leftColumn} onValueChange={(value) => updateJoinRule(join.id, 'leftColumn', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Left column" />
                          </SelectTrigger>
                          <SelectContent>
                            {join.leftTable && getColumnsForTable(selectedTables.find(t => t.id === join.leftTable)?.name || '').map((column) => (
                              <SelectItem key={column} value={column}>
                                {column}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select value={join.rightColumn} onValueChange={(value) => updateJoinRule(join.id, 'rightColumn', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Right column" />
                          </SelectTrigger>
                          <SelectContent>
                            {join.rightTable && getColumnsForTable(selectedTables.find(t => t.id === join.rightTable)?.name || '').map((column) => (
                              <SelectItem key={column} value={column}>
                                {column}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
                
                {joinRules.length === 0 && selectedTables.length >= 2 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    Click + to add join rules between tables
                  </div>
                )}
              </div>
            </Card>

            {/* Filters */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-orange-600" />
                  Filters
                </h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addFilterRule}
                  disabled={selectedTables.length === 0}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4 max-h-64 overflow-y-auto">
                {filterRules.map((filter) => (
                  <div key={filter.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium">Filter Rule</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeFilterRule(filter.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Select value={filter.table} onValueChange={(value) => updateFilterRule(filter.id, 'table', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select table" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedTables.map((table) => (
                            <SelectItem key={table.id} value={table.id}>
                              {table.alias}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={filter.column} onValueChange={(value) => updateFilterRule(filter.id, 'column', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent>
                          {filter.table && getColumnsForTable(selectedTables.find(t => t.id === filter.table)?.name || '').map((column) => (
                            <SelectItem key={column} value={column}>
                              {column}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={filter.operator} onValueChange={(value) => updateFilterRule(filter.id, 'operator', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select operator" />
                        </SelectTrigger>
                        <SelectContent>
                          {operators.map((op) => (
                            <SelectItem key={op.value} value={op.value}>
                              {op.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input 
                        value={filter.value}
                        onChange={(e) => updateFilterRule(filter.id, 'value', e.target.value)}
                        placeholder="Enter filter value"
                      />
                    </div>
                  </div>
                ))}
                
                {filterRules.length === 0 && selectedTables.length > 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    Click + to add filter conditions
                  </div>
                )}
              </div>
            </Card>

            {/* Drill-Down Rules */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-red-600" />
                  Drill-Down
                </h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addDrillDownRule}
                  disabled={selectedTables.length === 0}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4 max-h-64 overflow-y-auto">
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
            </Card>

            {/* Visualization */}
            {renderVisualizationSection()}
          </div>
        </TabsContent>

        <TabsContent value="prompt" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <PromptReportBuilder onSave={onSave} onPreview={onPreview} />
            </div>
            {renderVisualizationSection()}
          </div>
        </TabsContent>

        <TabsContent value="sql" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Advanced SQL Query</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SQL Query
                    </label>
                    <textarea
                      value={sqlQuery}
                      onChange={(e) => setSqlQuery(e.target.value)}
                      className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm"
                      placeholder="SELECT s.revenue, c.customer_name, p.product_name 
FROM sales s 
LEFT JOIN customers c ON s.customer_id = c.customer_id
LEFT JOIN products p ON s.product_id = p.product_id
WHERE s.order_date >= '2024-01-01'"
                    />
                  </div>
                </div>
              </Card>
            </div>
            {renderVisualizationSection()}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
