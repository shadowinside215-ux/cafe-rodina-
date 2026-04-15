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
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
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
      setUploading(false);
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
      setImageUrl(newUrl);
      
      // Update Firestore
      const settingsRef = doc(db, 'settings', 'global');
      await setDoc(settingsRef, {
        backgroundImageUrl: newUrl,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      setStatus({ type: 'success', message: 'Background updated successfully!' });
    } catch (error) {
      console.error('Upload error:', error);
      setStatus({ type: 'error', message: 'Failed to upload image. Please check Cloudinary settings.' });
      // handleFirestoreError(error, OperationType.WRITE, 'settings/global');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = async () => {
    if (!imageUrl) return;
    setUploading(true);
    setStatus(null);

    try {
      const settingsRef = doc(db, 'settings', 'global');
      await setDoc(settingsRef, {
        backgroundImageUrl: imageUrl,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setStatus({ type: 'success', message: 'Background updated successfully!' });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/global');
      setStatus({ type: 'error', message: 'Failed to update background.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <Card className="w-full max-w-md bg-brown-900 border border-accent/30 p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-grey-400 hover:text-accent">
          <X size={24} />
        </button>
        
        <h2 className="font-serif text-2xl text-accent mb-6">Admin Panel</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-accent/70 mb-2">
              Website Background
            </label>
            <div className="flex flex-col gap-4">
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                  id="bg-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="bg-upload"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-accent/20 rounded-xl p-8 cursor-pointer hover:border-accent/50 transition-colors bg-brown-900/40"
                >
                  {uploading ? (
                    <Loader2 className="animate-spin text-accent" size={32} />
                  ) : (
                    <>
                      <Upload className="text-accent mb-2" size={32} />
                      <span className="text-sm text-grey-300">Click to upload new background</span>
                    </>
                  )}
                </label>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Or paste image URL..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="bg-brown-900/40 border-accent/20 text-grey-200"
                />
                <Button 
                  onClick={handleUrlSubmit} 
                  disabled={uploading || !imageUrl}
                  className="bg-accent text-brown-900 font-bold"
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>

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
