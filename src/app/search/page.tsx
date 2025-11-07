
'use client';

import type { NextPage } from 'next';
import { Suspense, useState, useEffect, useMemo } from 'react';
import SearchForm from '@/components/search/search-form';
import VendorCard from '@/components/vendors/vendor-card';
import { getCategoryById } from '@/data/categories';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Share2, Sparkles, Info, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSearchParams } from 'next/navigation';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, limit, startAfter, DocumentData, Query } from 'firebase/firestore';
import type { Vendor } from '@/types';


const VENDOR_PAGE_SIZE = 20;

const SearchResults = () => {
  const firestore = useFirestore();
  const searchParams = useSearchParams();

  const state = searchParams.get('state');
  const city = searchParams.get('city');
  const categoryId = searchParams.get('category');
  const keyword = searchParams.get('keyword');

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const initialQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    let q: Query<DocumentData> = collection(firestore, 'vendors');
    if (state) q = query(q, where('state', '==', state));
    if (city) q = query(q, where('city', '==', city));
    if (categoryId) q = query(q, where('categoryIds', 'array-contains', categoryId));
    // Firestore doesn't support complex text search on multiple fields out of the box.
    // Keyword search requires a dedicated search service like Algolia or Elasticsearch.
    // We will filter by keyword on the client side for this basic implementation.
    return query(q, limit(VENDOR_PAGE_SIZE));
  }, [firestore, state, city, categoryId]);

  useEffect(() => {
    if (!initialQuery) {
        setIsLoading(false);
        setHasMore(false);
        setVendors([]);
        return;
    };

    setIsLoading(true);
    setLastVisible(null);
    setHasMore(true);

    const loadInitialVendors = async () => {
      try {
        const documentSnapshots = await getDocs(initialQuery);
        const fetchedVendors: Vendor[] = [];
        documentSnapshots.forEach((doc) => {
          fetchedVendors.push({ id: doc.id, ...doc.data() } as Vendor);
        });

        const lastDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];
        setLastVisible(lastDoc);
        setVendors(fetchedVendors);
        setHasMore(fetchedVendors.length === VENDOR_PAGE_SIZE);

      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialVendors();
  }, [initialQuery]);

  const loadMoreVendors = async () => {
    if (!initialQuery || !lastVisible || !hasMore) return;
    setIsLoading(true);
    
    let q = query(initialQuery, startAfter(lastVisible), limit(VENDOR_PAGE_SIZE));

    try {
      const documentSnapshots = await getDocs(q);
      const newVendors: Vendor[] = [];
      documentSnapshots.forEach((doc) => {
        newVendors.push({ id: doc.id, ...doc.data() } as Vendor);
      });
      
      const lastDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setLastVisible(lastDoc);
      setVendors(prev => [...prev, ...newVendors]);
      setHasMore(newVendors.length === VENDOR_PAGE_SIZE);
    } catch (error) {
        console.error("Error fetching more vendors:", error);
    } finally {
        setIsLoading(false);
    }
  }

  const displayedVendors = useMemo(() => {
    if (!keyword) return vendors;
    
    const keywordLower = keyword.toLowerCase();
    return vendors.filter(v => 
      v.name.toLowerCase().includes(keywordLower) ||
      v.description.toLowerCase().includes(keywordLower) ||
      (v.tagline && v.tagline.toLowerCase().includes(keywordLower)) ||
      (v.categoryIds && v.categoryIds.some(catId => getCategoryById(catId)?.name.toLowerCase().includes(keywordLower)))
    );
  }, [vendors, keyword]);


  if (!state || !city) {
    return (
      <div className="text-center py-10">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Incomplete Search</h2>
        <p className="text-muted-foreground">Please select a state and city to find vendors.</p>
      </div>
    );
  }

  const category = categoryId ? getCategoryById(categoryId) : null;
  const totalFound = displayedVendors.length;
  
  if (totalFound === 0 && !isLoading) {
    const categoryName = category ? category.name : "this type of";
    const shareText = `Looking for a ${categoryName} vendor in ${city}, ${state}? Venue Vendors needs you! If you provide this service, sign up to get hired: ${process.env.NEXT_PUBLIC_APP_URL || 'https://venuevendors.example.com'}/signup?type=vendor`;
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL || 'https://venuevendors.example.com')}&quote=${encodeURIComponent(shareText)}`;

    return (
      <div className="text-center py-10 mt-8 border-t">
          <Sparkles className="mx-auto h-16 w-16 text-primary mb-6" />
          <h2 className="text-3xl font-semibold mb-3">No Vendors Found... Yet!</h2>
          <p className="text-lg text-muted-foreground mb-6">
          Help us grow! Be the first {category ? `${category.name} ` : ''}vendor in {city}, {state}.
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

  if (isLoading && totalFound === 0) {
      return <LoadingResults />;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">
        Showing {totalFound} vendors in {city}, {state}
        {keyword && ` matching "${keyword}"`}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedVendors.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </div>
      {isLoading && totalFound > 0 && <LoadingSpinner />}
      {!isLoading && hasMore && (
        <div className="mt-8 text-center">
            <Button onClick={loadMoreVendors} disabled={isLoading}>
                {'Load More Vendors'}
            </Button>
        </div>
      )}
    </div>
  );
};


const SearchPage: NextPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center md:text-left">Find Your Perfect Vendor</h1>
        <p className="text-muted-foreground mb-6 text-center md:text-left">
          Use the filters below to discover amazing vendors for your event.
        </p>
        <Suspense fallback={<LoadingSearchForm />}>
          <SearchFormWrapper />
        </Suspense>
      </div>
      <Suspense fallback={<LoadingResults />}>
        <SearchResults />
      </Suspense>
    </div>
  );
};

const SearchFormWrapper = () => {
  const searchParams = useSearchParams();
  const state = searchParams.get('state') ?? undefined;
  const city = searchParams.get('city') ?? undefined;
  const category = searchParams.get('category') ?? undefined;
  const keyword = searchParams.get('keyword') ?? undefined;

  return <SearchForm initialValues={{ state, city, category, keyword }} />;
};

const LoadingSearchForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end p-4 bg-card shadow-lg rounded-lg border">
        <div className="h-10 bg-muted rounded animate-pulse"></div>
        <div className="h-10 bg-muted rounded animate-pulse"></div>
        <div className="h-10 bg-muted rounded animate-pulse"></div>
        <div className="h-10 bg-muted rounded animate-pulse"></div>
    </div>
);


const LoadingResults = () => (
  <div className="space-y-4">
    <div className="h-8 bg-muted rounded w-1/2 animate-pulse"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map(i => (
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

const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
    </div>
)


export default SearchPage;

    