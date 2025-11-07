
"use client";
import type { NextPage } from 'next';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Trash2, ShieldExclamation } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/firebase';
import { deleteUser } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
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
import { useRouter } from 'next/navigation';
import type { User as UserType } from '@/types';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';

const TermsPage: NextPage = () => {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserType>(userProfileRef);

  const isLoading = isUserLoading || isProfileLoading;

  const handleDeleteAccount = async () => {
    if (!user || !userProfileRef || !firestore) return;
    try {
      // If user is a vendor, delete their public profile first
      if (userProfile?.accountType === 'vendor') {
        const vendorDocRef = doc(firestore, 'vendors', user.uid);
        await deleteDocumentNonBlocking(vendorDocRef);
      }
      // Delete their private user document
      await deleteDocumentNonBlocking(userProfileRef);
      // Finally, delete the auth user
      await deleteUser(user);
      toast({ title: "Account Deleted", description: "Your account has been permanently deleted." });
      router.push('/');
    } catch (error: any) {
      toast({ title: "Deletion Failed", description: "This is a sensitive operation that may require a recent login. Please log in again and retry, or contact support if the issue persists.", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Terms and Conditions</CardTitle>
          <CardDescription>Last Updated: July 30, 2024</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-zinc dark:prose-invert max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Venue Vendors. By accessing our website and using our services, you agree to be bound by the following terms and conditions. Please read them carefully.
          </p>
          <h2>2. Our Service</h2>
          <p>
            Venue Vendors is a discovery platform designed to connect clients with event service providers ("vendors"). We are not a party to any agreement, contract, or transaction between clients and vendors. We do not manage or guarantee the services provided by vendors, nor do we handle payments between parties.
          </p>
          <h2>3. User Responsibilities</h2>
          <p>
            As a user of this platform, you are responsible for conducting your own due diligence. This includes, but is not limited to, verifying vendor credentials, negotiating terms, and managing payments. All agreements are solely between the client and the vendor.
          </p>

          <h2 className="mt-8 border-t pt-6">Account Deletion</h2>
          <p>
            You may choose to delete your account at any time. Please be aware of the following consequences before proceeding.
          </p>
          <Card className="bg-destructive/10 border-destructive/50 my-4">
              <CardHeader className="flex flex-row items-start space-x-4 pb-4">
                  <ShieldExclamation className="h-6 w-6 text-destructive mt-1"/>
                  <div>
                    <CardTitle className="text-destructive">Permanent Account Deletion</CardTitle>
                    <CardDescription className="text-destructive/90">
                       This action is irreversible. All of your profile data, services, and associated content will be permanently removed from public view. 
                    </CardDescription>
                  </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-destructive/80 mb-4">
                  For legal and accounting purposes, we may be required to retain records of past transactions, contracts, and communications for a specified period. This data will not be publicly accessible and will be handled in accordance with our Privacy Policy.
                </p>
                 {isLoading ? (
                    <Button variant="destructive" disabled>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Loading Profile...
                    </Button>
                  ) : user ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                          <Button variant="destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> I understand, delete my account
                          </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete your account
                                  and remove your public data from our servers.
                              </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                                  Yes, Delete My Account
                              </AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <p className="text-sm font-medium text-destructive">
                      You must be <Link href="/login" className="underline">logged in</Link> to delete your account.
                    </p>
                  )}
              </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsPage;
