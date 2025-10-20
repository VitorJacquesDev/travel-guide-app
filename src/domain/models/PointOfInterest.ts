/**
 * Coordinates value object representing geographical location
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Contact information value object
 */
export interface ContactInfo {
  phone?: string;
  website?: string;
}

/**
 * Metadata value object for tracking creation and updates
 */
export interface Metadata {
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Category enumeration for points of interest
 */
export enum Category {
  ATTRACTIONS = 'attractions',
  RESTAURANTS = 'restaurants',
  HOTELS = 'hotels',
  CULTURE = 'culture',
  NATURE = 'nature',
  ENTERTAINMENT = 'entertainment',
  SHOPPING = 'shopping',
  SPORTS = 'sports',
}

/**
 * Price range enumeration
 */
export enum PriceRange {
  FREE = 'free',
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  LUXURY = 'luxury',
}

/**
 * Point of Interest domain entity
 * Represents a tourist attraction, landmark, or place of interest
 */
export interface PointOfInterest {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly coordinates: Coordinates;
  readonly location: Coordinates; // Alias for coordinates (for compatibility)
  readonly category: Category;
  readonly rating: number; // 0-5 scale
  readonly priceRange: PriceRange;
  readonly images: readonly string[];
  readonly imageUrl?: string; // Primary image URL (for compatibility)
  readonly address: string;
  readonly contactInfo?: ContactInfo;
  readonly operatingHours?: readonly string[];
  readonly tags: readonly string[];
  readonly metadata: Metadata;
}

/**
 * Factory function to create a new PointOfInterest
 */
export const createPointOfInterest = (params: {
  id: string;
  name: string;
  description: string;
  coordinates: Coordinates;
  category: Category;
  rating: number;
  priceRange: PriceRange;
  images: string[];
  address: string;
  contactInfo?: ContactInfo;
  operatingHours?: string[];
  tags: string[];
  metadata?: Metadata;
}): PointOfInterest => {
  // Validate rating is within bounds
  if (params.rating < 0 || params.rating > 5) {
    throw new Error('Rating must be between 0 and 5');
  }

  // Validate coordinates
  if (params.coordinates.latitude < -90 || params.coordinates.latitude > 90) {
    throw new Error('Latitude must be between -90 and 90');
  }
  if (params.coordinates.longitude < -180 || params.coordinates.longitude > 180) {
    throw new Error('Longitude must be between -180 and 180');
  }

  const now = new Date();
  
  return {
    id: params.id,
    name: params.name.trim(),
    description: params.description.trim(),
    coordinates: params.coordinates,
    location: params.coordinates, // Alias for coordinates
    category: params.category,
    rating: params.rating,
    priceRange: params.priceRange,
    images: Object.freeze([...params.images]),
    imageUrl: params.images.length > 0 ? params.images[0] : undefined,
    address: params.address.trim(),
    contactInfo: params.contactInfo,
    operatingHours: params.operatingHours ? Object.freeze([...params.operatingHours]) : undefined,
    tags: Object.freeze([...params.tags.map(tag => tag.toLowerCase().trim())]),
    metadata: params.metadata || {
      createdAt: now,
      updatedAt: now,
    },
  };
};