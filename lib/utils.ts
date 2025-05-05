import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format coordinates into a readable string (e.g., 12.345678° N, 98.765432° E)
export function formatCoordinates(latitude: number, longitude: number): string {
  const latDir = latitude >= 0 ? 'N' : 'S';
  const lngDir = longitude >= 0 ? 'E' : 'W';
  
  return `${Math.abs(latitude).toFixed(6)}° ${latDir}, ${Math.abs(longitude).toFixed(6)}° ${lngDir}`;
}

// Get severity level text based on numeric rating (1-10)
export function getSeverityLevel(rating: number): string {
  if (rating <= 3) return 'Low';
  if (rating <= 6) return 'Medium';
  if (rating <= 8) return 'High';
  return 'Severe';
}

// Generate a readable timestamp from a Date or ISO string
export function formatTimestamp(timestamp: Date | string): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}