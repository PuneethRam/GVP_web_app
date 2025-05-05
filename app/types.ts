// Define the types for garbage level
export type GarbageLevel = 'Low' | 'Medium' | 'High';

// Define the types for waste type
export type WasteType = 
  | 'Plastic'
  | 'Organic'
  | 'E-waste'
  | 'Medical'
  | 'Construction'
  | 'Household'
  | 'Industrial'
  | 'Other';

// Define the geo location structure
export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

// Define the report structure
export interface Report {
  id: string;
  garbageLevel: GarbageLevel;
  wasteType: WasteType;
  remarks?: string;
  location: GeoLocation;
  imageUrls: string[];
  videoUrls: string[];
  createdAt: string;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
}