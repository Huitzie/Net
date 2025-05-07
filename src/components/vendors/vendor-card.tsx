
import type { Vendor } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users } from 'lucide-react'; // Removed Star, will use StarRating
import { getCategoryByName } from '@/data/categories';
import StarRating from '@/components/ui/star-rating'; // Added StarRating import

interface VendorCardProps {
  vendor: Vendor;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor }) => {
  const primaryCategory = vendor.categories.length > 0 ? getCategoryByName(vendor.categories[0]) : null;
  const IconComponent = primaryCategory?.icon || Users;

  return (
    <Link href={`/vendors/${vendor.slug}`} className="block group" legacyBehavior>
      <a className="h-full">
        <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out transform group-hover:-translate-y-1">
          <div className="relative w-full h-48">
            <Image
              src={vendor.profileImage || 'https://picsum.photos/seed/placeholder/400/300'}
              alt={vendor.name}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="vendor service"
            />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold truncate group-hover:text-primary">{vendor.name}</CardTitle>
            {vendor.tagline && <CardDescription className="text-sm truncate">{vendor.tagline}</CardDescription>}
          </CardHeader>
          <CardContent className="flex-grow space-y-2 text-sm">
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2 shrink-0" />
              <span>{vendor.city}, {vendor.state}</span>
            </div>
            {primaryCategory && (
              <div className="flex items-center text-muted-foreground">
                <IconComponent className="h-4 w-4 mr-2 shrink-0 text-primary" />
                <span>{primaryCategory.name}</span>
              </div>
            )}
            {typeof vendor.rating === 'number' && ( // Check if rating is a number
              <div className="flex items-center">
                <StarRating rating={vendor.rating} size={16} starClassName="mr-0.5" />
                <span className="ml-1.5 text-xs text-muted-foreground">
                  ({vendor.reviewsCount || 0} {vendor.reviewsCount === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-2 flex flex-wrap gap-1">
            {vendor.categories.slice(0, 2).map((catName) => (
              <Badge key={catName} variant="secondary" className="text-xs">{catName}</Badge>
            ))}
            {vendor.categories.length > 2 && (
              <Badge variant="secondary" className="text-xs">+{vendor.categories.length - 2} more</Badge>
            )}
          </CardFooter>
        </Card>
      </a>
    </Link>
  );
};

export default VendorCard;
