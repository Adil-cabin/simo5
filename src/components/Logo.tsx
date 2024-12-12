import React from 'react';
import { useImageUpload } from '../hooks/useImageUpload';
import { useAuth } from '../contexts/AuthContext';
import { useLogo } from '../contexts/LogoContext';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const { hasPermission } = useAuth();
  const { logoUrl, updateLogo, isLoading } = useLogo();
  const canEdit = hasPermission('manage_users');

  const { handleImageSelect, isUploading } = useImageUpload({
    onImageSelected: async (file) => {
      try {
        await updateLogo(file);
      } catch (error) {
        console.error('Error updating logo:', error);
      }
    },
    maxWidth: 200,
    maxHeight: 200
  });

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`relative group ${className}`}>
      <img
        src={logoUrl || '/logo.svg'}
        alt="Cabinet de Psychiatrie SATLI Mina"
        className={`${sizes[size]} ${(isLoading || isUploading) ? 'opacity-50' : ''} ${
          canEdit ? 'cursor-pointer' : ''
        }`}
        onClick={() => canEdit && document.getElementById('logo-upload')?.click()}
      />
      
      {canEdit && (
        <>
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
            <span className="text-white text-xs">Modifier le logo</span>
          </div>
          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </>
      )}
    </div>
  );
}