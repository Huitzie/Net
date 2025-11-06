
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
  id: string; // Same as User UID
  name: string;
  slug: string;
  tagline?: string;
  description: string;
  state: string;
  city: string;
  categories: string[]; // array of category names. Should be updated based on services.
  categoryIds?: string[]; // array of category IDs.
  services?: Service[]; // Kept for local display, but services are now a subcollection
  reviews?: Review[]; // Kept for local display, reviews could be a subcollection
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
  email: string | null;
  firstName: string;
  lastName: string;
  accountType: UserAccountType;
  createdAt: any; // Firestore Timestamp
}

export interface ClientProfile {
  // Composite key: 'vendorId_serviceId'
  favoriteVendorIds?: string[];
}

// No longer needed as we are not creating a separate vendor profile document
// export interface VendorProfile extends User {
//   vendorDetailsId: string; // Link to Vendor data
// }
