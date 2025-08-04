import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Cookie, Shield, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a brief delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now()
    }));
    setIsVisible(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now()
    }));
    setIsVisible(false);
  };

  const rejectAll = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true, // Necessary cookies cannot be rejected
      analytics: false,
      marketing: false,
      timestamp: Date.now()
    }));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
      <div className="max-w-7xl mx-auto p-4">
        {!showDetails ? (
          // Simple banner
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Cookie className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {t('cookies.title')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('cookies.description')}{' '}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                    {t('cookies.privacy.policy')}
                  </Link>
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(true)}
                className="text-sm"
              >
                <Settings className="w-4 h-4 mr-1" />
                {t('cookies.manage')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={acceptNecessary}
                className="text-sm"
              >
                {t('cookies.necessary.only')}
              </Button>
              <Button
                size="sm"
                onClick={acceptAll}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {t('cookies.accept.all')}
              </Button>
            </div>
          </div>
        ) : (
          // Detailed preferences
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Cookie className="w-5 h-5 text-blue-600" />
                {t('cookies.preferences')}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <h4 className="font-medium text-gray-900">{t('cookies.necessary')}</h4>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {t('cookies.required')}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {t('cookies.necessary.description')}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <h4 className="font-medium text-gray-900">{t('cookies.analytics')}</h4>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {t('cookies.optional')}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {t('cookies.analytics.description')}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-purple-600 rounded"></div>
                  <h4 className="font-medium text-gray-900">{t('cookies.marketing')}</h4>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    {t('cookies.optional')}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {t('cookies.marketing.description')}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={rejectAll}
              >
                {t('cookies.reject.all')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={acceptNecessary}
              >
                {t('cookies.necessary.only')}
              </Button>
              <Button
                size="sm"
                onClick={acceptAll}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {t('cookies.accept.all')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}