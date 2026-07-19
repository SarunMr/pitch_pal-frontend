"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, File } from "lucide-react";
import { submitKYCAction } from "@/lib/actions/kyc.actions";

interface KYCUploadFormProps {
  onSuccess: () => void;
}

export default function KYCUploadForm({ onSuccess }: KYCUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [panNumber, setPanNumber] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (selectedFile: File): boolean => {
    setError("");
    const validTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Only JPG, PNG, and PDF files are allowed");
      return false;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File too large. Maximum size is 5MB");
      return false;
    }
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      } else {
        // Reset input
        e.target.value = "";
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload an identity document");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      
      const formData = new FormData();
      formData.append("document", file);
      if (panNumber.trim()) {
        formData.append("panNumber", panNumber.trim());
      }

      const res = await submitKYCAction(formData);
      if (!res?.success) throw new Error(res?.message || "Failed to submit KYC documents");
      
      // Simple alert for success since we aren't introducing new UI libs
      alert("Documents submitted successfully! Redirecting to status page...");
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to submit KYC documents");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Document Upload Zone */}
      <div className="space-y-2">
        <Label className="text-base font-semibold">Identity Document</Label>
        <p className="text-sm text-gray-500 mb-2">
          Upload your Citizenship Card or Passport (JPG, PNG, PDF · Max 5MB)
        </p>
        
        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
            isDragging ? "border-[#1A6B4A] bg-green-50/50" : 
            file ? "border-green-400 bg-green-50/30" : 
            "border-gray-300 hover:border-[#1A6B4A] hover:bg-gray-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !file && fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".jpg,.jpeg,.png,.pdf"
          />
          
          {file ? (
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <File className="w-6 h-6 text-[#1A6B4A]" />
              </div>
              <p className="font-medium text-gray-900 truncate max-w-xs">{file.name}</p>
              <p className="text-sm text-gray-500 mt-1">{formatFileSize(file.size)}</p>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="mt-4 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
              >
                <X className="w-4 h-4 mr-2" /> Remove File
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-base font-medium text-gray-700 mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-500">
                JPG, PNG or PDF (max 5MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* PAN Number */}
      <div className="space-y-2">
        <Label htmlFor="panNumber">PAN Number (optional)</Label>
        <Input 
          id="panNumber" 
          value={panNumber}
          onChange={(e) => setPanNumber(e.target.value)}
          placeholder="Enter your PAN number"
          disabled={isSubmitting}
        />
        <p className="text-xs text-gray-500">
          Your PAN number helps with faster verification
        </p>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-[#1A6B4A] hover:bg-[#124d35] text-white py-6 text-lg rounded-xl"
        disabled={!file || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <div className="h-5 w-5 mr-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit for Verification"
        )}
      </Button>
    </form>
  );
}
