
import { useState } from 'react';
import { MessageSquare, Wand2, RefreshCw, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface PromptReportBuilderProps {
  onSave: () => void;
  onPreview: () => void;
}

interface PromptHistory {
  id: string;
  prompt: string;
  timestamp: Date;
  generatedQuery: string;
  reportConfig: any;
}

export const PromptReportBuilder = ({ onSave, onPreview }: PromptReportBuilderProps) => {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [reportName, setReportName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptHistory, setPromptHistory] = useState<PromptHistory[]>([]);
  const [generatedQuery, setGeneratedQuery] = useState('');
  const [currentReportConfig, setCurrentReportConfig] = useState<any>(null);

  const handleGenerateReport = async () => {
    if (!currentPrompt.trim()) return;

    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const newQuery = generateSQLFromPrompt(currentPrompt);
      const newConfig = generateReportConfig(currentPrompt);
      
      const historyEntry: PromptHistory = {
        id: Date.now().toString(),
        prompt: currentPrompt,
        timestamp: new Date(),
        generatedQuery: newQuery,
        reportConfig: newConfig
      };

      setPromptHistory([historyEntry, ...promptHistory]);
      setGeneratedQuery(newQuery);
      setCurrentReportConfig(newConfig);
      setCurrentPrompt('');
      setIsGenerating(false);
    }, 2000);
  };

  const handleRefineReport = async () => {
    if (!currentPrompt.trim() || !generatedQuery) return;

    setIsGenerating(true);
    
    // Simulate AI refinement
    setTimeout(() => {
      const refinedQuery = refineExistingQuery(generatedQuery, currentPrompt);
      const refinedConfig = refineReportConfig(currentReportConfig, currentPrompt);
      
      const historyEntry: PromptHistory = {
        id: Date.now().toString(),
        prompt: `Refinement: ${currentPrompt}`,
        timestamp: new Date(),
        generatedQuery: refinedQuery,
        reportConfig: refinedConfig
      };

      setPromptHistory([historyEntry, ...promptHistory]);
      setGeneratedQuery(refinedQuery);
      setCurrentReportConfig(refinedConfig);
      setCurrentPrompt('');
      setIsGenerating(false);
    }, 1500);
  };

  const generateSQLFromPrompt = (prompt: string): string => {
    // Mock SQL generation based on prompt keywords
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('revenue') && lowerPrompt.includes('customer')) {
      return `SELECT 
  c.customer_name,
  SUM(s.revenue) as total_revenue,
  COUNT(s.order_id) as order_count
FROM sales s
LEFT JOIN customers c ON s.customer_id = c.customer_id
WHERE s.order_date >= '2024-01-01'
GROUP BY c.customer_id, c.customer_name
ORDER BY total_revenue DESC`;
    }
    
    if (lowerPrompt.includes('product') && lowerPrompt.includes('sales')) {
      return `SELECT 
  p.product_name,
  p.category,
  SUM(s.quantity) as units_sold,
  SUM(s.revenue) as total_revenue
FROM sales s
LEFT JOIN products p ON s.product_id = p.product_id
WHERE s.order_date >= '2024-01-01'
GROUP BY p.product_id, p.product_name, p.category
ORDER BY total_revenue DESC`;
    }

    return `SELECT 
  s.order_date,
  s.revenue,
  c.customer_name,
  p.product_name
FROM sales s
LEFT JOIN customers c ON s.customer_id = c.customer_id
LEFT JOIN products p ON s.product_id = p.product_id
WHERE s.order_date >= '2024-01-01'
ORDER BY s.order_date DESC`;
  };

  const generateReportConfig = (prompt: string) => {
    const lowerPrompt = prompt.toLowerCase();
    
    return {
      chartType: lowerPrompt.includes('trend') || lowerPrompt.includes('time') ? 'line' : 'bar',
      groupBy: lowerPrompt.includes('customer') ? 'customer' : lowerPrompt.includes('product') ? 'product' : 'date',
      metrics: lowerPrompt.includes('revenue') ? ['revenue'] : ['count'],
      filters: []
    };
  };

  const refineExistingQuery = (existingQuery: string, refinementPrompt: string): string => {
    const lowerPrompt = refinementPrompt.toLowerCase();
    
    if (lowerPrompt.includes('add region') || lowerPrompt.includes('include region')) {
      return existingQuery.replace(
        'FROM sales s',
        'FROM sales s\nLEFT JOIN regions r ON s.region = r.region'
      ).replace(
        'SELECT ',
        'SELECT r.region, '
      );
    }
    
    if (lowerPrompt.includes('last month') || lowerPrompt.includes('past month')) {
      return existingQuery.replace(
        "WHERE s.order_date >= '2024-01-01'",
        "WHERE s.order_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH)"
      );
    }

    if (lowerPrompt.includes('top 10') || lowerPrompt.includes('limit 10')) {
      return existingQuery + '\nLIMIT 10';
    }

    return existingQuery;
  };

  const refineReportConfig = (existingConfig: any, refinementPrompt: string) => {
    const lowerPrompt = refinementPrompt.toLowerCase();
    
    const newConfig = { ...existingConfig };
    
    if (lowerPrompt.includes('pie chart')) {
      newConfig.chartType = 'pie';
    } else if (lowerPrompt.includes('line chart')) {
      newConfig.chartType = 'line';
    } else if (lowerPrompt.includes('table')) {
      newConfig.chartType = 'table';
    }

    return newConfig;
  };

  const samplePrompts = [
    "Show me revenue by customer for this year",
    "Create a report of top selling products by category",
    "Display monthly sales trends with regional breakdown",
    "Generate customer acquisition report with conversion rates"
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">AI Report Builder</h1>
          <p className="text-gray-600 mt-2">Generate reports using natural language prompts</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onPreview} disabled={!generatedQuery}>
            <Sparkles className="w-5 h-5 mr-2" />
            Preview
          </Button>
          <Button onClick={onSave} className="bg-purple-600 hover:bg-purple-700" disabled={!generatedQuery}>
            <Wand2 className="w-5 h-5 mr-2" />
            Save Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prompt Input */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
              {generatedQuery ? 'Refine Your Report' : 'Describe Your Report'}
            </h2>

            <div className="space-y-4">
              {!generatedQuery && (
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
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {generatedQuery ? 'How would you like to modify this report?' : 'What report would you like to create?'}
                </label>
                <Textarea
                  value={currentPrompt}
                  onChange={(e) => setCurrentPrompt(e.target.value)}
                  placeholder={generatedQuery 
                    ? "e.g., Add regional breakdown, show only top 10 results, change to pie chart..."
                    : "e.g., Show me revenue by customer for the last 6 months with product breakdown..."
                  }
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={generatedQuery ? handleRefineReport : handleGenerateReport}
                  disabled={!currentPrompt.trim() || isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : generatedQuery ? (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {isGenerating ? 'Generating...' : generatedQuery ? 'Refine Report' : 'Generate Report'}
                </Button>
                
                {generatedQuery && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setGeneratedQuery('');
                      setCurrentReportConfig(null);
                      setPromptHistory([]);
                    }}
                  >
                    Start Over
                  </Button>
                )}
              </div>

              {!generatedQuery && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Sample Prompts:</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {samplePrompts.map((prompt, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPrompt(prompt)}
                          className="text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg border transition-colors"
                        >
                          "{prompt}"
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Generated Query */}
          {generatedQuery && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Generated SQL Query</h2>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                  {generatedQuery}
                </pre>
              </div>
            </Card>
          )}
        </div>

        {/* Prompt History & Configuration */}
        <div className="space-y-6">
          {/* Current Configuration */}
          {currentReportConfig && (
            <Card className="p-4">
              <h3 className="font-medium text-gray-800 mb-3">Report Configuration</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Chart Type:</span>
                  <span className="capitalize">{currentReportConfig.chartType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Group By:</span>
                  <span className="capitalize">{currentReportConfig.groupBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Metrics:</span>
                  <span className="capitalize">{currentReportConfig.metrics.join(', ')}</span>
                </div>
              </div>
            </Card>
          )}

          {/* Prompt History */}
          {promptHistory.length > 0 && (
            <Card className="p-4">
              <h3 className="font-medium text-gray-800 mb-3">Prompt History</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {promptHistory.map((entry) => (
                  <div key={entry.id} className="border border-gray-200 rounded-lg p-3">
                    <p className="text-sm text-gray-800 mb-1">{entry.prompt}</p>
                    <p className="text-xs text-gray-500">
                      {entry.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Tips */}
          <Card className="p-4">
            <h3 className="font-medium text-gray-800 mb-3">💡 Tips</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Be specific about time periods (e.g., "last 6 months")</p>
              <p>• Mention specific metrics you want to see</p>
              <p>• Include grouping preferences (by customer, product, etc.)</p>
              <p>• Specify chart types if you have a preference</p>
              <p>• Use refinement prompts to adjust existing reports</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
