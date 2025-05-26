
import { Link, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getColumnsForTable } from '../utils/tableUtils';

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

interface JoinsSectionProps {
  selectedTables: SelectedTable[];
  joinRules: JoinRule[];
  setJoinRules: (rules: JoinRule[]) => void;
}

export const JoinsSection = ({ selectedTables, joinRules, setJoinRules }: JoinsSectionProps) => {
  const joinTypes = [
    { value: 'inner', label: 'Inner Join (Show matching records only)' },
    { value: 'left', label: 'Left Join (Show all from left table)' },
    { value: 'right', label: 'Right Join (Show all from right table)' },
    { value: 'full', label: 'Full Join (Show all records)' }
  ];

  const addJoinRule = () => {
    const newJoin: JoinRule = {
      id: Date.now().toString(),
      leftTable: '',
      leftColumn: '',
      rightTable: '',
      rightColumn: '',
      joinType: ''
    };
    setJoinRules([...joinRules, newJoin]);
  };

  const removeJoinRule = (joinId: string) => {
    setJoinRules(joinRules.filter(j => j.id !== joinId));
  };

  const updateJoinRule = (joinId: string, field: keyof JoinRule, value: string) => {
    setJoinRules(joinRules.map(join => 
      join.id === joinId ? { ...join, [field]: value } : join
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-800">Join Rules</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={addJoinRule}
          disabled={selectedTables.length < 2}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
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
    </div>
  );
};
