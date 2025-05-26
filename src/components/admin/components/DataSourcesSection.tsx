
import { useState } from 'react';
import { Database, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { getColumnsForTable } from '../utils/tableUtils';

interface SelectedTable {
  id: string;
  name: string;
  alias: string;
  selectedColumns: string[];
}

interface DataSourcesSectionProps {
  selectedTables: SelectedTable[];
  setSelectedTables: (tables: SelectedTable[]) => void;
}

export const DataSourcesSection = ({ selectedTables, setSelectedTables }: DataSourcesSectionProps) => {
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

  const addTable = (tableValue: string) => {
    const table = availableTables.find(t => t.value === tableValue);
    if (!table) return;

    const newTable: SelectedTable = {
      id: Date.now().toString(),
      name: table.value,
      alias: table.label,
      selectedColumns: []
    };
    setSelectedTables([...selectedTables, newTable]);
  };

  const removeTable = (tableId: string) => {
    setSelectedTables(selectedTables.filter(t => t.id !== tableId));
  };

  const toggleColumn = (tableId: string, column: string) => {
    setSelectedTables(selectedTables.map(table => {
      if (table.id === tableId) {
        const newColumns = table.selectedColumns.includes(column)
          ? table.selectedColumns.filter(c => c !== column)
          : [...table.selectedColumns, column];
        return { ...table, selectedColumns: newColumns };
      }
      return table;
    }));
  };

  return (
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
        <div className="space-y-3">
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
                <div className="grid grid-cols-2 gap-1">
                  {getColumnsForTable(table.name).map((column) => (
                    <label key={column} className="flex items-center text-xs">
                      <input 
                        type="checkbox"
                        className="mr-2"
                        checked={table.selectedColumns.includes(column)}
                        onChange={() => toggleColumn(table.id, column)}
                      />
                      <span className="truncate">{column}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
