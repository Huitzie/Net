
export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface Service {
  id:string;
  name: string;
  description: string;
  category: string; // category name
  photos: string[]; // array of image URLs
  priceRange?: string; // e.g., "$50 - $200"
}

export interface Review {
  id: string;
  author: string;
  avatar?: string; // URL to author's avatar
  rating: number; // e.g., 4.5
  comment: string;
  date: string; // ISO date string
}

export interface Vendor {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description: string;
  state: string;
  city: string;
  categories: string[]; // array of category names
  services: Service[];
  reviews?: Review[];
  profileImage: string; // URL
  bannerImage?: string; // URL
  rating?: number;
  reviewsCount?: number;
  contactEmail?: string;
  phoneNumber?: string;
  website?: string;
}

export type UserAccountType = 'client' | 'vendor';

export interface User {
  id: string;
  name: string;
  email: string;
  accountType: UserAccountType;
}

export interface ClientProfile extends User {
  favoriteVendorIds: string[];
}

export interface VendorProfile extends User {
  vendorDetailsId: string; // Link to Vendor data
}
