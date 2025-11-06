
"use client";
import type { Service, ClientProfile } from '@/types';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, DollarSign, Tag } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useUser, useFirestore, useDoc, updateDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { doc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface VendorServiceCardProps {
  service: Service;
  vendorId: string;
}

const VendorServiceCard: React.FC<VendorServiceCardProps> = ({ service, vendorId }) => {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const clientProfileRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid, 'client');
  }, [firestore, user?.uid]);

  const { data: clientProfile } = useDoc<ClientProfile>(clientProfileRef);

  const favoriteId = `${vendorId}_${service.id}`;
  const isFavorite = clientProfile?.favoriteVendorIds?.includes(favoriteId);

  const handleFavoriteToggle = () => {
    if (!user || !clientProfileRef) {
      toast({
        title: "Please log in as a client",
        description: "You need to be logged in as a client to save favorites.",
        variant: "destructive",
      });
      return;
    }

    const updateData = {
      favoriteVendorIds: isFavorite ? arrayRemove(favoriteId) : arrayUnion(favoriteId)
    };

    updateDocumentNonBlocking(clientProfileRef, updateData);

    toast({
      title: isFavorite ? "Removed from Favs" : "Added to Favs!",
      description: `${service.name} has been ${isFavorite ? 'removed from' : 'added to'} your favorites.`,
    });
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
              {user && ( // Only show heart button if user is logged in
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFavoriteToggle}
                  className={`rounded-full hover:bg-rose-100 dark:hover:bg-rose-800 ${isFavorite ? 'text-rose-500' : 'text-muted-foreground'}`}
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  disabled={isUserLoading}
                >
                  <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
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
