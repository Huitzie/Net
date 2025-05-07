
import type { NextPage, Metadata } from 'next';
import { Suspense } from 'react';
import SearchForm from '@/components/search/search-form';
import VendorCard from '@/components/vendors/vendor-card';
import { searchVendors as performSearchVendors } from '@/data/vendors'; 
import { getCategoryById } from '@/data/categories';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Share2, Sparkles, Info } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export const metadata: Metadata = {
  title: 'Search Vendors | Venue Vendors',
  description: 'Find the perfect vendors for your event.',
};

interface SearchPageProps {
  searchParams: {
    state?: string;
    city?: string;
    category?: string;
    keyword?: string;
  };
}

const SearchResults = async ({ searchParams }: SearchPageProps) => {
  const { state, city, category: categoryId, keyword } = searchParams;

  if (!state || !city) {
    return (
      <div className="text-center py-10">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Incomplete Search</h2>
        <p className="text-muted-foreground">Please select a state and city to find vendors.</p>
      </div>
    );
  }
  
  // Perform search without initial limit to check total count
  const allMatchingVendors = await performSearchVendors({ state, city, categoryId, keyword });
  const vendors = allMatchingVendors.slice(0, 10); // Then take the first 10 for display
  const totalFound = allMatchingVendors.length;

  const category = categoryId ? getCategoryById(categoryId) : null;

  if (vendors.length === 0) {
    const categoryName = category ? category.name : "this type of";
    const shareText = `Looking for a ${categoryName} vendor in ${city}, ${state}? Venue Vendors needs you! If you provide this service, sign up to get hired: ${process.env.NEXT_PUBLIC_APP_URL || 'https://venuevendors.example.com'}/signup?type=vendor`;
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL || 'https://venuevendors.example.com')}&quote=${encodeURIComponent(shareText)}`;

    return (
      <div className="text-center py-10">
        <Sparkles className="mx-auto h-16 w-16 text-primary mb-6" />
        <h2 className="text-3xl font-semibold mb-3">No Vendors Found</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Sorry, we couldn't find any {category ? `${category.name} ` : ''}vendors in {city}, {state} matching your criteria.
        </p>
        <Card className="max-w-md mx-auto bg-secondary/30 p-6">
          <CardContent className="flex flex-col items-center gap-4">
            <p className="font-semibold">Know a vendor or are one yourself?</p>
            <Button asChild className="w-full">
              <Link href="/signup?type=vendor">Sign Up Your Service!</Link>
            </Button>
            <p className="text-sm text-muted-foreground">Or share this to help us find them:</p>
            <div className="flex space-x-3">
              <Button variant="outline" asChild>
                <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer">
                  <Share2 className="mr-2 h-4 w-4" /> Share on X
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer">
                  <Share2 className="mr-2 h-4 w-4" /> Share on Facebook
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
         <p className="mt-8 text-muted-foreground">
            Can't find the right category?{' '}
            <Link href="/suggest-category" className="text-primary hover:underline">
              Suggest a new one!
            </Link>
          </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">
        Showing {vendors.length > 1 ? `${vendors.length} ` : ''}{category ? `${category.name} ` : ''}Vendors in {city}, {state}
        {keyword && ` matching "${keyword}"`}
      </h2>
      {totalFound > 10 && (
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>More Results Available</AlertTitle>
          <AlertDescription>
            We found {totalFound} vendors matching your criteria. Displaying the top 10. Future updates may include pagination to view all results.
          </AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </div>
    </div>
  );
};


const SearchPage: NextPage<SearchPageProps> = ({ searchParams }) => {
  const { state, city, category: categoryId, keyword } = searchParams;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center md:text-left">Find Your Perfect Vendor</h1>
        <p className="text-muted-foreground mb-6 text-center md:text-left">
          Use the filters below to discover amazing vendors for your event.
        </p>
        <SearchForm initialValues={{ state, city, category: categoryId, keyword }} />
      </div>
      <Suspense fallback={<LoadingResults />}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

const LoadingResults = () => (
  <div className="space-y-4">
    <div className="h-8 bg-muted rounded w-1/2 animate-pulse"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <Card key={i} className="animate-pulse">
          <div className="h-48 bg-muted rounded-t-lg"></div>
          <CardContent className="p-4 space-y-3">
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);


export default SearchPage;
