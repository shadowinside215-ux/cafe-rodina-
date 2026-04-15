import React, { useState } from 'react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Input } from './components/ui/input';
import { db, OperationType, handleFirestoreError } from './firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Upload, Loader2, X } from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [uploading, setUploading] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'backgroundImageUrl' | 'galleryImageUrl' | 'aboutImageUrl' | 'logoImageUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(field);
    setStatus(null);

    const formData = new FormData();
    formData.append('file', file);
    
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setStatus({ 
        type: 'error', 
        message: 'Cloudinary is not configured. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in the environment.' 
      });
      setUploading(null);
      return;
    }

    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      const newUrl = data.secure_url;
      
      // Update Firestore
      const settingsRef = doc(db, 'settings', 'global');
      await setDoc(settingsRef, {
        [field]: newUrl,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      setStatus({ type: 'success', message: `${field.replace('ImageUrl', '')} updated successfully!` });
    } catch (error) {
      console.error('Upload error:', error);
      setStatus({ type: 'error', message: 'Failed to upload image. Please check Cloudinary settings.' });
    } finally {
      setUploading(null);
    }
  };

  const ImageUploadSection = ({ label, field }: { label: string, field: 'backgroundImageUrl' | 'galleryImageUrl' | 'aboutImageUrl' | 'logoImageUrl' }) => (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-accent/70 mb-2">
        {label}
      </label>
      <div className="relative group">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e, field)}
          className="hidden"
          id={`upload-${field}`}
          disabled={!!uploading}
        />
        <label
          htmlFor={`upload-${field}`}
          className="flex flex-col items-center justify-center border-2 border-dashed border-accent/20 rounded-xl p-6 cursor-pointer hover:border-accent/50 transition-colors bg-brown-900/40"
        >
          {uploading === field ? (
            <Loader2 className="animate-spin text-accent" size={24} />
          ) : (
            <>
              <Upload className="text-accent mb-2" size={24} />
              <span className="text-[10px] text-grey-300">Click to upload</span>
            </>
          )}
        </label>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <Card className="w-full max-w-md bg-brown-900 border border-accent/30 p-8 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-grey-400 hover:text-accent">
          <X size={24} />
        </button>
        
        <h2 className="font-serif text-2xl text-accent mb-6">Admin Panel</h2>
        
        <div className="space-y-8">
          <ImageUploadSection label="Website Logo" field="logoImageUrl" />
          <ImageUploadSection label="Website Background" field="backgroundImageUrl" />
          <ImageUploadSection label="Gallery Image (Next to Menu)" field="galleryImageUrl" />
          <ImageUploadSection label="About Section Image" field="aboutImageUrl" />

          {status && (
            <div className={`p-3 rounded-lg text-sm font-medium ${status.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {status.message}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
