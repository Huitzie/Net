
'use client';

import type { NextPage } from 'next';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, getDoc, arrayRemove, updateDoc } from 'firebase/firestore';
import type { Event, Vendor, Service } from '@/types';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, ArrowLeft, ShoppingBag, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

interface FavoriteDetail {
  vendor: Vendor;
  service: Service;
}

const EventPage: NextPage = () => {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;
  const { toast } = useToast();

  const [favoritesDetails, setFavoritesDetails] = useState<FavoriteDetail[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);

  const eventDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid || !eventId) return null;
    return doc(firestore, 'users', user.uid, 'events', eventId);
  }, [firestore, user?.uid, eventId]);

  const { data: event, isLoading: isEventLoading } = useDoc<Event>(eventDocRef);

  useEffect(() => {
    const fetchFavoriteDetails = async () => {
      if (!firestore || !event) {
        if (!isEventLoading) setIsLoadingDetails(false);
        return;
      }
      
      const favoriteIds = event.favoritedVendorServiceIds || [];
      if (favoriteIds.length === 0) {
        setFavoritesDetails([]);
        setIsLoadingDetails(false);
        return;
      }
      
      setIsLoadingDetails(true);
      const details: FavoriteDetail[] = [];
      const promises = favoriteIds.map(async (favId) => {
        const [vendorId, serviceId] = favId.split('_');
        if (vendorId && serviceId) {
          try {
            const vendorRef = doc(firestore, 'vendors', vendorId);
            const serviceRef = doc(firestore, 'vendors', vendorId, 'services', serviceId);
            
            const [vendorSnap, serviceSnap] = await Promise.all([getDoc(vendorRef), getDoc(serviceRef)]);

            if (vendorSnap.exists() && serviceSnap.exists()) {
              const vendorData = { id: vendorSnap.id, ...vendorSnap.data() } as Vendor;
              const serviceData = { id: serviceSnap.id, ...serviceSnap.data() } as Service;
              return { vendor: vendorData, service: serviceData };
            }
          } catch (error) {
            console.error(`Error fetching details for favId ${favId}:`, error);
          }
        }
        return null;
      });

      const resolvedDetails = (await Promise.all(promises)).filter((d): d is FavoriteDetail => d !== null);
      setFavoritesDetails(resolvedDetails);
      setIsLoadingDetails(false);
    };

    fetchFavoriteDetails();
  }, [event, firestore, isEventLoading]);

  const removeFromEvent = async (vendorId: string, serviceId: string) => {
    if (!eventDocRef) return;
    await updateDoc(eventDocRef, {
      favoritedVendorServiceIds: arrayRemove(`${vendorId}_${serviceId}`)
    });
    toast({
      title: "Vendor Removed",
      description: "The vendor service has been removed from this event."
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

  if (isUserLoading || isEventLoading || isLoadingDetails) {
    return (
     <div className="flex h-[70vh] w-full items-center justify-center">
       <RefreshCw className="h-10 w-10 animate-spin text-primary" />
     </div>
   );
  }

  if (!user) {
    router.replace('/login');
    return null;
  }
  
  if (!event && !isEventLoading) {
     return (
      <div className="container mx-auto py-12 px-4 md:px-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
        <p className="text-muted-foreground mb-4">The requested event collection could not be found.</p>
        <Button asChild variant="outline"><Link href="/my-favs">Back to My Events</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/my-favs">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Events
        </Link>
      </Button>
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Event: {event?.name}</h1>
      <p className="text-muted-foreground mb-8">Manage the vendors you've saved for this event.</p>
      
      {groupedFavorites.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
          <h2 className="text-2xl font-semibold mb-3">This Event Collection is Empty</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You haven't added any vendors to "{event?.name}" yet.
          </p>
          <Button asChild size="lg">
            <Link href="/search">Find & Add Vendors</Link>
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
                    <Button variant="outline" size="sm" asChild><Link href={`/vendors/${vendor.slug}`}>View Profile</Link></Button>
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                            variant="destructive" 
                            size="icon" 
                            className="shrink-0 mt-2 sm:mt-0"
                            aria-label="Remove from event"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </AlertDialogTrigger>
                       <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove from Event?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove "{service.name}" from the "{event?.name}" collection?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => removeFromEvent(vendor.id, service.id)}>
                              Yes, Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
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

export default EventPage;

