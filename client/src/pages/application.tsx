import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { VisaForm } from "@/components/visa-form";
import { Star } from "lucide-react";
import turkeyFlag from "@/assets/turkey-flag_1752583610847.png";
import teamPhoto from "@/assets/team-photo.png";
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
      
      <section className="relative py-8 sm:py-16 bg-gradient-to-br from-blue-50 to-red-50 min-h-screen">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-5"></div>
        {/* Team Photo - Full Width & Short */}
        <div className="w-full mb-4">
          <img 
            src={teamPhoto}
            alt="Our Professional Team"
            className="w-full h-24 sm:h-32 object-cover object-center"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <VisaForm />
        </div>
      </section>

      <Footer />
    </div>
  );
}
