

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
  categoryIds?: string[]; // array of category IDs.
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

export interface Event {
    id: string;
    name: string;
    date?: any; // Firestore Timestamp
    clientId: string;
    favoritedVendorServiceIds?: string[];
}

export interface Conversation {
    id: string;
    participantIds: string[];
    lastMessage?: string;
    lastMessageTimestamp?: any; // Firestore Timestamp
    readBy: string[];
}

export interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: any; // Firestore Timestamp
}

export interface Rating {
    id: string;
    clientId: string;
    vendorId: string;
    bookingId: string;
    rating: number; // 1-10
    comment?: string;
    timestamp: any; // Firestore Timestamp
}

export interface Booking {
    id: string;
    clientId: string;
    vendorId: string;
    serviceId: string;
    status: 'pending' | 'confirmed_by_vendor' | 'confirmed_by_client' | 'hired' | 'completed' | 'cancelled';
    clientConfirmation: boolean;
    vendorConfirmation: boolean;
}
