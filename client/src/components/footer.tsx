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
