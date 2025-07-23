import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, File, X } from "lucide-react";

interface SupportingDocsProps {
  onDocumentUpload: (document: File | null) => void;
  uploadedDocument: File | null;
}

const documentTypes = [
  { value: "hotel", label: "Hotel Reservation" },
  { value: "flight", label: "Flight Reservation" },
  { value: "invitation", label: "Invitation Letter" },
  { value: "financial", label: "Financial Statement" },
  { value: "insurance", label: "Travel Insurance" },
];

export function SupportingDocs({ onDocumentUpload, uploadedDocument }: SupportingDocsProps) {
  const [selectedDocType, setSelectedDocType] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onDocumentUpload(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onDocumentUpload(file);
      }
    }
  };

  const validateFile = (file: File): boolean => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF, JPG, or PNG file.');
      return false;
    }

    if (file.size > maxSize) {
      alert('File size must be less than 10MB.');
      return false;
    }

    return true;
  };

  const removeDocument = () => {
    onDocumentUpload(null);
  };

  return (
    <div className="space-y-6">
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertDescription className="text-yellow-800">
          <strong>Supporting Documents Required</strong>
          <br />
          Your country requires additional supporting documents for e-visa approval.
        </AlertDescription>
      </Alert>

      <div>
        <Label htmlFor="supportingDocType">Document Type *</Label>
        <Select onValueChange={setSelectedDocType}>
          <SelectTrigger>
            <SelectValue placeholder="Select Document Type" />
          </SelectTrigger>
          <SelectContent>
            {documentTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedDocType && (
        <div>
          <Label>Upload Document *</Label>
          {!uploadedDocument ? (
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-neutral-300 hover:border-neutral-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
              <p className="text-sm text-neutral-600 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-neutral-400">
                PDF, JPG, PNG up to 10MB
              </p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          ) : (
            <div className="border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <File className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-neutral-800">
                      {uploadedDocument.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {(uploadedDocument.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeDocument}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
