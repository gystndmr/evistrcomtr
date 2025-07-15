import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface InsuranceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGetInsurance: () => void;
}

export function InsuranceModal({ isOpen, onClose, onGetInsurance }: InsuranceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-yellow-500" />
          </div>
          <DialogTitle className="text-center">E-Visa Not Available</DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <p className="text-neutral-600">
            Unfortunately, e-visa service is not available for your country. However, we can help you with travel insurance for your trip to Turkey.
          </p>
          <div className="flex space-x-4">
            <Button onClick={onGetInsurance} className="flex-1">
              Get Travel Insurance
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
