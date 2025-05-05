'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { GeoLocation } from '@/types';
import { Button } from '@/components/ui/button';

interface LocationButtonProps {
  onLocationChange: (location: GeoLocation | null) => void;
}

export function LocationButton({ onLocationChange }: LocationButtonProps) {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        
        setLocation(newLocation);
        onLocationChange(newLocation);
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Please allow location access to continue');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable');
            break;
          case error.TIMEOUT:
            setError('The request to get location timed out');
            break;
          default:
            setError('An unknown error occurred');
            break;
        }
        
        onLocationChange(null);
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="my-4">
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
        onClick={getLocation}
        disabled={isLoading}
      >
        <MapPin className="h-4 w-4" />
        {isLoading ? 'Getting Location...' : 'Enable Location'}
      </Button>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      {location && (
        <div className="mt-2 p-3 bg-muted rounded-md text-xs">
          <p className="font-medium mb-1">Current Location:</p>
          <p>Latitude: {location.latitude.toFixed(6)}</p>
          <p>Longitude: {location.longitude.toFixed(6)}</p>
          {location.accuracy && (
            <p className="text-muted-foreground">
              Accuracy: ±{Math.round(location.accuracy)}m
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default LocationButton;