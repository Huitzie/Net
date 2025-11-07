
"use client";
import type { NextPage } from 'next';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import type { Vendor, Service, Conversation, Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AreaChart, ListOrdered, PlusCircle, Settings, Users, FileText, MessageSquare, Inbox, CalendarPlus, Edit3 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { RefreshCw } from 'lucide-react';

const VendorDashboardPage: NextPage = () => {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const vendorRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'vendors', user.uid);
  }, [firestore, user?.uid]);
  const { data: vendorData, isLoading: isVendorLoading } = useDoc<Vendor>(vendorRef);

  const servicesRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return collection(firestore, 'vendors', user.uid, 'services');
  }, [firestore, user?.uid]);
  const { data: services, isLoading: areServicesLoading } = useCollection<Service>(servicesRef);

  const conversationsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, 'conversations'), where('participantIds', 'array-contains', user.uid));
  }, [firestore, user?.uid]);
  const { data: conversations, isLoading: areConversationsLoading } = useCollection<Conversation>(conversationsQuery);
  
  // Note: For vendors, "events" are effectively bookings. We'll show bookings here.
  // This can be expanded later.
  const { data: bookings, isLoading: areBookingsLoading } = useCollection<Event>(
      useMemoFirebase(() => {
          if (!firestore || !user?.uid) return null;
          return query(collection(firestore, 'bookings'), where('vendorId', '==', user.uid))
      }, [firestore, user?.uid])
  );


  const isLoading = isUserLoading || isVendorLoading || areServicesLoading || areConversationsLoading || areBookingsLoading;

  if (isLoading) {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
          <div className="flex justify-center items-center min-h-[60vh]">
              <RefreshCw className="h-10 w-10 text-primary animate-spin" />
              <p className="ml-3 text-lg text-muted-foreground">Loading Dashboard...</p>
          </div>
        </div>
      );
  }

  const activeListings = services?.length || 0;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Vendor Dashboard</h1>
          <Button asChild>
            <Link href="/dashboard/vendor/services/new"><PlusCircle className="mr-2 h-4 w-4"/> Add New Service</Link>
          </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card & Actions */}
          <div className="lg:col-span-1 space-y-6">
             <Card className="w-full shadow-lg">
                <CardHeader className="items-center text-center">
                <Avatar className="w-24 h-24 mb-4 ring-4 ring-primary ring-offset-2 ring-offset-background">
                    <AvatarImage src={vendorData?.profileImage || user?.photoURL || `https://avatar.vercel.sh/${user?.uid}.png`} alt={vendorData?.name || ""} />
                    <AvatarFallback className="text-3xl">{vendorData?.name?.charAt(0).toUpperCase() || 'V'}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl">{vendorData?.name}</CardTitle>
                <CardDescription>Vendor Account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     {vendorData?.slug && (
                      <Button variant="outline" asChild className="w-full">
                        <Link href={`/vendors/${vendorData.slug}`}>View Public Profile</Link>
                      </Button>
                    )}
                     <div className="pt-4 border-t">
                        <h3 className="text-lg font-semibold mb-3 text-center">Quick Actions</h3>
                        <div className="space-y-2">
                             <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href="/dashboard/vendor/profile"><Users className="mr-2 h-4 w-4"/> Edit Public Profile</Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href="/dashboard/vendor/services"><ListOrdered className="mr-2 h-4 w-4" /> Manage Services ({activeListings})</Link>
                            </Button>
                             <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href="/dashboard/vendor/analytics"><AreaChart className="mr-2 h-4 w-4"/> View Analytics</Link>
                            </Button>
                             <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href="/profile"><Settings className="mr-2 h-4 w-4"/> Account Settings</Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
          </div>

        {/* Right Column: Inbox & Bookings */}
        <div className="lg:col-span-2 space-y-8">
            {/* Inbox Section */}
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center"><Inbox className="mr-3 text-primary"/>Client Inbox</CardTitle>
                    <CardDescription>Your communications with potential clients.</CardDescription>
                </CardHeader>
                <CardContent>
                    {conversations && conversations.length > 0 ? (
                        <div className="space-y-4">
                            {conversations.slice(0, 5).map(convo => (
                                <Link href={`/inbox/${convo.id}`} key={convo.id} legacyBehavior>
                                <a className="block p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer">
                                    <div className="flex items-center space-x-4">
                                        <Avatar className="h-12 w-12 border">
                                            {/* In a real app, fetch the other user's profile image */}
                                            <AvatarImage src={`https://avatar.vercel.sh/${convo.participantIds.find(p => p !== user?.uid)}.png?size=48`} data-ai-hint="client avatar" />
                                            <AvatarFallback>{convo.participantIds.find(p => p !== user?.uid)?.charAt(0).toUpperCase() || 'C'}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-center">
                                                <p className="font-semibold text-lg">Client Inquiry</p>
                                                {convo.lastMessageTimestamp && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(convo.lastMessageTimestamp.toDate(), { addSuffix: true })}
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
                                <Button variant="outline" className="w-full mt-4" asChild>
                                    <Link href="/inbox">View All Messages</Link>
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">Your inbox is empty.</p>
                            <p className="text-sm text-muted-foreground mt-1">When clients message you, conversations will appear here.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Bookings Section */}
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center"><FileText className="mr-3 text-primary"/>Bookings &amp; Events</CardTitle>
                    <CardDescription>Manage your confirmed bookings and potential events.</CardDescription>
                </CardHeader>
                <CardContent>
                     {bookings && bookings.length > 0 ? (
                        <div className="space-y-2">
                            {bookings.map(booking => (
                                <Card key={booking.id} className="p-3 bg-muted/50 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{booking.name || 'Booking'}</p>
                                        <p className="text-sm text-muted-foreground">Status: {booking.status}</p>
                                    </div>
                                    <Button variant="outline" size="sm">Manage</Button>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-6">You haven't been booked for any events yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboardPage;
