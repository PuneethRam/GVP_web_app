'use client';

import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, FileImage, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Webcam from 'react-webcam';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
}

export function FileUpload({ onFilesChange }: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      addFiles(newFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    // Filter for supported types
    const supportedFiles = newFiles.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    if (supportedFiles.length === 0) return;
    
    const updatedFiles = [...selectedFiles, ...supportedFiles];
    setSelectedFiles(updatedFiles);
    onFilesChange(updatedFiles);
    
    // Generate previews
    const newPreviews = supportedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
    onFilesChange(updatedFiles);
    
    // Remove and revoke the preview URL to avoid memory leaks
    URL.revokeObjectURL(previews[index]);
    const updatedPreviews = [...previews];
    updatedPreviews.splice(index, 1);
    setPreviews(updatedPreviews);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const startCameraCapture = () => {
    setShowCamera(true);
  };

  const stopCameraCapture = () => {
    setShowCamera(false);
  };

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        // Convert base64 image to File object
        fetch(imageSrc)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            addFiles([file]);
            stopCameraCapture();
          });
      }
    }
  }, [webcamRef]);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment" // Use rear camera on mobile devices
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">Upload Evidence</h3>
        <span className="text-xs text-gray-500">
          {selectedFiles.length} file(s) selected
        </span>
      </div>
      
      {!showCamera ? (
        <div className="flex space-x-2 mb-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2"
            onClick={triggerFileInput}
          >
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2"
            onClick={startCameraCapture}
          >
            <Camera className="h-4 w-4" />
            <span>Capture</span>
          </Button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*"
            multiple
            className="hidden"
          />
        </div>
      ) : (
        <div className="mb-4">
          <div className="relative rounded-md overflow-hidden mb-2">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full"
              mirrored={false}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={stopCameraCapture}
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </Button>
            
            <Button
              type="button"
              variant="default"
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white"
              onClick={capturePhoto}
            >
              <Camera className="h-4 w-4" />
              <span>Take Photo</span>
            </Button>
          </div>
        </div>
      )}
      
      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((preview, index) => (
            <div 
              key={index} 
              className="relative group h-[80px] bg-gray-100 rounded-md overflow-hidden"
            >
              {selectedFiles[index].type.startsWith('image/') ? (
                <>
                  <img 
                    src={preview} 
                    alt={`Preview ${index}`} 
                    className="w-full h-full object-cover"
                  />
                  <FileImage className="absolute top-1 right-1 h-3 w-3 text-white drop-shadow-md" />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <Film className="h-8 w-8 text-white opacity-70" />
                </div>
              )}
              
              <button
                type="button"
                onClick={() => removeFile(index)}
                className={cn(
                  "absolute top-0 right-0 p-1 rounded-full bg-red-500 text-white opacity-0",
                  "group-hover:opacity-100 transition-opacity"
                )}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileUpload;