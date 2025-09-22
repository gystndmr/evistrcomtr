import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { VisaForm } from "@/components/visa-form";
import { Star } from "lucide-react";
import turkeyFlag from "@/assets/turkey-flag_1752583610847.png";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Application() {
  const { toast } = useToast();
  const { t } = useLanguage();

  // Seed initial data on component mount
  const seedMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/seed");
    },
    onError: (error) => {
      console.error("Failed to seed data:", error);
    },
  });

  useEffect(() => {
    // Seed data when component mounts
    seedMutation.mutate();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative bg-gradient-to-br from-blue-50 to-red-50 min-h-screen">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-5"></div>
        {/* E-Visa Application Header */}
        <div className="text-center py-12 mb-8">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg">
              <img 
                src={turkeyFlag}
                alt="Turkey Flag"
                className="w-8 h-8 rounded"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            E-Visa Application
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete your Turkey e-visa application in simple steps
          </p>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <VisaForm />
        </div>
      </section>

      <Footer />
    </div>
  );
}
