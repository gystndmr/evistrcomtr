import { Link } from "wouter";
import { Star } from "lucide-react";
import turkeyFlag from "@/assets/turkey-flag_1752583610847.png";
import turkeyEmblem from "@assets/Ekran Resmi 2025-07-15 17.05.26_1752588365236.png";
import turkeyLogo from "@/assets/turkey-logo.png";
import evisaLogo from "@/assets/evisa-logo.png";
import evisatrLogo from "@/assets/evisatr-logo.png";
import turkeyOfficialLogo from "@/assets/turkey-official-logo.png";
import tursabLogo from "@/assets/tursab-logo.png";
import newTurkeyEmblem from "@assets/ChatGPT Image 18 Tem 2025 02_01_43_1752793336494.png";
import newTursabLogo from "@assets/ChatGPT Image 18 Tem 2025 02_14_48_1752794298044.png";

export function Footer() {
  return (
    <footer className="bg-neutral-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Application</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/application" className="hover:text-primary transition-colors">
                  New Application
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-primary transition-colors">
                  Check Status
                </Link>
              </li>

            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/requirements" className="hover:text-primary transition-colors">
                  Requirements
                </Link>
              </li>
              <li>
                <Link href="/processing-times" className="hover:text-primary transition-colors">
                  Processing Times
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:info@evisatr.xyz" className="hover:text-primary transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="mailto:info@evisatr.xyz" className="hover:text-primary transition-colors">
                  Live Chat
                </a>
              </li>
              <li>
                <a href="mailto:info@evisatr.xyz" className="hover:text-primary transition-colors">
                  Help Center
                </a>
              </li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/kvkk" className="hover:text-primary transition-colors">
                  Data Protection Policy
                </Link>
              </li>
              <li>
                <Link href="/cancellation-policy" className="hover:text-primary transition-colors">
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-primary transition-colors">
                  Security Information
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-primary transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-primary transition-colors text-xs opacity-30">
                  •
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-8">
          {/* Security and Payment badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
            <div className="flex items-center space-x-2 text-xs text-neutral-400">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-neutral-400">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-neutral-400">
              <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <span>Government Approved</span>
            </div>
          </div>
          
          {/* Payment Method Logos */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-xs text-neutral-400 mr-2">We Accept:</div>
            <div className="flex items-center space-x-3 flex-wrap justify-center">
              {/* Visa */}
              <div className="h-8 flex items-center">
                <svg width="60" height="20" viewBox="0 0 78 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="78" height="32" rx="4" fill="white"/>
                  <path d="M29.4 22.8L32.1 9.2H36.3L33.6 22.8H29.4ZM46.8 9.2C47.7 9.2 48.4 9.4 48.9 9.8C49.4 10.2 49.6 10.8 49.6 11.6C49.6 12.4 49.3 13.1 48.7 13.7C48.1 14.3 47.2 14.6 46 14.6H44.1L43.2 18.8H40.8L43.5 9.2H46.8ZM22.5 9.2L19.8 22.8H15.6L12.9 12.1L11.1 22.8H6.9L9.6 9.2H14.7L16.8 18.2L18.9 9.2H22.5ZM58.2 9.2L55.5 22.8H51.3L54 9.2H58.2Z" fill="#1A1F71"/>
                  <path d="M60.3 9.2C61.2 9.2 61.9 9.4 62.4 9.8C62.9 10.2 63.1 10.8 63.1 11.6C63.1 12.4 62.8 13.1 62.2 13.7C61.6 14.3 60.7 14.6 59.5 14.6H57.6L56.7 18.8H54.3L57 9.2H60.3Z" fill="#1A1F71"/>
                </svg>
              </div>
              
              {/* Mastercard */}
              <div className="h-8 flex items-center">
                <svg width="60" height="20" viewBox="0 0 72 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="72" height="44" rx="4" fill="white"/>
                  <circle cx="26" cy="22" r="14" fill="#EB001B"/>
                  <circle cx="46" cy="22" r="14" fill="#F79E1B"/>
                  <path d="M36 12C33.2 14.4 31.5 18 31.5 22C31.5 26 33.2 29.6 36 32C38.8 29.6 40.5 26 40.5 22C40.5 18 38.8 14.4 36 12Z" fill="#FF5F00"/>
                </svg>
              </div>
              
              {/* American Express */}
              <div className="h-8 flex items-center">
                <svg width="60" height="20" viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="80" height="48" rx="4" fill="#006FCF"/>
                  <path d="M18.5 16L15 32H11L8.5 20L6 32H2L5.5 16H10L12 24L14.5 16H18.5Z" fill="white"/>
                  <path d="M28 16L24.5 32H20.5L17 16H21L23 28L26 16H28Z" fill="white"/>
                  <path d="M38 16V20H34V24H37V28H34V32H30V16H38Z" fill="white"/>
                  <path d="M48 16V20H44V24H47V28H44V32H40V16H48Z" fill="white"/>
                  <path d="M58 16L54.5 32H50.5L47 16H51L53 28L56 16H58Z" fill="white"/>
                  <path d="M68 16V20H64V24H67V28H64V32H60V16H68Z" fill="white"/>
                  <path d="M78 16L74.5 32H70.5L67 16H71L73 28L76 16H78Z" fill="white"/>
                </svg>
              </div>
              
              {/* Discover */}
              <div className="h-8 flex items-center">
                <svg width="60" height="20" viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="80" height="48" rx="4" fill="white"/>
                  <path d="M70 24C70 33.4 62.4 41 53 41H40C36.7 41 34 38.3 34 35V13C34 9.7 36.7 7 40 7H53C62.4 7 70 14.6 70 24Z" fill="#FF6000"/>
                  <path d="M15 32V16H20C22.8 16 25 18.2 25 21V27C25 29.8 22.8 32 20 32H15Z" fill="#FF6000"/>
                </svg>
              </div>
              
              {/* TROY */}
              <div className="h-8 flex items-center">
                <svg width="60" height="20" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="120" height="40" rx="4" fill="white"/>
                  <path d="M20 10H40V14H32V30H28V14H20V10Z" fill="#E30613"/>
                  <path d="M42 10H52C56.4 10 60 13.6 60 18V22C60 26.4 56.4 30 52 30H42V10ZM46 14V26H52C54.2 26 56 24.2 56 22V18C56 15.8 54.2 14 52 14H46Z" fill="#E30613"/>
                  <path d="M62 10H72C76.4 10 80 13.6 80 18V22C80 26.4 76.4 30 72 30H66V26H72C74.2 26 76 24.2 76 22V18C76 15.8 74.2 14 72 14H66V26H62V10Z" fill="#E30613"/>
                  <path d="M82 10H92L96 18L100 10H110L102 24V30H98V24L90 10H82Z" fill="#E30613"/>
                </svg>
              </div>
              
              {/* UnionPay */}
              <div className="h-8 flex items-center">
                <svg width="60" height="20" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100" height="40" rx="4" fill="white"/>
                  <path d="M15 12H25V18H35V12H45V28H35V22H25V28H15V12Z" fill="#E21836"/>
                  <path d="M50 12H60C64.4 12 68 15.6 68 20C68 24.4 64.4 28 60 28H50V12ZM54 16V24H60C62.2 24 64 22.2 64 20C64 17.8 62.2 16 60 16H54Z" fill="#E21836"/>
                  <path d="M70 12H85V16H74V18H84V22H74V24H85V28H70V12Z" fill="#E21836"/>
                </svg>
              </div>
              
              {/* JCB */}
              <div className="h-8 flex items-center">
                <svg width="60" height="20" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="80" height="40" rx="4" fill="white"/>
                  <path d="M10 12H20V24C20 26.2 18.2 28 16 28H10V12ZM14 16V24H16C16.6 24 17 23.6 17 23V17C17 16.4 16.6 16 16 16H14Z" fill="#005B9A"/>
                  <path d="M25 12H35C37.2 12 39 13.8 39 16V24C39 26.2 37.2 28 35 28H25V12ZM29 16V24H35C35.6 24 36 23.6 36 23V17C36 16.4 35.6 16 35 16H29Z" fill="#005B9A"/>
                  <path d="M44 12H54C56.2 12 58 13.8 58 16V20H54V16H48V24H54V20H58V24C58 26.2 56.2 28 54 28H44V12Z" fill="#005B9A"/>
                  <path d="M62 12H72C74.2 12 76 13.8 76 16V24C76 26.2 74.2 28 72 28H62V12ZM66 16V24H72C72.6 24 73 23.6 73 23V17C73 16.4 72.6 16 72 16H66Z" fill="#005B9A"/>
                </svg>
              </div>
              
              {/* Diners Club */}
              <div className="h-8 flex items-center">
                <svg width="60" height="20" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="80" height="40" rx="4" fill="white"/>
                  <circle cx="25" cy="20" r="12" fill="none" stroke="#0079BE" strokeWidth="2"/>
                  <circle cx="55" cy="20" r="12" fill="none" stroke="#0079BE" strokeWidth="2"/>
                  <path d="M37 8V32" stroke="#0079BE" strokeWidth="2"/>
                  <path d="M43 8V32" stroke="#0079BE" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-neutral-400">
            {/* Official Turkish Government E-Visa Logo and TURSAB */}
            <div className="flex items-center justify-center gap-8 mb-4">
              <div className="w-32 h-32 flex items-center justify-center">
                <img 
                  src={newTurkeyEmblem} 
                  alt="Türkiye Cumhuriyeti Arması" 
                  className="w-full h-full object-contain"
                />
              </div>
              <a 
                href="https://www.tursab.org.tr/acenta-arama" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-32 h-32 flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <img 
                  src={newTursabLogo} 
                  alt="TURSAB Dijital Doğrulama Sistemi - Belge No: 5778" 
                  className="w-full h-full object-contain"
                />
              </a>
            </div>
            <p>&copy; 2025 evisatr.xyz. All rights reserved. Not affiliated with the Turkish Government.</p>
            <p className="mt-2 text-xs">This is a private visa application service. Official government applications can be made directly through Turkish government websites.</p>
            <div className="mt-4 text-xs space-y-1">
              <p><strong>Business Information:</strong> eVisaTR - Turkey E-Visa Services</p>
              <p><strong>Contact:</strong> info@evisatr.xyz | Support: 24/7 Available</p>
              <p><strong>Technical Support:</strong> security@evisatr.xyz</p>
              <p><strong>Compliance:</strong> PCI DSS Level 1 | KVKK Compliant | SSL Secured</p>
            </div>
            <p className="mt-1 text-xs">Fast, reliable and secure visa processing</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
