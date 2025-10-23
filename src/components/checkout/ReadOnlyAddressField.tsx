import React from 'react';
import { Check, Pencil } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface ReadOnlyAddressFieldProps {
  label: string;
  value: string;
  onEdit: () => void;
}

const ReadOnlyAddressField: React.FC<ReadOnlyAddressFieldProps> = ({ label, value, onEdit }) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <div className="flex items-center justify-between border-2 border-green-500 bg-green-50 rounded-md px-3 py-2 text-sm">
          <div className="flex items-center gap-2 flex-1">
            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span className="text-gray-900 font-medium">{value}</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onEdit}
            aria-label="Edit field"
            className="h-7 px-1 md:px-2 text-xs hover:bg-green-100 flex-shrink-0"
          >
            <Pencil className="h-3 w-3 md:mr-1" />
            <span className="hidden md:inline">Edit</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReadOnlyAddressField;
