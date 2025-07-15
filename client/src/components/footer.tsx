import { Link } from "wouter";
import { Star } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-neutral-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
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
          
          <div>
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
          
          <div>
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
          
          <div>
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
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-8 text-center text-sm text-neutral-400">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-5 bg-red-600 rounded-sm flex items-center justify-center mr-3">
              <Star className="w-3 h-3 text-white" />
            </div>
            <span className="font-medium">Republic of Turkey</span>
          </div>
          <p>&copy; 2024 Turkey E-Visa Application Service. All rights reserved.</p>
          <p className="mt-2">Official Government Service - Ministry of Culture and Tourism</p>
          <p className="mt-1 text-xs">This service is provided by the Government of Turkey</p>
        </div>
      </div>
    </footer>
  );
}
