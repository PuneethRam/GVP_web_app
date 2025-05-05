// GVP Report types
export type GarbageLevel = 'Low' | 'Medium' | 'High';

export type WasteType = 
  | 'Plastic' 
  | 'Organic' 
  | 'E-waste' 
  | 'Medical' 
  | 'Construction' 
  | 'Household' 
  | 'Industrial'
  | 'Other';

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface GVPReport {
  id?: string;
  garbageLevel: GarbageLevel;
  severityRating: number;
  wasteType: WasteType;
  remarks: string;
  location?: GeoLocation;
  imageUrls: string[];
  videoUrls: string[];
  createdAt: Date | string;
  status?: 'pending' | 'reviewed' | 'cleaned';
}

export interface UploadedFile {
  url: string;
  path: string;
  filename: string;
  contentType: string;
  type: 'image' | 'video';
}