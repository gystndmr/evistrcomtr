import { Link } from "wouter";
import { Star } from "lucide-react";
import turkeyFlag from "@/assets/turkey-flag_1752583610847.png";
import turkeyEmblem from "@assets/Ekran Resmi 2025-07-15 17.05.26_1752588365236.png";
import turkeyLogo from "@/assets/turkey-logo.png";

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
              <li>
                <Link href="/status" className="hover:text-primary transition-colors">
                  Download E-Visa
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Requirements
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Processing Times
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Live Chat
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
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
          
          {/* Credit Card Icons */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-xs text-neutral-400 mr-2">We Accept:</div>
            <div className="flex items-center space-x-2 flex-wrap justify-center">
              <div className="w-12 h-7 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
              <div className="w-12 h-7 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
              <div className="w-12 h-7 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">AMEX</div>
              <div className="w-12 h-7 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">DISC</div>
              <div className="w-12 h-7 bg-purple-600 rounded text-white text-xs flex items-center justify-center font-bold">TROY</div>
              <div className="w-12 h-7 bg-yellow-600 rounded text-white text-xs flex items-center justify-center font-bold">UNION</div>
              <div className="w-12 h-7 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">JCB</div>
              <div className="w-12 h-7 bg-indigo-600 rounded text-white text-xs flex items-center justify-center font-bold">DINER</div>
            </div>
          </div>
          
          <div className="text-center text-sm text-neutral-400">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 mr-3 shadow-sm">
                <img src={turkeyLogo} alt="Turkey Coat of Arms" className="w-full h-full object-contain" />
              </div>
              <span className="font-medium text-white">Turkey E-Visa Service</span>
            </div>
            
            {/* Official Turkish Government Emblem */}
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <img 
                  src={turkeyEmblem} 
                  alt="Turkish Government Emblem" 
                  className="w-full h-full object-contain filter brightness-0 invert"
                />
              </div>
            </div>
            
            <p>&copy; 2024 Turkey E-Visa Application Service. All rights reserved.</p>
            <p className="mt-2">Professional Visa Application Service</p>
            <p className="mt-1 text-xs">Fast, reliable and secure visa processing</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
