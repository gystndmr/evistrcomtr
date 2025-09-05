import { Card, CardContent } from "@/components/ui/card";
import { Home, Search, Phone } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50">
      <Card className="w-full max-w-md mx-4 bg-white shadow-xl">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-red-600 text-4xl">🔍</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
            <p className="text-gray-600">
              The page you are looking for doesn't exist. Please return to the homepage or track your visa application.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Home className="w-4 h-4 mr-2" />
                Back to Homepage
              </Button>
            </Link>
            
            <Link href="/status">
              <Button variant="outline" className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Check Application Status
              </Button>
            </Link>
            
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-500 mb-2">Need help? Contact support:</p>
              <div className="flex items-center justify-center text-blue-600">
                <Phone className="w-4 h-4 mr-1" />
                <span className="font-semibold">info@euramedglobal.com</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}