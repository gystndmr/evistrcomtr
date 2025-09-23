// Shared pricing constants for Turkey E-Visa applications
// Used by both frontend and backend to ensure consistency

// E-visa application fee (constant across all applications)
export const E_VISA_FEE = 69;

// Processing types for all applications
export interface ProcessingType {
  value: string;
  label: string;
  price: number;
  minDays: number;
  displayLabel: string;
}

export const PROCESSING_TYPES: ProcessingType[] = [
  { 
    value: "slow", 
    label: "Ready in 7 days", 
    price: 90, 
    minDays: 7, 
    displayLabel: "Ready in 7 days - $90 processing + $69 e-visa = $159 total" 
  },
  { 
    value: "standard", 
    label: "Ready in 4 days", 
    price: 155, 
    minDays: 4, 
    displayLabel: "Ready in 4 days - $155 processing + $69 e-visa = $224 total" 
  },
  { 
    value: "fast", 
    label: "Ready in 2 days", 
    price: 205, 
    minDays: 2, 
    displayLabel: "Ready in 2 days - $205 processing + $69 e-visa = $274 total" 
  },
  { 
    value: "urgent_24", 
    label: "Ready in 24 hours", 
    price: 320, 
    minDays: 1, 
    displayLabel: "Ready in 24 hours - $320 processing + $69 e-visa = $389 total" 
  },
  { 
    value: "urgent_12", 
    label: "Ready in 12 hours", 
    price: 370, 
    minDays: 1, 
    displayLabel: "Ready in 12 hours - $370 processing + $69 e-visa = $439 total" 
  },
  { 
    value: "urgent_4", 
    label: "Ready in 4 hours", 
    price: 450, 
    minDays: 1, 
    displayLabel: "Ready in 4 hours - $450 processing + $69 e-visa = $519 total" 
  },
  { 
    value: "urgent_1", 
    label: "Ready in 1 hour", 
    price: 685, 
    minDays: 1, 
    displayLabel: "Ready in 1 hour - $685 processing + $69 e-visa = $754 total" 
  },
];

// Helper function to get processing type by value
export const getProcessingTypeByValue = (value: string): ProcessingType | undefined => {
  return PROCESSING_TYPES.find(type => type.value === value);
};

// Helper function to calculate total amount
export const calculateTotalAmount = (processingTypeValue: string): number => {
  const processingType = getProcessingTypeByValue(processingTypeValue);
  if (!processingType) return E_VISA_FEE + 90; // fallback to slow processing
  
  return processingType.price + E_VISA_FEE;
};

// Processing types object for backend compatibility (value -> price mapping)
export const PROCESSING_TYPE_PRICES: Record<string, number> = {
  'slow': 90,
  'standard': 155,
  'fast': 205,
  'urgent_24': 320,
  'urgent_12': 370,
  'urgent_4': 450,
  'urgent_1': 685
};