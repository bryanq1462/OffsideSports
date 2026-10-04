import React from 'react';

// Fallback SVG Data URI representing a high-res styled soccer jersey with OFFSIDE branding
export const DEFAULT_JERSEY_FALLBACK_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="500" height="600"><rect width="500" height="600" fill="%23111827"/><g transform="translate(50, 40)"><path d="M110,60 Q200,100 290,60 L380,120 L330,200 L290,170 L290,460 L110,460 L110,170 L70,200 L20,120 Z" fill="%2300e652" opacity="0.95" stroke="%23ffffff" stroke-width="6" stroke-linejoin="round"/><path d="M160,60 Q200,95 240,60" fill="none" stroke="%23111827" stroke-width="10"/><text x="200" y="270" text-anchor="middle" fill="%23111827" font-family="system-ui, sans-serif" font-weight="900" font-size="32" letter-spacing="2">OFFSIDE</text><text x="200" y="315" text-anchor="middle" fill="%23111827" font-family="system-ui, sans-serif" font-weight="900" font-size="22" letter-spacing="4">SPORTS</text><rect x="120" y="360" width="160" height="40" rx="8" fill="%23111827" opacity="0.2"/><text x="200" y="386" text-anchor="middle" fill="%23111827" font-family="monospace" font-weight="bold" font-size="16">OFFSIDE STORE</text></g></svg>`;

// Fallback SVG Data URI representing a professional soccer match ball with OFFSIDE branding
export const DEFAULT_BALL_FALLBACK_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500"><rect width="500" height="500" fill="%230a0a0a"/><circle cx="250" cy="250" r="190" fill="%2318181b" stroke="%2300e652" stroke-width="8"/><polygon points="250,140 310,185 285,255 215,255 190,185" fill="%2300e652"/><polygon points="250,140 250,75 325,100 310,185" fill="%2327272a" stroke="%2300e652" stroke-width="4"/><polygon points="310,185 385,200 365,275 285,255" fill="%2327272a" stroke="%2300e652" stroke-width="4"/><polygon points="285,255 315,335 250,380 250,320" fill="%2327272a" stroke="%2300e652" stroke-width="4"/><polygon points="215,255 250,320 185,335 135,275" fill="%2327272a" stroke="%2300e652" stroke-width="4"/><polygon points="190,185 215,255 135,275 115,200" fill="%2327272a" stroke="%2300e652" stroke-width="4"/><polygon points="190,185 250,140 250,75 175,100" fill="%2327272a" stroke="%2300e652" stroke-width="4"/><text x="250" y="420" text-anchor="middle" fill="%2300e652" font-family="system-ui, sans-serif" font-weight="900" font-size="24" letter-spacing="4">OFFSIDE MATCH BALL</text></svg>`;

export const handleBallImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  handleImageError(e, DEFAULT_BALL_FALLBACK_IMAGE);
};

export function normalizeImageSrc(src?: string): string {
  if (!src) return '';
  const trimmed = src.trim();
  if (trimmed.startsWith('data:') || trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('blob:')) {
    return trimmed;
  }
  if (trimmed.startsWith('/9j/')) {
    return `data:image/jpeg;base64,${trimmed}`;
  }
  if (trimmed.startsWith('iVBOR')) {
    return `data:image/png;base64,${trimmed}`;
  }
  return trimmed;
}

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

export function compressImageFile(file: File, maxWidth = 720, maxHeight = 850, quality = 0.70): Promise<string> {
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
          let dataUrl = canvas.toDataURL('image/jpeg', quality);
          // If still over 180KB string length, re-compress with slightly lower quality to keep it ultra lightweight
          if (dataUrl.length > 180000) {
            dataUrl = canvas.toDataURL('image/jpeg', 0.55);
          }
          resolve(dataUrl);
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

