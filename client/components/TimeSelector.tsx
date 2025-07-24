import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClockIcon } from "lucide-react";

interface TimeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
}

export default function TimeSelector({
  value,
  onChange,
  className = "",
  placeholder = "Seleccionar hora",
  required = false,
}: TimeSelectorProps) {
  // Generate time options in 15-minute intervals
  const generateTimeOptions = () => {
    const options: { value: string; label: string }[] = [];
    
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const period = hour < 12 ? 'AM' : 'PM';
        const displayMinute = minute.toString().padStart(2, '0');
        
        // Format 24h for value, 12h for display
        const label = `${displayHour}:${displayMinute} ${period}`;
        
        options.push({ value: timeValue, label });
      }
    }
    
    return options;
  };

  const timeOptions = generateTimeOptions();

  // Find the display label for the current value
  const getDisplayValue = (timeValue: string) => {
    const option = timeOptions.find(opt => opt.value === timeValue);
    return option ? option.label : "";
  };

  return (
    <div className="relative">
      <Select value={value} onValueChange={onChange} required={required}>
        <SelectTrigger className={`${className} h-12`}>
          <div className="flex items-center w-full">
            <SelectValue placeholder={placeholder}>
              {value ? getDisplayValue(value) : placeholder}
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-y-auto">
          {timeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-gray-400" />
                <span>{option.label}</span>
                <span className="text-xs text-gray-500 ml-auto">
                  {option.value}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
