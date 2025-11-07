
import type { Vendor } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users } from 'lucide-react'; // Removed Star, will use StarRating
import { getCategoryById } from '@/data/categories';
import StarRating from '@/components/ui/star-rating'; // Added StarRating import
import { Button } from '../ui/button';

interface VendorCardProps {
  vendor: Vendor;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor }) => {
  const primaryCategoryId = vendor.categoryIds && vendor.categoryIds.length > 0 ? vendor.categoryIds[0] : null;
  const primaryCategory = primaryCategoryId ? getCategoryById(primaryCategoryId) : null;
  const IconComponent = primaryCategory?.icon || Users;

  return (
    <Link href={`/vendors/${vendor.slug}`} className="block group" legacyBehavior>
      <a className="h-full">
        <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out transform group-hover:-translate-y-1">
          <div className="relative w-full h-48">
            <Image
              src={vendor.profileImage || 'https://picsum.photos/seed/placeholder/400/300'}
              alt={vendor.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
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
          <CardFooter className="pt-2 flex flex-col items-start gap-3">
             <div className="flex flex-wrap gap-1">
                {vendor.categoryIds && vendor.categoryIds.slice(0, 2).map((catId) => {
                    const category = getCategoryById(catId);
                    return category ? <Badge key={catId} variant="secondary" className="text-xs">{category.name}</Badge> : null;
                })}
                {vendor.categoryIds && vendor.categoryIds.length > 2 && (
                <Badge variant="secondary" className="text-xs">+{vendor.categoryIds.length - 2} more</Badge>
                )}
             </div>
             <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/vendors/${vendor.slug}`}>
                    More Services from this Vendor
                </Link>
             </Button>
          </CardFooter>
        </Card>
      </a>
    </Link>
  );
};

export default VendorCard;
