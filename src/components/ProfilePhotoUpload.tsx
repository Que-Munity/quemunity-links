'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';

interface ProfilePhotoUploadProps {
  currentImage?: string | null;
  onUploadSuccess?: (imageUrl: string) => void;
}

export function ProfilePhotoUpload({ currentImage, onUploadSuccess }: ProfilePhotoUploadProps) {
  const { data: session, update } = useSession();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size too large. Maximum size is 5MB.');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload/profile-photo', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setPreview(data.image);
        onUploadSuccess?.(data.image);
        // Update session with new image
        await update({ image: data.image });
        alert('Profile photo updated successfully!');
      } else {
        alert(data.error || 'Failed to upload photo');
        setPreview(currentImage || null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('An error occurred while uploading');
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!confirm('Are you sure you want to remove your profile photo?')) {
      return;
    }

    setUploading(true);

    try {
      const res = await fetch('/api/upload/profile-photo', {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        setPreview(null);
        onUploadSuccess?.(null as any);
        // Update session
        await update({ image: null });
        alert('Profile photo removed successfully!');
      } else {
        alert(data.error || 'Failed to remove photo');
      }
    } catch (error) {
      console.error('Remove error:', error);
      alert('An error occurred while removing photo');
    } finally {
      setUploading(false);
    }
  };

  const displayName = session?.user?.displayName || session?.user?.username || 'User';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Preview */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-4xl overflow-hidden">
          {preview ? (
            <img
              src={preview}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Upload Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {preview ? 'Change Photo' : 'Upload Photo'}
        </button>

        {preview && (
          <button
            onClick={handleRemovePhoto}
            disabled={uploading}
            className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Remove Photo
          </button>
        )}
      </div>

      <p className="text-sm text-gray-600 text-center">
        Supported formats: JPEG, PNG, WebP<br />
        Maximum size: 5MB
      </p>
    </div>
  );
}
