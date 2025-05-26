
import { Filter, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getColumnsForTable } from '../utils/tableUtils';

interface SelectedTable {
  id: string;
  name: string;
  alias: string;
  selectedColumns: string[];
}

interface FilterRule {
  id: string;
  table: string;
  column: string;
  operator: string;
  value: string;
}

interface FiltersSectionProps {
  selectedTables: SelectedTable[];
  filterRules: FilterRule[];
  setFilterRules: (rules: FilterRule[]) => void;
}

export const FiltersSection = ({ selectedTables, filterRules, setFilterRules }: FiltersSectionProps) => {
  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'greater', label: 'Greater Than' },
    { value: 'less', label: 'Less Than' },
    { value: 'contains', label: 'Contains' },
    { value: 'starts_with', label: 'Starts With' }
  ];

  const addFilterRule = () => {
    const newFilter: FilterRule = {
      id: Date.now().toString(),
      table: '',
      column: '',
      operator: '',
      value: ''
    };
    setFilterRules([...filterRules, newFilter]);
  };

  const removeFilterRule = (filterId: string) => {
    setFilterRules(filterRules.filter(f => f.id !== filterId));
  };

  const updateFilterRule = (filterId: string, field: keyof FilterRule, value: string) => {
    setFilterRules(filterRules.map(filter => 
      filter.id === filterId ? { ...filter, [field]: value } : filter
    ));
  };

  return (
    <AccordionItem value="filters">
      <Card>
        <AccordionTrigger className="px-6 py-4 hover:no-underline">
          <div className="flex justify-between items-center w-full mr-4">
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
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-6">
          <div className="space-y-4">
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
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
};
