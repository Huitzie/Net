
import type { Vendor } from '@/types';

export const vendors: Vendor[] = [
  {
    id: '1',
    name: 'Taco Fiesta Express',
    slug: 'taco-fiesta-express',
    tagline: 'Authentic Mexican Street Tacos!',
    description: 'We bring the fiesta to you with our delicious, freshly made tacos. Perfect for any event, big or small. Choose from a variety of meats and toppings.',
    state: 'California',
    city: 'Los Angeles',
    categories: ['Taco Trucks', 'Caterers', 'Food Trucks (General)'],
    profileImage: 'https://picsum.photos/seed/taco1/400/300',
    bannerImage: 'https://picsum.photos/seed/taco1banner/1200/400',
    rating: 4.8,
    reviewsCount: 120,
    contactEmail: 'fiesta@example.com',
    phoneNumber: '555-0101',
    website: 'https://tacofiesta.example.com',
    services: [
      {
        id: 's1-1',
        name: 'Classic Taco Bar',
        description: 'Includes 3 types of meat (Asada, Al Pastor, Chicken), tortillas, onions, cilantro, salsa roja, salsa verde, and limes. Priced per person.',
        category: 'Taco Trucks',
        photos: ['https://picsum.photos/seed/tacoservice1/600/400', 'https://picsum.photos/seed/tacoservice2/600/400'],
        priceRange: '$15 - $25 per person'
      },
      {
        id: 's1-2',
        name: 'Deluxe Fiesta Package',
        description: 'Everything in the Classic Taco Bar plus guacamole, sour cream, cheese, rice, and beans. Extended service time.',
        category: 'Taco Trucks',
        photos: ['https://picsum.photos/seed/tacoservice3/600/400'],
        priceRange: '$25 - $35 per person'
      }
    ]
  },
  {
    id: '2',
    name: 'Jump Around Fun',
    slug: 'jump-around-fun',
    tagline: 'Bounce Houses & Party Rentals',
    description: 'Your one-stop shop for inflatable fun! We offer a wide variety of bounce houses, water slides, and obstacle courses. Safety and cleanliness are our top priorities.',
    state: 'California',
    city: 'San Diego',
    categories: ['Jump Houses & Inflatables', 'Party Rentals (Tables, Chairs, Linens)'],
    profileImage: 'https://picsum.photos/seed/jump1/400/300',
    bannerImage: 'https://picsum.photos/seed/jump1banner/1200/400',
    rating: 4.9,
    reviewsCount: 85,
    contactEmail: 'info@jumparound.example.com',
    services: [
      {
        id: 's2-1',
        name: 'Castle Bounce House',
        description: 'Our most popular bounce house! Brightly colored castle theme, suitable for up to 8 children. Dimensions: 15ft x 15ft.',
        category: 'Jump Houses & Inflatables',
        photos: ['https://picsum.photos/seed/jumpservice1/600/400', 'https://picsum.photos/seed/jumpservice2/600/400'],
        priceRange: '$150 for 4 hours'
      },
      {
        id: 's2-2',
        name: 'Party Essentials Package',
        description: 'Includes 5 rectangular tables, 30 folding chairs, and basic white linens. Delivery and setup available.',
        category: 'Party Rentals (Tables, Chairs, Linens)',
        photos: ['https://picsum.photos/seed/partyservice1/600/400'],
        priceRange: '$200 + delivery'
      }
    ]
  },
  {
    id: '3',
    name: 'The Mobile Mixologist',
    slug: 'the-mobile-mixologist',
    tagline: 'Craft Cocktails, Anywhere.',
    description: 'Elevate your event with our professional mobile bartending service. We provide experienced mixologists, custom cocktail menus, and a stylish bar setup.',
    state: 'Nevada',
    city: 'Las Vegas',
    categories: ['Mobile Bartenders'],
    profileImage: 'https://picsum.photos/seed/bar1/400/300',
    rating: 4.7,
    reviewsCount: 95,
    services: [
      {
        id: 's3-1',
        name: 'Signature Cocktail Service',
        description: 'Includes 2 custom signature cocktails designed for your event, plus standard bar offerings (beer, wine, basic spirits). Bartender and portable bar included.',
        category: 'Mobile Bartenders',
        photos: ['https://picsum.photos/seed/barservice1/600/400', 'https://picsum.photos/seed/barservice2/600/400'],
        priceRange: 'Starting at $500'
      }
    ]
  },
  {
    id: '4',
    name: 'Sweet Harmony Cakes',
    slug: 'sweet-harmony-cakes',
    tagline: 'Baking Dreams into Reality.',
    description: 'Custom-designed cakes and cupcakes for weddings, birthdays, and all special occasions. We use only the finest ingredients for a taste that\'s as good as it looks.',
    state: 'California',
    city: 'Los Angeles',
    categories: ['Cake Makers', 'Cupcake Bakers'],
    profileImage: 'https://picsum.photos/seed/cake1/400/300',
    bannerImage: 'https://picsum.photos/seed/cake1banner/1200/400',
    rating: 5.0,
    reviewsCount: 210,
    services: [
      {
        id: 's4-1',
        name: 'Custom Wedding Cakes',
        description: 'Multi-tiered wedding cakes designed to your specifications. Includes consultation and tasting session. Various flavors and fillings available.',
        category: 'Cake Makers',
        photos: ['https://picsum.photos/seed/cakeservice1/600/400', 'https://picsum.photos/seed/cakeservice2/600/400'],
        priceRange: '$8 - $15 per slice'
      },
      {
        id: 's4-2',
        name: 'Gourmet Cupcake Dozen',
        description: 'Assorted gourmet cupcakes with premium frostings and toppings. Custom themes available. Minimum order of 2 dozen.',
        category: 'Cupcake Bakers',
        photos: ['https://picsum.photos/seed/cupcakeservice1/600/400'],
        priceRange: '$48 - $72 per dozen'
      }
    ]
  },
  {
    id: '5',
    name: 'The Grand Ballroom',
    slug: 'the-grand-ballroom',
    tagline: 'Elegant Events Start Here.',
    description: 'A stunning historical ballroom perfect for weddings, galas, and corporate events. Features high ceilings, crystal chandeliers, and a large dance floor. Capacity up to 300 guests.',
    state: 'New York',
    city: 'New York City',
    categories: ['Venues'],
    profileImage: 'https://picsum.photos/seed/venue1/400/300',
    bannerImage: 'https://picsum.photos/seed/venue1banner/1200/400',
    rating: 4.9,
    reviewsCount: 150,
    services: [
       {
        id: 's5-1',
        name: 'Full Venue Rental',
        description: 'Exclusive use of The Grand Ballroom for your event. Includes access to bridal suite, catering kitchen, and basic A/V equipment. Staffing options available.',
        category: 'Venues',
        photos: ['https://picsum.photos/seed/venueservice1/600/400', 'https://picsum.photos/seed/venueservice2/600/400'],
        priceRange: '$5,000 - $15,000'
      }
    ]
  },
  {
    id: '6',
    name: 'Snap Happy Photobooths',
    slug: 'snap-happy-photobooths',
    tagline: 'Capture the Fun!',
    description: 'Modern, high-quality photo booths for any event. We offer open-air booths, enclosed booths, green screens, and a wide variety of props and backdrops.',
    state: 'Texas',
    city: 'Austin',
    categories: ['Photo Booths'],
    profileImage: 'https://picsum.photos/seed/photobooth1/400/300',
    services: [
      {
        id: 's6-1',
        name: 'Open-Air Photo Booth Package',
        description: '3-hour rental of our sleek open-air photo booth. Includes unlimited prints, custom photo strip design, an attendant, and digital copies of all photos.',
        category: 'Photo Booths',
        photos: ['https://picsum.photos/seed/photoboothservice1/600/400'],
        priceRange: '$450 - $600'
      }
    ]
  },
  {
    id: '7',
    name: 'Eternal Vows Planners',
    slug: 'eternal-vows-planners',
    tagline: 'Crafting Your Perfect Day',
    description: 'Experienced wedding planners dedicated to making your dream wedding a reality. We offer full planning, partial planning, and day-of coordination services.',
    state: 'Florida',
    city: 'Miami',
    categories: ['Wedding Planners'],
    profileImage: 'https://picsum.photos/seed/planner1/400/300',
    bannerImage: 'https://picsum.photos/seed/planner1banner/1200/400',
    rating: 4.9,
    reviewsCount: 75,
    services: [
      {
        id: 's7-1',
        name: 'Full Wedding Planning',
        description: 'Comprehensive planning from start to finish. Includes budget management, vendor selection, design, logistics, and day-of execution.',
        category: 'Wedding Planners',
        photos: ['https://picsum.photos/seed/plannerservice1/600/400'],
        priceRange: 'Starting at $5,000'
      }
    ]
  },
  {
    id: '8',
    name: 'Groove Masters Band',
    slug: 'groove-masters-band',
    tagline: 'The Soundtrack to Your Celebration',
    description: 'High-energy live band playing a mix of funk, soul, pop, and rock. Perfect for getting your guests on the dance floor!',
    state: 'Illinois',
    city: 'Chicago',
    categories: ['Bands'],
    profileImage: 'https://picsum.photos/seed/band1/400/300',
    services: [
      {
        id: 's8-1',
        name: '5-Piece Band Performance',
        description: '3-hour performance by our 5-piece band (vocals, guitar, bass, drums, keyboard). Includes PA system and basic stage lighting.',
        category: 'Bands',
        photos: ['https://picsum.photos/seed/bandservice1/600/400'],
        priceRange: '$2,500 - $4,000'
      }
    ]
  }
];

