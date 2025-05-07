
import type { Vendor } from '@/types';
import { categories as allCategoriesList } from '@/data/categories';

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
  },
   {
    id: '9',
    name: 'Elegant Events Decor',
    slug: 'elegant-events-decor',
    tagline: 'Transforming Spaces, Creating Memories.',
    description: 'Specializing in unique and stylish event decor, from floral arrangements to custom lighting and themed props. We work closely with you to bring your vision to life.',
    state: 'California',
    city: 'San Francisco',
    categories: ['Florists', 'Event Lighting', 'Decor Rentals'],
    profileImage: 'https://picsum.photos/seed/decor1/400/300',
    bannerImage: 'https://picsum.photos/seed/decor1banner/1200/400',
    rating: 4.7,
    reviewsCount: 65,
    contactEmail: 'contact@elegantevents.example.com',
    phoneNumber: '555-0102',
    website: 'https://elegantevents.example.com',
    services: [
      {
        id: 's9-1',
        name: 'Full Event Design & Decor',
        description: 'Comprehensive decor package including consultation, mood board creation, floral design, lighting, and on-site setup and takedown.',
        category: 'Decor Rentals',
        photos: ['https://picsum.photos/seed/decorservice1/600/400', 'https://picsum.photos/seed/decorservice2/600/400'],
        priceRange: 'Starting at $2,000'
      },
      {
        id: 's9-2',
        name: 'Custom Floral Centerpieces',
        description: 'Beautifully crafted floral centerpieces tailored to your event theme and color palette. Various sizes and styles available.',
        category: 'Florists',
        photos: ['https://picsum.photos/seed/floralservice1/600/400'],
        priceRange: '$75 - $300 per centerpiece'
      }
    ]
  },
  {
    id: '10',
    name: 'DJ Sparkle Sounds',
    slug: 'dj-sparkle-sounds',
    tagline: 'Keeping the Party Alive!',
    description: 'Professional DJ services for weddings, parties, corporate events, and more. Extensive music library covering all genres, and top-of-the-line sound equipment.',
    state: 'New York',
    city: 'Brooklyn',
    categories: ['DJs', 'Audio/Visual Rentals'],
    profileImage: 'https://picsum.photos/seed/dj1/400/300',
    bannerImage: 'https://picsum.photos/seed/dj1banner/1200/400',
    rating: 4.9,
    reviewsCount: 110,
    contactEmail: 'bookings@sparklesounds.example.com',
    services: [
      {
        id: 's10-1',
        name: 'Wedding DJ Package',
        description: 'Includes up to 5 hours of DJ service, MC duties, professional sound system, dance floor lighting, and consultation.',
        category: 'DJs',
        photos: ['https://picsum.photos/seed/djservice1/600/400'],
        priceRange: '$800 - $1500'
      },
      {
        id: 's10-2',
        name: 'Corporate Event Sound & Music',
        description: 'Sound system rental, background music, and DJ services for corporate functions, conferences, and holiday parties.',
        category: 'Audio/Visual Rentals',
        photos: ['https://picsum.photos/seed/corpsound1/600/400'],
        priceRange: 'Custom Quote'
      }
    ]
  },
  {
    id: '11',
    name: 'Gourmet Catering Co.',
    slug: 'gourmet-catering-co',
    tagline: 'Exquisite Food for Every Occasion.',
    description: 'Full-service catering company offering a diverse range of cuisines, from buffet style to plated dinners. We focus on fresh, locally-sourced ingredients.',
    state: 'Illinois',
    city: 'Chicago',
    categories: ['Caterers', 'Food Trucks (General)'], // Example: might also have a food truck
    profileImage: 'https://picsum.photos/seed/catering1/400/300',
    bannerImage: 'https://picsum.photos/seed/cateringbanner1/1200/400',
    rating: 4.8,
    reviewsCount: 92,
    contactEmail: 'events@gourmetcatering.example.com',
    services: [
      {
        id: 's11-1',
        name: 'Buffet Style Catering',
        description: 'Customizable buffet menu with a wide selection of appetizers, main courses, sides, and desserts. Includes setup and serving staff.',
        category: 'Caterers',
        photos: ['https://picsum.photos/seed/buffet1/600/400', 'https://picsum.photos/seed/buffet2/600/400'],
        priceRange: '$40 - $75 per person'
      }
    ]
  },
  {
    id: '12',
    name: 'Rustic Charm Rentals',
    slug: 'rustic-charm-rentals',
    tagline: 'Vintage and Rustic Event Furnishings.',
    description: 'Unique collection of rustic and vintage furniture, props, and decor items for weddings and events. From farm tables to antique sofas.',
    state: 'Texas',
    city: 'Dallas',
    categories: ['Party Rentals (Tables, Chairs, Linens)', 'Decor Rentals'],
    profileImage: 'https://picsum.photos/seed/rustic1/400/300',
    rating: 4.6,
    reviewsCount: 55,
    services: [
      {
        id: 's12-1',
        name: 'Farm Table & Bench Rental',
        description: 'Handcrafted wooden farm tables (8ft) with matching benches. Perfect for rustic or bohemian themed events.',
        category: 'Party Rentals (Tables, Chairs, Linens)',
        photos: ['https://picsum.photos/seed/farmtable1/600/400'],
        priceRange: '$150 per table/bench set'
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
      const category = allCategoriesList.find(c => c.name === catName);
      return category?.id === categoryId;
    })
  ).slice(0, 10); // Limit to 10 results
};

interface SearchFilters {
  state?: string;
  city?: string;
  categoryId?: string;
  keyword?: string; // Added keyword filter
}

export const searchVendors = (filters: SearchFilters): Vendor[] => {
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
        // Ensure allCategoriesList is used here for consistency
        const category = allCategoriesList.find(c => c.name === catName); 
        return category?.id === filters.categoryId;
      })
    );
  }
  if (filters.keyword) {
    const keywordLower = filters.keyword.toLowerCase();
    filteredVendors = filteredVendors.filter(v => 
      v.name.toLowerCase().includes(keywordLower) ||
      v.description.toLowerCase().includes(keywordLower) ||
      (v.tagline && v.tagline.toLowerCase().includes(keywordLower)) ||
      v.categories.some(cat => cat.toLowerCase().includes(keywordLower)) ||
      v.services.some(service => 
        service.name.toLowerCase().includes(keywordLower) ||
        service.description.toLowerCase().includes(keywordLower)
      )
    );
  }
  return filteredVendors.slice(0, 10); // Limit to 10 results
};
