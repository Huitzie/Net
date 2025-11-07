
"use client";
import type { Service, ClientProfile, Event } from '@/types';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, DollarSign, Tag, Plus, PlusCircle } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useUser, useFirestore, useDoc, updateDocumentNonBlocking, useMemoFirebase, useCollection, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { doc, arrayRemove, arrayUnion, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VendorServiceCardProps {
  service: Service;
  vendorId: string;
}

const VendorServiceCard: React.FC<VendorServiceCardProps> = ({ service, vendorId }) => {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = React.useState(false);
  const [newEventName, setNewEventName] = React.useState("");

  const clientProfileRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid, 'client', 'profile');
  }, [firestore, user?.uid]);

  const eventsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return collection(firestore, 'users', user.uid, 'events');
  }, [firestore, user?.uid]);

  const { data: clientProfile, isLoading: isProfileLoading } = useDoc<ClientProfile>(clientProfileRef);
  const { data: events, isLoading: areEventsLoading } = useCollection<Event>(eventsCollectionRef);

  const favoriteId = `${vendorId}_${service.id}`;
  const isFavorite = clientProfile?.favoriteVendorIds?.includes(favoriteId);
  const isLoading = isUserLoading || isProfileLoading || areEventsLoading;

  const handleFavoriteToggle = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to save favorites.",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }
     if (user && !clientProfile) {
       toast({
        title: "Client Profile Not Found",
        description: "We couldn't find your client profile. Please try again.",
        variant: "destructive",
      });
       return;
    }
    if (!clientProfileRef) return;

    const updateData = {
      favoriteVendorIds: isFavorite ? arrayRemove(favoriteId) : arrayUnion(favoriteId)
    };

    updateDocumentNonBlocking(clientProfileRef, updateData);

    toast({
      title: isFavorite ? "Removed from Favs" : "Added to Favs!",
      description: `${service.name} has been ${isFavorite ? 'removed from' : 'added to'} your favorites.`,
    });
  };

  const handleAddToEvent = (eventId: string) => {
    if (!user || !firestore) return;
    const eventDocRef = doc(firestore, 'users', user.uid, 'events', eventId);
    updateDocumentNonBlocking(eventDocRef, {
      favoritedVendorServiceIds: arrayUnion(favoriteId)
    });
    toast({
      title: 'Added to Event',
      description: `${service.name} has been added to your event.`
    });
  };

  const handleCreateAndAddEvent = () => {
      if (!newEventName.trim() || !user || !eventsCollectionRef) return;

      const newEventRef = doc(eventsCollectionRef);
      const newEventData: Event = {
          id: newEventRef.id,
          name: newEventName,
          clientId: user.uid,
          date: serverTimestamp(),
          favoritedVendorServiceIds: [favoriteId] // Add current service directly
      };

      setDocumentNonBlocking(newEventRef, newEventData, {});
      toast({ title: "Event Created & Vendor Added", description: `"${newEventName}" created and ${service.name} was added.` });
      setNewEventName('');
      setIsNewEventDialogOpen(false);
  };
  
  return (
    <Card className="overflow-hidden shadow-md transition-all hover:shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6">
        {service.photos && service.photos.length > 0 && (
          <div className="md:col-span-1 relative h-64 md:h-auto">
            {service.photos.length > 1 ? (
              <Carousel className="w-full h-full">
                <CarouselContent>
                  {service.photos.map((photo, index) => (
                    <CarouselItem key={index}>
                      <div className="relative w-full h-64 md:h-full aspect-[4/3] md:aspect-auto">
                        <Image
                          src={photo}
                          alt={`${service.name} photo ${index + 1}`}
                          fill
                          className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                          data-ai-hint="service item photo"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {service.photos.length > 1 && (
                  <>
                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
                  </>
                )}
              </Carousel>
            ) : (
               <div className="relative w-full h-64 md:h-full aspect-[4/3] md:aspect-auto">
                 <Image
                    src={service.photos[0]}
                    alt={service.name}
                    fill
                    className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                    data-ai-hint="service item photo"
                  />
               </div>
            )}
          </div>
        )}
        <div className={`p-6 ${service.photos && service.photos.length > 0 ? 'md:col-span-2' : 'md:col-span-3'}`}>
          <CardHeader className="p-0 mb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl font-semibold">{service.name}</CardTitle>
              {user && ( // Only show action buttons if user is logged in
                <div className="flex items-center">
                    <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleFavoriteToggle}
                    className={`rounded-full hover:bg-rose-100 dark:hover:bg-rose-800 ${isFavorite ? 'text-rose-500' : 'text-muted-foreground'}`}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    disabled={isLoading}
                    >
                    <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                    
                    <Dialog open={isNewEventDialogOpen} onOpenChange={setIsNewEventDialogOpen}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 ml-1">
                                    <Plus className="h-6 w-6" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuLabel>Add to Event</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    {events && events.map(event => (
                                        <DropdownMenuItem key={event.id} onClick={() => handleAddToEvent(event.id)} disabled={event.favoritedVendorServiceIds?.includes(favoriteId)}>
                                            {event.name}
                                            {event.favoritedVendorServiceIds?.includes(favoriteId) && <span className="text-xs text-muted-foreground ml-auto">Added</span>}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                 <DialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Create New Event
                                    </DropdownMenuItem>
                                </DialogTrigger>
                            </DropdownMenuContent>
                        </DropdownMenu>
                         <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                            <DialogTitle>Create New Event & Add Vendor</DialogTitle>
                            <DialogDescription>
                                Create a new event collection and add "{service.name}" to it.
                            </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="event-name" className="text-right">
                                Name
                                </Label>
                                <Input
                                id="event-name"
                                value={newEventName}
                                onChange={(e) => setNewEventName(e.target.value)}
                                className="col-span-3"
                                placeholder="e.g., Summer Wedding"
                                />
                            </div>
                            </div>
                            <DialogFooter>
                            <Button type="button" onClick={handleCreateAndAddEvent} disabled={!newEventName.trim()}>Create & Add</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                </div>
              )}
            </div>
            <Badge variant="outline" className="mt-1 inline-flex items-center">
              <Tag className="h-3 w-3 mr-1.5" /> {service.category}
            </Badge>
          </CardHeader>
          <CardContent className="p-0 mb-4">
            <p className="text-foreground/80 text-sm">{service.description}</p>
          </CardContent>
          <CardFooter className="p-0 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            {service.priceRange && (
              <div className="flex items-center text-lg font-semibold text-primary mb-2 sm:mb-0">
                <DollarSign className="h-5 w-5 mr-1" />
                <span>{service.priceRange}</span>
              </div>
            )}
            <Button variant="outline" size="sm">View Details / Enquire</Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default VendorServiceCard;

    