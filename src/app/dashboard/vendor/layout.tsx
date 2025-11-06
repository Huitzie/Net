
'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import type { Vendor } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { RefreshCw, TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';


export default function VendorDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const vendorDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'vendors', user.uid);
  }, [firestore, user?.uid]);

  const { data: vendorProfile, isLoading: isProfileLoading } = useDoc<Vendor>(vendorDocRef);

  const isLoading = isUserLoading || isProfileLoading;

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <RefreshCw className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  // If user is loaded but not logged in, or is not a vendor
  if (!user) {
    router.replace('/login?type=vendor');
    return null;
  }
  
  if (user && !vendorProfile && router) {
    // If user is a vendor but has no profile, prompt to create one
     return (
      <div className="container mx-auto flex min-h-[80vh] flex-col items-center justify-center text-center">
        <TriangleAlert className="h-12 w-12 text-primary" />
        <h1 className="mt-4 text-2xl font-bold">Welcome, Vendor!</h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          To get started and list your services, you need to create your public vendor profile.
        </p>
        <Button asChild className="mt-6">
          <Link href="/dashboard/vendor/profile">Create Your Profile</Link>
        </Button>
      </div>
    );
  }

  // If user is logged in and has a vendor profile, show the dashboard
  return <>{children}</>;
}
