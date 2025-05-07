
"use client";
import type { NextPage } from 'next';
import { useAtom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { useAuthMock } from '@/hooks/use-auth-mock';
import VendorCard from '@/components/vendors/vendor-card';
import { vendors as allVendors, getVendorById } from '@/data/vendors';
import type { Vendor, Service } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartOff, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface FavoriteService {
  vendorId: string;
  serviceId: string;
}
const favoritesStorage = createJSONStorage<FavoriteService[]>(() => localStorage);
const favoriteServicesAtom = atomWithStorage<FavoriteService[]>('favoriteServices', [], favoritesStorage);


const MyFavsPage: NextPage = () => {
  const { isAuthenticated, user } = useAuthMock();
  const [favoriteServices, setFavoriteServices] = useAtom(favoriteServicesAtom);

  if (!isAuthenticated || user?.accountType !== 'client') {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 text-center">
        <HeartOff className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg text-muted-foreground mb-6">Please log in as a client to view your favorite vendors and services.</p>
        <Button asChild>
          <Link href="/login">Log In</Link>
        </Button>
      </div>
    );
  }

  const groupedFavorites: { vendor: Vendor; services: Service[] }[] = [];

  favoriteServices.forEach(fav => {
    const vendor = getVendorById(fav.vendorId);
    if (vendor) {
      const service = vendor.services.find(s => s.id === fav.serviceId);
      if (service) {
        const existingEntry = groupedFavorites.find(gf => gf.vendor.id === vendor.id);
        if (existingEntry) {
          existingEntry.services.push(service);
        } else {
          groupedFavorites.push({ vendor, services: [service] });
        }
      }
    }
  });

  const removeFavorite = (vendorId: string, serviceId: string) => {
    setFavoriteServices(prev => prev.filter(fav => !(fav.vendorId === vendorId && fav.serviceId === serviceId)));
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-0">My Favorite Vendors & Services</h1>
        <Button variant="outline" asChild>
          <Link href="/search">Discover More Vendors</Link>
        </Button>
      </div>

      {groupedFavorites.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="mx-auto h-20 w-20 text-muted-foreground mb-8" />
          <h2 className="text-2xl font-semibold mb-3">Your Favorites List is Empty</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start exploring and tap the heart icon on services you like to save them here for later.
          </p>
          <Button asChild size="lg">
            <Link href="/search">Find Vendors Now</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedFavorites.map(({ vendor, services }) => (
            <Card key={vendor.id} className="overflow-hidden shadow-lg">
              <CardHeader className="bg-muted/50 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <Link href={`/vendors/${vendor.slug}`} legacyBehavior>
                        <a className="hover:underline">
                            <CardTitle className="text-2xl font-semibold text-primary mb-1 sm:mb-0">{vendor.name}</CardTitle>
                        </a>
                    </Link>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/vendors/${vendor.slug}`}>View Profile</Link>
                    </Button>
                </div>
                <CardDescription>{vendor.city}, {vendor.state}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                {services.map(service => (
                  <div key={service.id} className="p-4 md:p-6 flex flex-col sm:flex-row items-start gap-4">
                    {service.photos && service.photos.length > 0 && (
                      <div className="relative w-full sm:w-32 h-32 sm:h-24 rounded-md overflow-hidden shrink-0">
                        <Image 
                          src={service.photos[0]} 
                          alt={service.name} 
                          layout="fill" 
                          objectFit="cover" 
                          data-ai-hint="service item photo"
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      <h4 className="font-semibold text-lg">{service.name}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                      {service.priceRange && <p className="text-sm font-medium text-primary mt-1">{service.priceRange}</p>}
                    </div>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-destructive shrink-0 mt-2 sm:mt-0"
                        onClick={() => removeFavorite(vendor.id, service.id)}
                        aria-label="Remove from favorites"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFavsPage;
