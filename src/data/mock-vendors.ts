
import type { Vendor, Service } from '@/types';
import images from '@/app/lib/placeholder-images.json';

export const mockServices: { [vendorId: string]: Service[] } = {
  'mock-1': [
    { id: 'service-1a', name: 'Full-Service Wedding Catering', description: 'Complete wedding catering package including appetizers, main course, dessert, and staffing. Customizable menu options available.', category: 'Caterers', priceRange: 'Starting at $150/person', photos: ['https://images.unsplash.com/photo-1551888419-540c1b023280?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1560964593-5b882c35f795?q=80&w=600&auto=format&fit=crop'] },
    { id: 'service-1b', name: 'Corporate Luncheon', description: 'Boxed lunches or buffet-style catering for corporate events. Includes a variety of sandwiches, salads, and drinks.', category: 'Caterers', priceRange: '$25 - $50/person', photos: ['https://images.unsplash.com/photo-1512485800893-b08ec1ea59b1?q=80&w=600&auto=format&fit=crop'] },
  ],
  'mock-2': [
    { id: 'service-2a', name: 'Full-Day Wedding Photography', description: '8 hours of wedding day coverage by two photographers. Includes an online gallery and high-resolution digital files.', category: 'Photographers', priceRange: '$3,500 - $5,000', photos: ['https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop'] },
    { id: 'service-2b', name: 'Engagement Photo Session', description: 'A 90-minute photo session at a location of your choice. Perfect for save-the-dates and wedding websites.', category: 'Photographers', priceRange: '$500', photos: ['https://images.unsplash.com/photo-1455459336873-ae09a4a7c134?q=80&w=600&auto=format&fit=crop'] },
  ],
  'mock-3': [
    { id: 'service-3a', name: 'Bridal Bouquet & Boutonnieres', description: 'Custom-designed bridal bouquet, bridesmaid bouquets, and boutonnieres for the wedding party.', category: 'Florists', priceRange: '$300 - $800', photos: ['https://images.unsplash.com/photo-1567649539314-a7a7c9329953?q=80&w=600&auto=format&fit=crop'] },
    { id: 'service-3b', name: 'Ceremony & Reception Decor', description: 'Complete floral decor for your ceremony aisle, arch, and reception centerpieces. Consultation included.', category: 'Florists', priceRange: 'Starting at $2,000', photos: ['https://images.unsplash.com/photo-1572061486928-19e4835e08c9?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=600&auto=format&fit=crop'] },
  ],
  'mock-4': [
    { id: 'service-4a', name: 'Wedding Reception Band', description: '4-hour live performance for your wedding reception. Includes MC services and learning up to 3 new songs.', category: 'Bands', priceRange: '$4,000 - $7,000', photos: ['https://images.unsplash.com/photo-1525373698389-f4143465e6a3?q=80&w=600&auto=format&fit=crop'] },
  ],
  'mock-5': [
    { id: 'service-5a', name: 'Taco Truck Service (3 hours)', description: 'Unlimited tacos for your guests for 3 hours. Includes 3 types of meat, salsas, and all the fixings.', category: 'Taco Trucks', priceRange: '$1,200 - $2,500', photos: ['https://images.unsplash.com/photo-1560614382-74808b6851a3?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1599974579688-85933a1656b7?q=80&w=600&auto=format&fit=crop'] },
  ],
};


export const mockVendors: Vendor[] = [
  {
    id: 'mock-1',
    name: 'Elegant Eats Catering',
    slug: 'elegant-eats-catering-sample',
    tagline: 'Gourmet catering for unforgettable moments.',
    description:
      'Elegant Eats Catering offers a full-service culinary experience, from intimate dinners to grand weddings. Our chefs use only the freshest local ingredients to create exquisite menus tailored to your event. We believe every meal should be a celebration.',
    state: 'California',
    city: 'San Francisco',
    categoryIds: ['caterers', 'wedding-planners', 'beverage-stations'],
    profileImage: images.elegantEats.profileImage,
    bannerImage: images.elegantEats.bannerImage,
    rating: 4.9,
    reviewsCount: 132,
    contactEmail: 'contact@eleganteats.example.com',
  },
  {
    id: 'mock-2',
    name: 'Pixel Perfect Photography',
    slug: 'pixel-perfect-photography-sample',
    tagline: 'Capturing your memories, one pixel at a time.',
    description:
      "We are a team of passionate photographers dedicated to capturing the emotion and beauty of your special day. From candid moments to formal portraits, we provide a comprehensive photography service that tells your unique story. We specialize in weddings, engagements, and family events.",
    state: 'New York',
    city: 'New York City',
    categoryIds: ['photographers', 'videographers'],
    profileImage: images.pixelPerfect.profileImage,
    bannerImage: images.pixelPerfect.bannerImage,
    rating: 4.8,
    reviewsCount: 98,
    contactEmail: 'hello@pixelperfect.example.com',
  },
  {
    id: 'mock-3',
    name: 'The Blooming Garden',
    slug: 'the-blooming-garden-sample',
    tagline: 'Stunning floral designs that transform spaces.',
    description:
      "At The Blooming Garden, we create breathtaking floral arrangements for any occasion. Our designers work with you to bring your vision to life, using fresh, beautiful flowers to craft everything from bouquets and centerpieces to large-scale installations.",
    state: 'Florida',
    city: 'Miami',
    categoryIds: ['florists', 'decor-rentals'],
    profileImage: images.bloomingGarden.profileImage,
    bannerImage: images.bloomingGarden.bannerImage,
    rating: 4.9,
    reviewsCount: 76,
    contactEmail: 'design@bloominggarden.example.com',
  },
  {
    id: 'mock-4',
    name: 'Groove Machine Live Band',
    slug: 'groove-machine-live-band-sample',
    tagline: 'Bringing the party to life with live music!',
    description:
      "Groove Machine is a high-energy 7-piece band that plays everything from classic soul and funk to modern pop hits. We guarantee to get your guests on the dance floor and keep them there all night long. Perfect for weddings, corporate events, and private parties.",
    state: 'Texas',
    city: 'Austin',
    categoryIds: ['bands', 'djs', 'musicians-solo'],
    profileImage: images.grooveMachine.profileImage,
    bannerImage: images.grooveMachine.bannerImage,
    rating: 5.0,
    reviewsCount: 112,
    contactEmail: 'booking@groovemachinelive.example.com',
  },
  {
    id: 'mock-5',
    name: 'Taco Fiesta Truck',
    slug: 'taco-fiesta-truck-sample',
    tagline: 'Authentic street tacos for any event.',
    description:
      'Add a fun and delicious twist to your event with Taco Fiesta! We serve authentic, made-to-order street tacos from our vibrant food truck. Our menu features a variety of meats, fresh salsas, and homemade tortillas. It\'s a guaranteed crowd-pleaser!',
    state: 'California',
    city: 'Los Angeles',
    categoryIds: ['taco-trucks', 'food-trucks', 'taqueros'],
    profileImage: images.tacoFiesta.profileImage,
    bannerImage: images.tacoFiesta.bannerImage,
    rating: 4.7,
    reviewsCount: 204,
    contactEmail: 'fiesta@tacotruck.example.com',
  },
];
