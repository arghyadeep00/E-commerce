import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(url: string | undefined | null): string {
  if (!url) return "https://placehold.co/400x400/png?text=Product";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  let cleanUrl = url.replace(/\\/g, '/');
  cleanUrl = cleanUrl.replace(/^(\.\.\/|\.\/|\/)+/, '');
  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000';
  return `${API_BASE}/${cleanUrl}`;
}
