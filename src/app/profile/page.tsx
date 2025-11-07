
"use client";
import type { NextPage } from 'next';
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection, setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { doc, updateDoc, collection, query, where, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit3, Mail, UserCircle2, Shield, RefreshCw, KeyRound, Save, CalendarPlus, PlusCircle, Inbox } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/firebase';
import { sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { uploadFile } from '@/firebase/storage';
import { formatDistanceToNow } from 'date-fns';
import type { Conversation, Event, Booking, User as UserType } from '@/types';


const UserProfilePage: NextPage = () => {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  // User Profile Data
  const userProfileRef = useMemoFirebase(() => {
      if (!firestore || !user?.uid) return null;
      return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);
  const {data: userProfile, isLoading: isProfileLoading} = useDoc<UserType>(userProfileRef);

  // Conversations (Inbox) Data
  const conversationsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, 'conversations'), where('participantIds', 'array-contains', user.uid));
  }, [firestore, user?.uid]);
  const { data: conversations, isLoading: areConversationsLoading } = useCollection<Conversation>(conversationsQuery);
  
  // Events (Client Collections) Data
  const eventsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid || userProfile?.accountType !== 'client') return null;
    return collection(firestore, 'users', user.uid, 'events');
  }, [firestore, user?.uid, userProfile?.accountType]);
  const { data: events, isLoading: areEventsLoading } = useCollection<Event>(eventsCollectionRef);

  // Bookings (Vendor Events) Data
  const bookingsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid || userProfile?.accountType !== 'vendor') return null;
    return query(collection(firestore, 'bookings'), where('vendorId', '==', user.uid));
  }, [firestore, user?.uid, userProfile?.accountType]);
  const { data: bookings, isLoading: areBookingsLoading } = useCollection<Booking>(bookingsQuery);


  const isLoading = isUserLoading || isProfileLoading || areConversationsLoading || areEventsLoading || areBookingsLoading;
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [isLoading, user, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProfilePictureUpdate = async () => {
    if (!newProfileImage || !user || !firestore) return;
    setIsUploading(true);
    try {
      const path = `users/${user.uid}/profile-image-${newProfileImage.name}`;
      const downloadURL = await uploadFile(newProfileImage, path);
      
      // Update Auth profile
      await updateProfile(user, { photoURL: downloadURL });

      // If user is a vendor, update their public vendor profile image as well
      if (userProfile?.accountType === 'vendor') {
        const vendorDocRef = doc(firestore, 'vendors', user.uid);
        await updateDoc(vendorDocRef, { profileImage: downloadURL });
      }

      toast({ title: "Profile Picture Updated", description: "Your new profile picture has been saved." });
      setNewProfileImage(null);
      setImagePreview(null);
    } catch (error: any) {
      console.error("Error updating profile picture:", error);
      toast({ title: "Upload Failed", description: error.message || "Could not update your profile picture.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast({ title: "Password Reset Email Sent", description: `An email has been sent to ${user.email} with instructions.` });
    } catch (error: any) {
      toast({ title: "Password Reset Failed", description: error.message, variant: "destructive" });
    }
  };
  
  const handleCreateEvent = () => {
    if (!newEventName.trim() || !user || !eventsCollectionRef) return;
    const newEventRef = doc(eventsCollectionRef);
    const eventData: Event = {
      id: newEventRef.id,
      name: newEventName,
      clientId: user.uid,
      // `date` will be set by the server, so we can omit it here if using serverTimestamp
      // date: serverTimestamp(),
      favoritedVendorServiceIds: []
    }
    setDocumentNonBlocking(newEventRef, eventData, { merge: true });
    toast({ title: "Event Created", description: `"${newEventName}" has been created.` });
    setNewEventName('');
    setIsEventDialogOpen(false);
  };


  if (isLoading || !user) {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
          <div className="flex justify-center items-center min-h-[60vh]">
              <RefreshCw className="h-10 w-10 text-primary animate-spin" />
              <p className="ml-3 text-lg text-muted-foreground">Loading profile...</p>
          </div>
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
              <Link href="/dashboard/vendor">
                <Edit3 className="mr-2 h-4 w-4" /> Go to Vendor Dashboard
              </Link>
            </Button>
          )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1 space-y-6">
             <Card className="w-full shadow-lg">
                <CardHeader className="items-center text-center">
                <div className="relative">
                    <Avatar className="w-24 h-24 mb-4 ring-4 ring-primary ring-offset-2 ring-offset-background">
                    <AvatarImage src={imagePreview ?? user.photoURL ?? `https://avatar.vercel.sh/${user.displayName || user.email}.png?size=128`} alt={user.displayName || ""} />
                    <AvatarFallback className="text-3xl">{user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <Label htmlFor="profile-picture-upload" className="absolute -bottom-2 -right-2 cursor-pointer bg-secondary text-secondary-foreground rounded-full p-2 hover:bg-accent transition-colors">
                        <Edit3 className="h-4 w-4" />
                        <Input id="profile-picture-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                    </Label>
                </div>
                <CardTitle className="text-2xl">{user.displayName || "User"}</CardTitle>
                <CardDescription className="capitalize flex items-center justify-center">
                    <Shield className="h-4 w-4 mr-1.5 text-primary" /> {accountType} Account
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {imagePreview && (
                        <div className="flex flex-col items-center gap-4 p-4 border bg-muted/50 rounded-lg">
                            <p className="text-sm font-medium">New profile picture selected. Click save to apply.</p>
                            <Button onClick={handleProfilePictureUpdate} disabled={isUploading}>
                                {isUploading ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin"/> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Picture</>}
                            </Button>
                        </div>
                    )}
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
                     <Button variant="outline" onClick={handlePasswordReset}>
                        <KeyRound className="mr-2 h-4 w-4" /> Change Password
                    </Button>
                </div>
                </CardContent>
            </Card>
          </div>

        {/* Right Column: Inbox & Events/Bookings */}
        <div className="lg:col-span-2 space-y-8">
            {/* Inbox Section */}
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center"><Inbox className="mr-3 text-primary"/>My Inbox</CardTitle>
                    <CardDescription>Your communications with {accountType === 'client' ? 'vendors' : 'clients'}.</CardDescription>
                </CardHeader>
                <CardContent>
                    {conversations && conversations.length > 0 ? (
                        <div className="space-y-4">
                            {conversations.slice(0, 5).map(convo => (
                                <Link href={`/inbox/${convo.id}`} key={convo.id} legacyBehavior>
                                <a className="block p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer">
                                    <div className="flex items-center space-x-4">
                                        <Avatar className="h-12 w-12 border">
                                            <AvatarImage src={`https://avatar.vercel.sh/${convo.participantIds.find(p => p !== user.uid)}.png?size=48`} data-ai-hint="user avatar" />
                                            <AvatarFallback>{convo.participantIds.find(p => p !== user.uid)?.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-center">
                                                <p className="font-semibold text-lg">{accountType === 'client' ? 'Vendor' : 'Client'}</p>
                                                {convo.lastMessageTimestamp && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(new Date(convo.lastMessageTimestamp.seconds * 1000), { addSuffix: true })}
                                                    </p>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate">{convo.lastMessage || 'No messages yet...'}</p>
                                        </div>
                                    </div>
                                </a>
                                </Link>
                            ))}
                            {conversations.length > 5 && (
                               <Button asChild variant="outline" className="w-full mt-4"><Link href="/inbox">View All Messages</Link></Button>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">Your inbox is empty.</p>
                            <p className="text-sm text-muted-foreground mt-1">Start a conversation to see it here.</p>
                            <Button asChild variant="outline" className="mt-6"><Link href="/search">Find Vendors to Message</Link></Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Event Collections (Client) or Bookings (Vendor) Section */}
            <Card className="shadow-lg">
                {accountType === 'client' ? (
                     <>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-2xl flex items-center"><CalendarPlus className="mr-3 text-primary"/>My Event Collections</CardTitle>
                                <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                                <DialogTrigger asChild><Button><PlusCircle className="mr-2" />Create Event</Button></DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader><DialogTitle>Create a New Event</DialogTitle><DialogDescription>Give your new event collection a name.</DialogDescription></DialogHeader>
                                    <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">Name</Label>
                                        <Input id="name" value={newEventName} onChange={(e) => setNewEventName(e.target.value)} className="col-span-3" placeholder="e.g., My Wedding, Summer Party" onKeyDown={(e) => e.key === 'Enter' && handleCreateEvent()}/>
                                    </div>
                                    </div>
                                    <DialogFooter><Button type="button" onClick={handleCreateEvent} disabled={!newEventName.trim()}>Save Event</Button></DialogFooter>
                                </DialogContent>
                                </Dialog>
                            </div>
                            <CardDescription>Organize your favorite vendors into collections for your events.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {events && events.length > 0 ? (
                                <div className="space-y-2">
                                    {events.map(event => (
                                        <Card key={event.id} className="p-3 bg-muted/50 flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold">{event.name}</p>
                                                <p className="text-sm text-muted-foreground">{event.favoritedVendorServiceIds?.length || 0} vendors saved</p>
                                            </div>
                                            <Button variant="outline" size="sm" asChild><Link href={`/my-favs/${event.id}`}>Manage</Link></Button>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-center py-6">You haven't created any events yet.</p>
                            )}
                        </CardContent>
                    </>
                ) : (
                    <>
                        <CardHeader>
                           <CardTitle className="text-2xl flex items-center"><CalendarPlus className="mr-3 text-primary"/>Your Bookings</CardTitle>
                           <CardDescription>Events you have been booked for.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {bookings && bookings.length > 0 ? (
                               <div className="space-y-2">
                                    {bookings.map(booking => (
                                        <Card key={booking.id} className="p-3 bg-muted/50 flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold">Booking from Client ID: {booking.clientId.substring(0,10)}...</p>
                                                <p className="text-sm text-muted-foreground">Status: <span className="capitalize font-medium">{booking.status.replace(/_/g, ' ')}</span></p>
                                            </div>
                                            <Button variant="outline" size="sm" asChild><Link href="/dashboard/vendor">Manage</Link></Button>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-center py-6">You have no active bookings.</p>
                            )}
                        </CardContent>
                    </>
                )}
            </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
