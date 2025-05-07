
import type { Category } from '@/types';
import { 
    Utensils, Camera, Music, Tent, Cake, Wine, Home, Palette, Mic, Truck, MapPin, SprayCan, Drama, Flower2, Gem, Users, Castle, Clapperboard, Car, Speaker, Shirt, Gift, Edit3, Handshake, ShieldCheck, Smile, FerrisWheel, Beer, ChefHat, IceCream, Coffee, Pizza, Sandwich, Cookie, UserCheck, Bone, PawPrint, 
    CakeSlice, Layers, LayoutGrid, Popcorn, Candy, Star, RectangleHorizontal, Lightbulb, Bus, Scissors, ListChecks, Sparkles,
    Palette as PaletteIcon // Keep Palette as PaletteIcon alias for existing usage if needed, or simplify if PaletteIcon is always Palette
} from 'lucide-react';

export const categories: Category[] = [
  // Food & Drink
  { id: 'taco-trucks', name: 'Taco Trucks', icon: Truck, description: 'Mobile taco catering services.' },
  { id: 'taqueros', name: 'Taqueros', icon: ChefHat, description: 'Authentic taco makers for events.' },
  { id: 'mobile-bartenders', name: 'Mobile Bartenders', icon: Wine, description: 'Professional bartending services on the go.' },
  { id: 'cake-makers', name: 'Cake Makers', icon: Cake, description: 'Custom cakes for all occasions.' },
  { id: 'cupcakes', name: 'Cupcake Bakers', icon: CakeSlice, description: 'Delicious and custom cupcakes.' },
  { id: 'cookies', name: 'Cookie Bakers', icon: Cookie, description: 'Artisan cookies and treats.' },
  { id: 'caterers', name: 'Caterers', icon: Utensils, description: 'Full-service catering for events.' },
  { id: 'food-trucks', name: 'Food Trucks (General)', icon: Truck, description: 'Various mobile food options.' },
  { id: 'coffee-carts', name: 'Coffee Carts', icon: Coffee, description: 'Mobile coffee and espresso bars.' },
  { id: 'ice-cream-vendors', name: 'Ice Cream Vendors', icon: IceCream, description: 'Ice cream trucks and carts.' },
  { id: 'pizza-ovens', name: 'Mobile Pizza Ovens', icon: Pizza, description: 'Freshly baked pizza at your event.' },
  { id: 'bbq-catering', name: 'BBQ Catering', icon: Sandwich, description: 'Smoked and grilled BBQ delights.' },
  { id: 'dessert-tables', name: 'Dessert Tables', icon: Layers, description: 'Curated dessert buffets.' },
  { id: 'donut-walls', name: 'Donut Walls', icon: LayoutGrid, description: 'Fun and tasty donut displays.' },
  { id: 'popcorn-machines', name: 'Popcorn Machines', icon: Popcorn, description: 'Classic popcorn machine rentals.' },
  { id: 'cotton-candy', name: 'Cotton Candy Machines', icon: Candy, description: 'Sweet spun sugar treats.' },
  { id: 'churro-carts', name: 'Churro Carts', icon: Star, description: 'Fresh, warm churros.' },
  { id: 'beverage-stations', name: 'Beverage Stations', icon: Beer, description: 'Non-alcoholic drink setups.' },

  // Entertainment
  { id: 'bands', name: 'Bands', icon: Music, description: 'Live musical bands for events.' },
  { id: 'djs', name: 'DJs', icon: Speaker, description: 'Professional DJ services.' },
  { id: 'musicians-solo', name: 'Musicians (Solo/Duet)', icon: Mic, description: 'Solo artists, acoustic acts, etc.' },
  { id: 'magicians', name: 'Magicians', icon: Sparkles, description: 'Magic shows for all ages.' },
  { id: 'comedians', name: 'Comedians', icon: Smile, description: 'Stand-up comedians for hire.' },
  { id: 'face-painters', name: 'Face Painters', icon: PaletteIcon, description: 'Artistic face painting for kids and adults.' },
  { id: 'caricaturists', name: 'Caricaturists', icon: Edit3, description: 'Live caricature artists.' },
  { id: 'photo-booths', name: 'Photo Booths', icon: Camera, description: 'Fun photo booth rentals.' },
  { id: 'event-performers', name: 'Event Performers', icon: Drama, description: 'Dancers, acrobats, fire breathers etc.' },
  { id: 'character-actors', name: 'Character Actors/Mascots', icon: UserCheck, description: 'Costumed characters for parties.' },
  { id: 'game-rentals', name: 'Game Rentals (Lawn/Arcade)', icon: FerrisWheel, description: 'Giant Jenga, cornhole, arcade games.' },
  
  // Rentals & Decor
  { id: 'jump-houses', name: 'Jump Houses & Inflatables', icon: Castle, description: 'Bounce houses and inflatable slides.' },
  { id: 'mobile-bathrooms', name: 'Mobile Bathrooms', icon: Home, description: 'Portable restroom trailers.' },
  { id: 'tent-rentals', name: 'Tent Rentals', icon: Tent, description: 'Tents and canopies for outdoor events.' },
  { id: 'party-rentals', name: 'Party Rentals (Tables, Chairs, Linens)', icon: Users, description: 'General party equipment.' },
  { id: 'florists', name: 'Florists', icon: Flower2, description: 'Floral arrangements and decor.' },
  { id: 'event-lighting', name: 'Event Lighting', icon: Lightbulb, description: 'Professional lighting solutions.' },
  { id: 'decor-rentals', name: 'Decor Rentals', icon: Gem, description: 'Specialty decor items.' },
  { id: 'audio-visual-rentals', name: 'Audio/Visual Rentals', icon: Speaker, description: 'Sound systems, projectors, screens.' },
  { id: 'stage-rentals', name: 'Stage Rentals', icon: RectangleHorizontal, description: 'Portable stages and platforms.' },
  { id: 'dance-floor-rentals', name: 'Dance Floor Rentals', icon: LayoutGrid, description: 'Portable dance floors.' },

  // Services
  { id: 'wedding-planners', name: 'Wedding Planners', icon: Handshake, description: 'Full-service wedding planning.' },
  { id: 'event-planners', name: 'Event Planners (General)', icon: ListChecks, description: 'Planning for various event types.' },
  { id: 'photographers', name: 'Photographers', icon: Camera, description: 'Professional event photography.' },
  { id: 'videographers', name: 'Videographers', icon: Clapperboard, description: 'Event videography services.' },
  { id: 'security-services', name: 'Security Services', icon: ShieldCheck, description: 'Event security personnel.' },
  { id: 'valet-parking', name: 'Valet Parking', icon: Car, description: 'Valet services for events.' },
  { id: 'transportation-services', name: 'Transportation Services', icon: Bus, description: 'Shuttles, limos, party buses.' },
  { id: 'event-staffing', name: 'Event Staffing', icon: Users, description: 'Servers, ushers, general event staff.' },
  { id: 'makeup-artists', name: 'Makeup Artists', icon: Palette, description: 'Professional makeup for events.' },
  { id: 'hairstylists', name: 'Hairstylists', icon: Scissors, description: 'Event hairstyling services.' },
  { id: 'custom-apparel', name: 'Custom Apparel', icon: Shirt, description: 'Custom t-shirts, hats for events.' },
  { id: 'invitations-stationery', name: 'Invitations & Stationery', icon: Edit3, description: 'Custom event invitations.' },
  { id: 'calligraphers', name: 'Calligraphers', icon: Edit3, description: 'Handwritten calligraphy services.' },
  { id: 'officiants', name: 'Officiants', icon: UserCheck, description: 'Wedding and ceremony officiants.' },
  { id: 'signage-banners', name: 'Signage & Banners', icon: SprayCan, description: 'Custom signs and banners.' },

  // Crafts & Unique
  { id: 'artisans-crafters', name: 'Artisans & Crafters', icon: PaletteIcon, description: 'Handmade goods and crafts vendors.' },
  { id: 'live-event-painting', name: 'Live Event Painting', icon: Palette, description: 'Artists painting your event live.' },
  { id: 'custom-gifts-favors', name: 'Custom Gifts & Favors', icon: Gift, description: 'Personalized event favors.' },

  // Venues
  { id: 'venues', name: 'Venues', icon: MapPin, description: 'Event spaces and locations.' },

  // Pet Related (Niche but growing)
  { id: 'pet-sitting-event', name: 'Event Pet Sitting', icon: PawPrint, description: 'Pet care during events.' },
  { id: 'mobile-pet-grooming', name: 'Mobile Pet Grooming (for event prep)', icon: Bone, description: 'Pre-event pet grooming.' },
];

export const getCategoryByName = (name: string): Category | undefined => {
  return categories.find(cat => cat.name.toLowerCase() === name.toLowerCase());
};

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(cat => cat.id === id);
};
