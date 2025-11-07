
"use client";
import type { NextPage } from 'next';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase, updateDocumentNonBlocking, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { doc, getDoc, arrayRemove, collection, serverTimestamp, arrayUnion } from 'firebase/firestore';
import type { Vendor, Service, ClientProfile, Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { HeartOff, ShoppingBag, Trash2, PlusCircle, CalendarPlus, X, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

interface FavoriteDetail {
  vendor: Vendor;
  service: Service;
}

const MyFavsPage: NextPage = () => {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [favoritesDetails, setFavoritesDetails] = useState<FavoriteDetail[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [newEventName, setNewEventName] = useState('');
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  const clientProfileRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid, 'client', 'profile');
  }, [firestore, user?.uid]);

  const { data: clientProfile, isLoading: isProfileLoading } = useDoc<ClientProfile>(clientProfileRef);
  
  const eventsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return collection(firestore, 'users', user.uid, 'events');
  }, [firestore, user?.uid]);

  const { data: events, isLoading: areEventsLoading } = useCollection<Event>(eventsCollectionRef);

  useEffect(() => {
    const fetchFavoriteDetails = async () => {
      if (!firestore) return;
      if (!clientProfile || isProfileLoading) {
        setIsLoadingDetails(false);
        if(!isProfileLoading) setFavoritesDetails([]);
        return;
      }
      
      const favoriteIds = clientProfile.favoriteVendorIds || [];
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
  }, [clientProfile, firestore, isProfileLoading]);

  const removeFavorite = (vendorId: string, serviceId: string) => {
    if (!clientProfileRef) return;
    updateDocumentNonBlocking(clientProfileRef, {
      favoriteVendorIds: arrayRemove(`${vendorId}_${serviceId}`)
    });
  };

  const handleCreateEvent = () => {
    if (!newEventName.trim() || !user || !eventsCollectionRef) return;

    const newEventRef = doc(eventsCollectionRef);
    const eventData: Event = {
      id: newEventRef.id,
      name: newEventName,
      clientId: user.uid,
      date: serverTimestamp(),
      favoritedVendorServiceIds: []
    }
    
    setDocumentNonBlocking(newEventRef, eventData, {});
    toast({ title: "Event Created", description: `"${newEventName}" has been created.` });
    setNewEventName('');
    setIsEventDialogOpen(false);
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


  if (isUserLoading || isProfileLoading || isLoadingDetails || areEventsLoading) {
     return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <RefreshCw className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 text-center">
        <HeartOff className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg text-muted-foreground mb-6">Please log in as a client to view your favorites and events.</p>
        <Button asChild><Link href="/login">Log In</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-0">My Events & Favorites</h1>
        <Button variant="outline" asChild><Link href="/search">Discover More Vendors</Link></Button>
      </div>

      {/* Event Creation and Management */}
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl flex items-center"><CalendarPlus className="mr-3 text-primary"/>My Event Collections</CardTitle>
             <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2" />Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create a New Event</DialogTitle>
                  <DialogDescription>
                    Give your new event collection a name. You can add vendors to it later.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newEventName}
                      onChange={(e) => setNewEventName(e.target.value)}
                      className="col-span-3"
                      placeholder="e.g., My Wedding, Summer Party"
                      onKeyDown={(e) => e.key === 'Enter' && handleCreateEvent()}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" onClick={handleCreateEvent} disabled={!newEventName.trim()}>Save Event</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription>Organize your favorite vendors by creating collections for your events.</CardDescription>
        </CardHeader>
        <CardContent>
            {events && events.length > 0 ? (
                <div className="space-y-2">
                    {events.map(event => (
                        <Card key={event.id} className="p-3 bg-muted/50 flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{event.name}</p>
                                <p className="text-sm text-muted-foreground">{event.favoritedVendorServiceIds?.length || 0} vendors saved</p>
                            </div>
                             <Button variant="outline" size="sm" asChild>
                                <Link href={`/my-favs/${event.id}`}>Manage</Link>
                             </Button>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground text-center py-6">You haven't created any events yet.</p>
            )}
        </CardContent>
      </Card>


      <h2 className="text-2xl font-bold mb-6">All My Favorite Services</h2>
      {groupedFavorites.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
          <h2 className="text-2xl font-semibold mb-3">Your Favorites List is Empty</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start exploring and tap the heart icon on services you like to save them here for later.
          </p>
          <Button asChild size="lg"><Link href="/search">Find Vendors Now</Link></Button>
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
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-destructive shrink-0 mt-2 sm:mt-0"
                            aria-label="Remove from favorites"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </AlertDialogTrigger>
                       <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove from Favorites?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove "{service.name}" from your favorites? This will not remove it from any event collections.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => removeFavorite(vendor.id, service.id)}>
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

export default MyFavsPage;
