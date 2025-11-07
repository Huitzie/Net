
'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';
import type { Vendor } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { RefreshCw, TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';


export default function VendorDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const pathname = usePathname();

  const vendorDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'vendors', user.uid);
  }, [firestore, user?.uid]);

  const { data: vendorProfile, isLoading: isProfileLoading } = useDoc<Vendor>(vendorDocRef);

  const isLoading = isUserLoading || isProfileLoading;

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login.
    if (!isLoading && !user) {
      router.replace('/login?type=vendor');
    }
  }, [isLoading, user, router]);


  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <RefreshCw className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  // If still loading or no user, render nothing while useEffect handles redirect.
  if (!user) {
    return null;
  }
  
  // If user is a vendor but has no profile, prompt to create one,
  // UNLESS they are already on the profile creation page.
  if (!vendorProfile && pathname !== '/dashboard/vendor/profile') {
     return (
      <div className="container mx-auto flex min-h-[80vh] flex-col items-center justify-center text-center">
        <TriangleAlert className="h-12 w-12 text-primary" />
        <h1 className="mt-4 text-2xl font-bold">Welcome, Vendor!</h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          To get started and list your services, you need to create your public vendor profile.
        </p>
        <Link href="/dashboard/vendor/profile">
          <Button className="mt-6">
            Create Your Profile
          </Button>
        </Link>
      </div>
    );
  }

  // If user is logged in and has a vendor profile (or is on the profile creation page), show the content
  return <>{children}</>;
}
