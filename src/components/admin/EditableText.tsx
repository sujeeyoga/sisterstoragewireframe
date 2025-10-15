import { useState, useRef, useEffect } from 'react';
import { useAdminEditMode } from '@/contexts/AdminEditModeContext';
import { Pencil } from 'lucide-react';

interface EditableTextProps {
  siteTextId: string;
  field: 'title' | 'subtitle' | 'description' | 'button_text';
  value: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'button';
  placeholder?: string;
}

export function EditableText({ 
  siteTextId, 
  field, 
  value, 
  className = '', 
  as: Component = 'span',
  placeholder = 'Click to edit'
}: EditableTextProps) {
  const { isEditMode, updateSiteText } = useAdminEditMode();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (isEditMode) {
      setIsEditing(true);
    }
  };

  const handleBlur = async () => {
    setIsEditing(false);
    if (editValue !== value) {
      await updateSiteText(siteTextId, field, editValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (!isEditMode) {
    return <Component className={className}>{value || placeholder}</Component>;
  }

  if (isEditing) {
    return (
      <div className="relative">
        <textarea
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`${className} border-2 border-primary rounded px-2 py-1 w-full resize-none`}
          rows={Math.max(2, editValue.split('\n').length)}
        />
      </div>
    );
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Component 
        className={`${className} ${isEditMode ? 'cursor-pointer hover:bg-primary/10 rounded px-1 transition-colors' : ''}`}
        onClick={handleClick}
      >
        {value || placeholder}
      </Component>
      {isHovered && (
        <Pencil className="absolute -top-2 -right-2 w-4 h-4 text-primary bg-background rounded-full p-0.5 border border-primary" />
      )}
    </div>
  );
}
