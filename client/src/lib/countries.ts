export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
  isEligible: boolean;
  requiresSupportingDocs: boolean;
  supportedDocumentTypes?: string[];
}

export const COUNTRIES: CountryInfo[] = [
  // Official Turkish E-Visa eligible countries
  { code: "AFG", name: "Afghanistan", flag: "🇦🇫", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"] },
  { code: "DZA", name: "Algeria", flag: "🇩🇿", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"] },
  { code: "ATG", name: "Antigua and Barbuda", flag: "🇦🇬", isEligible: true, requiresSupportingDocs: false },
  { code: "ARM", name: "Armenia", flag: "🇦🇲", isEligible: true, requiresSupportingDocs: false },
  { code: "AUS", name: "Australia", flag: "🇦🇺", isEligible: true, requiresSupportingDocs: false },
  { code: "BHS", name: "Bahamas", flag: "🇧🇸", isEligible: true, requiresSupportingDocs: false },
  { code: "BGD", name: "Bangladesh", flag: "🇧🇩", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"] },
  { code: "BRB", name: "Barbados", flag: "🇧🇧", isEligible: true, requiresSupportingDocs: false },
  { code: "BMU", name: "Bermuda", flag: "🇧🇲", isEligible: true, requiresSupportingDocs: false },
  { code: "BTN", name: "Bhutan", flag: "🇧🇹", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"] },
  { code: "KHM", name: "Cambodia", flag: "🇰🇭", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"] },
  { code: "CAN", name: "Canada", flag: "🇨🇦", isEligible: true, requiresSupportingDocs: false },
  { code: "CPV", name: "Cape Verde", flag: "🇨🇻", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"] },
  { code: "CHN", name: "China", flag: "🇨🇳", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "invitation"] },
  { code: "HRV", name: "Croatia", flag: "🇭🇷", isEligible: true, requiresSupportingDocs: false },
  { code: "DMA", name: "Dominica", flag: "🇩🇲", isEligible: true, requiresSupportingDocs: false },
  { code: "DOM", name: "Dominican Republic", flag: "🇩🇴", isEligible: true, requiresSupportingDocs: false },
  { code: "TLS", name: "East Timor", flag: "🇹🇱", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"] },
  { code: "EGY", name: "Egypt", flag: "🇪🇬", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"] },
  { code: "GNQ", name: "Equatorial Guinea", flag: "🇬🇶", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"] },
  { code: "EST", name: "Estonia", flag: "🇪🇪", isEligible: true, requiresSupportingDocs: false },
  { code: "FJI", name: "Fiji", flag: "🇫🇯", isEligible: true, requiresSupportingDocs: false },
  { code: "CYP", name: "Cyprus", flag: "🇨🇾", isEligible: true, requiresSupportingDocs: false },
  { code: "GRD", name: "Grenada", flag: "🇬🇩", isEligible: true, requiresSupportingDocs: false },
  { code: "HTI", name: "Haiti", flag: "🇭🇹", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"] },
  { code: "HKG", name: "Hong Kong", flag: "🇭🇰", isEligible: true, requiresSupportingDocs: false },
  { code: "IND", name: "India", flag: "🇮🇳", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"] },
  { code: "IRQ", name: "Iraq", flag: "🇮🇶", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"] },
  { code: "JAM", name: "Jamaica", flag: "🇯🇲", isEligible: true, requiresSupportingDocs: false },
  { code: "LVA", name: "Latvia", flag: "🇱🇻", isEligible: true, requiresSupportingDocs: false },
  { code: "LBY", name: "Libya", flag: "🇱🇾", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"] },
  { code: "LTU", name: "Lithuania", flag: "🇱🇹", isEligible: true, requiresSupportingDocs: false },
  { code: "MDV", name: "Maldives", flag: "🇲🇻", isEligible: true, requiresSupportingDocs: false },
  { code: "MUS", name: "Mauritius", flag: "🇲🇺", isEligible: true, requiresSupportingDocs: false },
  { code: "MEX", name: "Mexico", flag: "🇲🇽", isEligible: true, requiresSupportingDocs: false },
  { code: "NAM", name: "Namibia", flag: "🇳🇦", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"] },
  { code: "NPL", name: "Nepal", flag: "🇳🇵", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"] },
  { code: "PAK", name: "Pakistan", flag: "🇵🇰", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"] },
  { code: "PSE", name: "Palestine", flag: "🇵🇸", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"] },
  { code: "PHL", name: "Philippines", flag: "🇵🇭", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"] },
  { code: "LCA", name: "Saint Lucia", flag: "🇱🇨", isEligible: true, requiresSupportingDocs: false },
  { code: "VCT", name: "Saint Vincent and the Grenadines", flag: "🇻🇨", isEligible: true, requiresSupportingDocs: false },
  { code: "SEN", name: "Senegal", flag: "🇸🇳", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"] },
  { code: "SLB", name: "Solomon Islands", flag: "🇸🇧", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"] },
  { code: "ZAF", name: "South Africa", flag: "🇿🇦", isEligible: true, requiresSupportingDocs: false },
  { code: "LKA", name: "Sri Lanka", flag: "🇱🇰", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"] },
  { code: "SUR", name: "Suriname", flag: "🇸🇷", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"] },
  { code: "TWN", name: "Taiwan", flag: "🇹🇼", isEligible: true, requiresSupportingDocs: false },
  { code: "VUT", name: "Vanuatu", flag: "🇻🇺", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"] },
  { code: "VNM", name: "Vietnam", flag: "🇻🇳", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"] },
  { code: "YEM", name: "Yemen", flag: "🇾🇪", isEligible: true, requiresSupportingDocs: true, supportedDocumentTypes: ["hotel", "flight", "financial"] },
  
  // Major countries that are visa-free (not e-visa eligible)
  { code: "USA", name: "United States", flag: "🇺🇸", isEligible: false, requiresSupportingDocs: false },
  { code: "GBR", name: "United Kingdom", flag: "🇬🇧", isEligible: false, requiresSupportingDocs: false },
  { code: "DEU", name: "Germany", flag: "🇩🇪", isEligible: false, requiresSupportingDocs: false },
  { code: "FRA", name: "France", flag: "🇫🇷", isEligible: false, requiresSupportingDocs: false },
  { code: "JPN", name: "Japan", flag: "🇯🇵", isEligible: false, requiresSupportingDocs: false },
  { code: "RUS", name: "Russian Federation", flag: "🇷🇺", isEligible: false, requiresSupportingDocs: false },
  { code: "NGA", name: "Nigeria", flag: "🇳🇬", isEligible: false, requiresSupportingDocs: false },
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
