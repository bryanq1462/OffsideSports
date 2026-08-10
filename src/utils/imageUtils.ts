import React from 'react';

// Fallback SVG Data URI representing a high-res styled soccer jersey with OFFSIDE branding
export const DEFAULT_JERSEY_FALLBACK_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="500" height="600"><rect width="500" height="600" fill="%23111827"/><g transform="translate(50, 40)"><path d="M110,60 Q200,100 290,60 L380,120 L330,200 L290,170 L290,460 L110,460 L110,170 L70,200 L20,120 Z" fill="%2300e652" opacity="0.95" stroke="%23ffffff" stroke-width="6" stroke-linejoin="round"/><path d="M160,60 Q200,95 240,60" fill="none" stroke="%23111827" stroke-width="10"/><text x="200" y="270" text-anchor="middle" fill="%23111827" font-family="system-ui, sans-serif" font-weight="900" font-size="32" letter-spacing="2">OFFSIDE</text><text x="200" y="315" text-anchor="middle" fill="%23111827" font-family="system-ui, sans-serif" font-weight="900" font-size="22" letter-spacing="4">SPORTS</text><rect x="120" y="360" width="160" height="40" rx="8" fill="%23111827" opacity="0.2"/><text x="200" y="386" text-anchor="middle" fill="%23111827" font-family="monospace" font-weight="bold" font-size="16">OFFSIDE STORE</text></g></svg>`;

export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  customFallback?: string
) => {
  const target = e.currentTarget;
  const fallback = customFallback || DEFAULT_JERSEY_FALLBACK_IMAGE;
  if (target.src !== fallback) {
    target.onerror = null; // prevent infinite loops
    target.src = fallback;
  }
};

export function compressImageFile(file: File, maxWidth = 900, maxHeight = 1000, quality = 0.75): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve((event.target?.result as string) || '');
        }
      };
      img.onerror = () => {
        resolve((event.target?.result as string) || '');
      };
      img.src = (event.target?.result as string) || '';
    };
    reader.onerror = () => {
      resolve('');
    };
    reader.readAsDataURL(file);
  });
}

