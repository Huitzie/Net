
'use client';
import type { NextPage } from 'next';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import type { Service, Review, Vendor } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Star, Phone, Mail, Globe, Users, Eye, MessageSquare, MessageCircle, Edit } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import VendorServiceCard from '@/components/vendors/vendor-service-card';
import { Separator } from '@/components/ui/separator';
import StarRating from '@/components/ui/star-rating';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';


const VendorPage: NextPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const firestore = useFirestore();

  const vendorQuery = useMemoFirebase(() => {
    if (!firestore || !slug) return null;
    return query(collection(firestore, 'vendors'), where('slug', '==', slug), limit(1));
  }, [firestore, slug]);
  
  const { data: vendors, isLoading: isVendorLoading } = useCollection<Vendor>(vendorQuery);
  const vendor = vendors?.[0];

  const servicesCollectionRef = useMemoFirebase(() => {
    if (!firestore || !vendor?.id) return null;
    return collection(firestore, 'vendors', vendor.id, 'services');
  }, [firestore, vendor?.id]);

  const { data: services, isLoading: areServicesLoading } = useCollection<Service>(servicesCollectionRef);

  // TODO: Fetch reviews as subcollection
  const reviews = vendor?.reviews || [];


  if (isVendorLoading || areServicesLoading) {
    // TODO: Make a nice loading skeleton
    return <div>Loading vendor...</div>;
  }

  if (!vendor) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return dateString; // Fallback if date is invalid
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      {/* Banner Image */}
      {vendor.bannerImage && (
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8 shadow-lg">
          <Image 
            src={vendor.bannerImage} 
            alt={`${vendor.name} banner`} 
            fill 
            className="object-cover"
            priority
            data-ai-hint="vendor event setup" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Vendor Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden shadow-lg">
            <div className="relative w-full h-56 sm:h-72">
              <Image 
                src={vendor.profileImage} 
                alt={vendor.name} 
                fill 
                className="object-cover"
                data-ai-hint="vendor portrait"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">{vendor.name}</CardTitle>
              {vendor.tagline && <CardDescription className="text-lg text-muted-foreground">{vendor.tagline}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-5 w-5 mr-3 shrink-0 text-primary" />
                <span>{vendor.city}, {vendor.state}</span>
              </div>
              {typeof vendor.rating === 'number' && (
                <div className="flex items-center">
                  <StarRating rating={vendor.rating} size={20} starClassName="mr-0.5" />
                  <span className="ml-2 font-semibold">{vendor.rating.toFixed(1)}</span>
                  <span className="ml-1 text-muted-foreground">({vendor.reviewsCount || 0} reviews)</span>
                </div>
              )}
              {vendor.categoryIds && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {vendor.categoryIds.map(catId => (
                    <Badge key={catId} variant="secondary">{catId}</Badge> // TODO: Get category name from ID
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {vendor.contactEmail && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 shrink-0 text-primary" />
                  <a href={`mailto:${vendor.contactEmail}`} className="hover:underline">{vendor.contactEmail}</a>
                </div>
              )}
              {vendor.phoneNumber && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 shrink-0 text-primary" />
                  <span>{vendor.phoneNumber}</span>
                </div>
              )}
              {vendor.website && (
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 shrink-0 text-primary" />
                  <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">{vendor.website}</a>
                </div>
              )}
              <Button className="w-full mt-4 bg-accent hover:bg-accent/90">
                <MessageSquare className="mr-2 h-4 w-4" /> Request a Quote
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: About, Services, & Reviews */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">About {vendor.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 whitespace-pre-line">{vendor.description}</p>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-2xl font-bold mb-6">Services Offered</h2>
            {services && services.length > 0 ? (
              <div className="space-y-6">
                {services.map((service: Service) => (
                  <VendorServiceCard key={service.id} service={service} vendorId={vendor.id} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">This vendor has not listed any specific services yet.</p>
                  <p className="text-sm text-muted-foreground">Contact them directly for more information.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Reviews Section */}
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-2xl">Customer Reviews</CardTitle>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" /> Write a Review
              </Button>
            </CardHeader>
            <CardContent>
              {reviews && reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review: Review) => (
                    <Card key={review.id} className="bg-muted/30 p-4 shadow-sm">
                      <CardHeader className="p-0 mb-2 flex flex-row items-start space-x-3">
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={review.avatar || `https://avatar.vercel.sh/${review.author.replace(/\s+/g, '')}.png?size=40`} alt={review.author} data-ai-hint="user avatar" />
                          <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base font-semibold">{review.author}</CardTitle>
                          <CardDescription className="text-xs">{formatDate(review.date)}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <StarRating rating={review.rating} size={16} className="mb-1.5" />
                        <p className="text-sm text-foreground/90">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No reviews yet for {vendor.name}.</p>
                  <p className="text-sm text-muted-foreground">Be the first to share your experience!</p>
                </div>
              )}
            </CardContent>
             {reviews && reviews.length > 3 && (
              <CardFooter className="justify-center pt-4">
                <Button variant="link">View All Reviews</Button>
              </CardFooter>
            )}
          </Card>

        </div>
      </div>
    </div>
  );
};

export default VendorPage;

    