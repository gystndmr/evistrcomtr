import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ManualDateInputProps {
  label: string;
  value?: string;
  onChange: (date: string) => void;
  required?: boolean;
  minYear?: number;
  maxYear?: number;
  placeholder?: string;
}

export function ManualDateInput({ 
  label, 
  value, 
  onChange, 
  required = false, 
  minYear = 1950, 
  maxYear = new Date().getFullYear() + 10,
  placeholder = "Select date"
}: ManualDateInputProps) {
  // Parse existing value
  const parseDate = (dateString: string) => {
    if (!dateString) return { day: '', month: '', year: '' };
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return { day: '', month: '', year: '' };
    
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: (date.getMonth() + 1).toString().padStart(2, '0'),
      year: date.getFullYear().toString()
    };
  };

  const { day, month, year } = parseDate(value || '');

  // Generate options
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => (maxYear - i).toString());

  // Track individual field states to prevent auto-fill
  const [selectedDay, setSelectedDay] = React.useState(day);
  const [selectedMonth, setSelectedMonth] = React.useState(month);
  const [selectedYear, setSelectedYear] = React.useState(year);

  // Update internal state when props change
  React.useEffect(() => {
    setSelectedDay(day);
    setSelectedMonth(month);
    setSelectedYear(year);
  }, [day, month, year]);

  const handleDateChange = (newDay: string, newMonth: string, newYear: string) => {
    // Only call onChange when all three fields are manually filled
    if (newDay && newMonth && newYear) {
      const dateString = `${newYear}-${newMonth}-${newDay}`;
      onChange(dateString);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label} {required && '*'}</Label>
      <div className="grid grid-cols-3 gap-2">
        <Select
          value={selectedDay}
          onValueChange={(newDay) => {
            setSelectedDay(newDay);
            handleDateChange(newDay, selectedMonth, selectedYear);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent>
            {days.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedMonth}
          onValueChange={(newMonth) => {
            setSelectedMonth(newMonth);
            handleDateChange(selectedDay, newMonth, selectedYear);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedYear}
          onValueChange={(newYear) => {
            setSelectedYear(newYear);
            handleDateChange(selectedDay, selectedMonth, newYear);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}