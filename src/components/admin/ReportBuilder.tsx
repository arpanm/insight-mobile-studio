
import { useState } from 'react';
import { Database, Eye, Save, Code, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PromptReportBuilder } from './PromptReportBuilder';
import { ReportPreview } from './ReportPreview';
import { DataSourcesSection } from './components/DataSourcesSection';
import { JoinsSection } from './components/JoinsSection';
import { FiltersSection } from './components/FiltersSection';
import { VisualizationSection } from './components/VisualizationSection';

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
  const [sqlQuery, setSqlQuery] = useState('');
  const [activeTab, setActiveTab] = useState('visual');
  const [showPreview, setShowPreview] = useState(false);

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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-4">
              <Accordion type="multiple" defaultValue={["data-sources", "visualization"]} className="space-y-4">
                <AccordionItem value="data-sources">
                  <Card>
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <Database className="w-5 h-5 mr-2 text-blue-600" />
                        Data Sources
                      </h2>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <DataSourcesSection 
                        selectedTables={selectedTables}
                        setSelectedTables={setSelectedTables}
                      />
                    </AccordionContent>
                  </Card>
                </AccordionItem>

                <AccordionItem value="joins">
                  <Card>
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <Code className="w-5 h-5 mr-2 text-green-600" />
                        Table Joins
                      </h2>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <JoinsSection 
                        selectedTables={selectedTables}
                        joinRules={joinRules}
                        setJoinRules={setJoinRules}
                      />
                    </AccordionContent>
                  </Card>
                </AccordionItem>

                <AccordionItem value="filters">
                  <Card>
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <Database className="w-5 h-5 mr-2 text-orange-600" />
                        Filters
                      </h2>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <FiltersSection 
                        selectedTables={selectedTables}
                        filterRules={filterRules}
                        setFilterRules={setFilterRules}
                      />
                    </AccordionContent>
                  </Card>
                </AccordionItem>

                <AccordionItem value="visualization">
                  <Card>
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <Eye className="w-5 h-5 mr-2 text-purple-600" />
                        Visualization
                      </h2>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <VisualizationSection 
                        selectedTables={selectedTables}
                        drillDownRules={drillDownRules}
                        setDrillDownRules={setDrillDownRules}
                        selectedChart={selectedChart}
                        setSelectedChart={setSelectedChart}
                        chartConfig={chartConfig}
                        setChartConfig={setChartConfig}
                        reportName={reportName}
                        setReportName={setReportName}
                      />
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="prompt" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <PromptReportBuilder onSave={onSave} onPreview={onPreview} />
            </div>
            <div className="lg:col-span-1">
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Visualization Options</h2>
                <VisualizationSection 
                  selectedTables={selectedTables}
                  drillDownRules={drillDownRules}
                  setDrillDownRules={setDrillDownRules}
                  selectedChart={selectedChart}
                  setSelectedChart={setSelectedChart}
                  chartConfig={chartConfig}
                  setChartConfig={setChartConfig}
                  reportName={reportName}
                  setReportName={setReportName}
                />
              </Card>
            </div>
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
            <div className="lg:col-span-1">
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Visualization Options</h2>
                <VisualizationSection 
                  selectedTables={selectedTables}
                  drillDownRules={drillDownRules}
                  setDrillDownRules={setDrillDownRules}
                  selectedChart={selectedChart}
                  setSelectedChart={setSelectedChart}
                  chartConfig={chartConfig}
                  setChartConfig={setChartConfig}
                  reportName={reportName}
                  setReportName={setReportName}
                />
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
