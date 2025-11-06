
"use client";
import type { NextPage } from 'next';
import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc, getDoc, arrayRemove } from 'firebase/firestore';
import type { Vendor, Service, ClientProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartOff, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';


interface FavoriteDetail {
  vendor: Vendor;
  service: Service;
}

const MyFavsPage: NextPage = () => {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [favoritesDetails, setFavoritesDetails] = useState<FavoriteDetail[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);

  const clientProfileRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid, 'client', 'profile');
  }, [firestore, user?.uid]);

  const { data: clientProfile, isLoading: isProfileLoading } = useDoc<ClientProfile>(clientProfileRef);

  useEffect(() => {
    const fetchFavoriteDetails = async () => {
      if (!clientProfile?.favoriteVendorIds || !firestore) {
        setIsLoadingDetails(false);
        return;
      }
      setIsLoadingDetails(true);
      const details: FavoriteDetail[] = [];
      for (const favId of clientProfile.favoriteVendorIds) {
        const [vendorId, serviceId] = favId.split('_');
        if (vendorId && serviceId) {
          const vendorRef = doc(firestore, 'vendors', vendorId);
          const serviceRef = doc(firestore, 'vendors', vendorId, 'services', serviceId);
          
          const [vendorSnap, serviceSnap] = await Promise.all([
            getDoc(vendorRef),
            getDoc(serviceRef)
          ]);

          if (vendorSnap.exists() && serviceSnap.exists()) {
            const vendorData = { id: vendorSnap.id, ...vendorSnap.data() } as Vendor;
            const serviceData = { id: serviceSnap.id, ...serviceSnap.data() } as Service;
            
            const existingVendor = details.find(d => d.vendor.id === vendorId);
            if (existingVendor) {
              // This logic might need adjustment if you want to group services under one vendor card
            }
            details.push({ vendor: vendorData, service: serviceData });
          }
        }
      }
      setFavoritesDetails(details);
      setIsLoadingDetails(false);
    };

    fetchFavoriteDetails();
  }, [clientProfile, firestore]);

  const removeFavorite = (vendorId: string, serviceId: string) => {
    if (!clientProfileRef) return;
    updateDocumentNonBlocking(clientProfileRef, {
      favoriteVendorIds: arrayRemove(`${vendorId}_${serviceId}`)
    });
  };

  const groupedFavorites = favoritesDetails.reduce((acc, current) => {
      const existing = acc.find(item => item.vendor.id === current.vendor.id);
      if (existing) {
          existing.services.push(current.service);
      } else {
          acc.push({ vendor: current.vendor, services: [current.service] });
      }
      return acc;
  }, [] as { vendor: Vendor; services: Service[] }[]);


  if (isUserLoading || isProfileLoading || isLoadingDetails) {
     return (
      <div className="flex h-screen w-full items-center justify-center">
        <RefreshCw className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
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
                          fill
                          className="object-cover"
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
