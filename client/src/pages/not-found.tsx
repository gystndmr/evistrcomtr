import { Card, CardContent } from "@/components/ui/card";
import { Home, MapPin } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
      <Card className="w-full max-w-md mx-4 bg-white shadow-xl">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-4xl">🍯</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sayfa Bulunamadı</h1>
            <p className="text-gray-600">
              Aradığınız sayfa mevcut değil. Belki de taze lokmalarımızın tadına bakmak istersiniz?
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                <Home className="w-4 h-4 mr-2" />
                Ana Sayfaya Dön
              </Button>
            </Link>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Ya da bugün nerede olduğumuzu öğrenin:</p>
              <div className="flex items-center justify-center text-orange-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="font-semibold">05370625550</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