export const getVendorBySlug = (slug: string): Vendor | undefined => {
  return vendors.find(vendor => vendor.slug === slug);
};

export const getVendorById = (id: string): Vendor | undefined => {
  return vendors.find(vendor => vendor.id === id);
};

export const getVendorsByLocationAndCategory = (state: string, city: string, categoryId: string): Vendor[] => {
  return vendors.filter(vendor => 
    vendor.state.toLowerCase() === state.toLowerCase() && 
    vendor.city.toLowerCase() === city.toLowerCase() &&
    vendor.categories.some(catName => {
      const category = categories.find(c => c.name === catName);
      return category?.id === categoryId;
    })
  );
};

export const searchVendors = (filters: { state?: string; city?: string; categoryId?: string }): Vendor[] => {
  let filteredVendors = vendors;

  if (filters.state) {
    filteredVendors = filteredVendors.filter(v => v.state.toLowerCase() === filters.state!.toLowerCase());
  }
  if (filters.city) {
    filteredVendors = filteredVendors.filter(v => v.city.toLowerCase() === filters.city!.toLowerCase());
  }
  if (filters.categoryId) {
    filteredVendors = filteredVendors.filter(v => 
      v.categories.some(catName => {
        const category = categories.find(c => c.name === catName);
        return category?.id === filters.categoryId;
      })
    );
  }
  return filteredVendors;
};


// Need to import categories from categories.ts if this file is split.
// For now, assuming it's in the same context or categories data is available.
const categories = [
  { id: 'taco-trucks', name: 'Taco Trucks' },
  { id: 'caterers', name: 'Caterers' },
  { id: 'food-trucks', name: 'Food Trucks (General)' },
  { id: 'jump-houses', name: 'Jump Houses & Inflatables' },
  { id: 'party-rentals', name: 'Party Rentals (Tables, Chairs, Linens)' },
  { id: 'mobile-bartenders', name: 'Mobile Bartenders' },
  { id: 'cake-makers', name: 'Cake Makers' },
  { id: 'cupcake-bakers', name: 'Cupcake Bakers' },
  { id: 'venues', name: 'Venues' },
  { id: 'photo-booths', name: 'Photo Booths' },
  { id: 'wedding-planners', name: 'Wedding Planners' },
  { id: 'bands', name: 'Bands' },
]; // Simplified version for this file context
