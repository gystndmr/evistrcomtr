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
  placeholder = "Tarih seçiniz"
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
    { value: '01', label: 'Ocak' },
    { value: '02', label: 'Şubat' },
    { value: '03', label: 'Mart' },
    { value: '04', label: 'Nisan' },
    { value: '05', label: 'Mayıs' },
    { value: '06', label: 'Haziran' },
    { value: '07', label: 'Temmuz' },
    { value: '08', label: 'Ağustos' },
    { value: '09', label: 'Eylül' },
    { value: '10', label: 'Ekim' },
    { value: '11', label: 'Kasım' },
    { value: '12', label: 'Aralık' }
  ];
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => (maxYear - i).toString());

  const handleDateChange = (newDay: string, newMonth: string, newYear: string) => {
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
          value={day}
          onValueChange={(newDay) => handleDateChange(newDay, month, year)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Gün" />
          </SelectTrigger>
          <SelectContent>
            {days.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={month}
          onValueChange={(newMonth) => handleDateChange(day, newMonth, year)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Ay" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={year}
          onValueChange={(newYear) => handleDateChange(day, month, newYear)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Yıl" />
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