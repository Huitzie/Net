
"use client";
import type { NextPage } from 'next';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit3, Mail, UserCircle2, Shield, RefreshCw } from 'lucide-react';
import Link from 'next/link';

const UserProfilePage: NextPage = () => {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
      if (!firestore || !user?.uid) return null;
      return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const {data: userProfile, isLoading: isProfileLoading} = useDoc<{accountType: 'client' | 'vendor'}>(userProfileRef);
  
  const isLoading = isUserLoading || isProfileLoading;

  if (isLoading) {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
          <div className="flex justify-center items-center min-h-[60vh]">
              <RefreshCw className="h-10 w-10 text-primary animate-spin" />
              <p className="ml-3 text-lg text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-4">Please log in to view your profile.</p>
        <Button asChild>
          <Link href="/login">Log In</Link>
        </Button>
      </div>
    );
  }

  const accountType = userProfile?.accountType;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">My Profile</h1>
         {accountType === 'vendor' && (
            <Button variant="outline" asChild>
              <Link href="/dashboard/vendor/profile">
                <Edit3 className="mr-2 h-4 w-4" /> Edit Vendor Profile
              </Link>
            </Button>
          )}
      </div>

      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="items-center text-center">
           <Avatar className="w-24 h-24 mb-4 ring-4 ring-primary ring-offset-2 ring-offset-background">
            <AvatarImage src={user.photoURL ?? `https://avatar.vercel.sh/${user.displayName || user.email}.png?size=128`} alt={user.displayName || ""} />
            <AvatarFallback className="text-3xl">{user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{user.displayName || "User"}</CardTitle>
          <CardDescription className="capitalize flex items-center justify-center">
            <Shield className="h-4 w-4 mr-1.5 text-primary" /> {accountType} Account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center"><UserCircle2 className="h-4 w-4 mr-2 text-muted-foreground" /> Name</Label>
            <Input id="name" value={user.displayName || ""} readOnly disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center"><Mail className="h-4 w-4 mr-2 text-muted-foreground" /> Email</Label>
            <Input id="email" type="email" value={user.email || ""} readOnly disabled />
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold mb-2">Account Settings</h3>
            <Button variant="link" className="p-0 h-auto text-primary" disabled>Change Password</Button><br/>
            <Button variant="link" className="p-0 h-auto text-destructive" disabled>Delete Account</Button>
             <p className="text-xs text-muted-foreground mt-2">Editing functionality is not yet implemented.</p>
          </div>

          {accountType === 'vendor' && (
            <div className="pt-4 border-t">
               <Button asChild className="w-full mt-2">
                <Link href="/dashboard/vendor">Go to Vendor Dashboard</Link>
              </Button>
            </div>
          )}
           {accountType === 'client' && (
            <div className="pt-4 border-t">
               <Button asChild className="w-full mt-2">
                <Link href="/my-favs">View My Favorites</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfilePage;
