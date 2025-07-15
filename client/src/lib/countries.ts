export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
  isEligible: boolean;
  requiresSupportingDocs: boolean;
  supportedDocumentTypes?: string[];
}

export const COUNTRIES: CountryInfo[] = [
  { code: "USA", name: "United States", flag: "🇺🇸", isEligible: true, requiresSupportingDocs: false },
  { code: "GBR", name: "United Kingdom", flag: "🇬🇧", isEligible: true, requiresSupportingDocs: false },
  { code: "DEU", name: "Germany", flag: "🇩🇪", isEligible: true, requiresSupportingDocs: false },
  { code: "FRA", name: "France", flag: "🇫🇷", isEligible: true, requiresSupportingDocs: false },
  { code: "JPN", name: "Japan", flag: "🇯🇵", isEligible: true, requiresSupportingDocs: false },
  { code: "AUS", name: "Australia", flag: "🇦🇺", isEligible: true, requiresSupportingDocs: false },
  { code: "CAN", name: "Canada", flag: "🇨🇦", isEligible: true, requiresSupportingDocs: false },
  { code: "RUS", name: "Russian Federation", flag: "🇷🇺", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"] },
  { code: "CHN", name: "China", flag: "🇨🇳", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "invitation"] },
  { code: "IND", name: "India", flag: "🇮🇳", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"] },
  { code: "NGA", name: "Nigeria", flag: "🇳🇬", isEligible: false, requiresSupportingDocs: false },
  { code: "PAK", name: "Pakistan", flag: "🇵🇰", isEligible: false, requiresSupportingDocs: false },
  { code: "BGD", name: "Bangladesh", flag: "🇧🇩", isEligible: false, requiresSupportingDocs: false },
  { code: "AFG", name: "Afghanistan", flag: "🇦🇫", isEligible: false, requiresSupportingDocs: false },
  { code: "IRQ", name: "Iraq", flag: "🇮🇶", isEligible: false, requiresSupportingDocs: false },
  { code: "SYR", name: "Syria", flag: "🇸🇾", isEligible: false, requiresSupportingDocs: false },
];

export const DOCUMENT_TYPES = [
  { value: "hotel", label: "Hotel Reservation" },
  { value: "flight", label: "Flight Reservation" },
  { value: "invitation", label: "Invitation Letter" },
  { value: "financial", label: "Financial Statement" },
  { value: "insurance", label: "Travel Insurance" },
];

export const PROCESSING_TYPES = [
  { value: "standard", label: "Standard Processing (5-7 days)", price: 0 },
  { value: "fast", label: "Fast Processing (1-3 days)", price: 50 },
  { value: "express", label: "Express Processing (24 hours)", price: 150 },
  { value: "urgent", label: "Urgent Processing (4 hours)", price: 270 },
];
