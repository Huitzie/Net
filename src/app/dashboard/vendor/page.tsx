
"use client";
import type { NextPage } from 'next';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import type { Vendor, Service, Conversation, Event, Booking } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AreaChart, ListOrdered, PlusCircle, Settings, Users, FileText, MessageSquare, Eye, DollarSign, Bot } from 'lucide-react';
import Link from 'next/link';
import VendorCard from '@/components/vendors/vendor-card';

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

  // Mock data for demonstration until analytics are built
  const analyticsData = {
    profileViews: vendorData?.reviewsCount ? vendorData.reviewsCount * 15 + 250 : 1250,
    leads: vendorData?.reviewsCount ? vendorData.reviewsCount * 2 + 5 : 78,
    totalEarnings: vendorData?.reviewsCount ? vendorData.reviewsCount * 250 + 1500 : 12500.75,
  };
  
  const firstService = services?.[0];

  const isLoading = isUserLoading || isVendorLoading || areServicesLoading;

  if (isLoading) {
    return <div className="container mx-auto py-8 px-4 md:px-6">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Welcome, {vendorData?.name || user?.displayName}!</h1>
          <p className="text-muted-foreground">Here's an overview of your vendor activity.</p>
        </div>
        <Button asChild className="mt-4 md:mt-0">
          <Link href="/dashboard/vendor/services/new"><PlusCircle className="mr-2 h-4 w-4"/> Add New Service</Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.profileViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.leads}</div>
            <p className="text-xs text-muted-foreground">+15 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <ListOrdered className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services?.length || 0}</div>
             <p className="text-xs text-muted-foreground">
                <Link href="/dashboard/vendor/services" className="hover:underline">Manage your services</Link>
             </p>
          </CardContent>
        </Card>
         <Card className="bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings (Example)</CardTitle>
            <DollarSign className="h-4 w-4 text-primary-foreground/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-primary-foreground/70">Based on completed bookings</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Profile Options & Sample Listing */}
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Options</CardTitle>
                    <CardDescription>Quickly access common actions for your vendor profile.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-20 flex-col" asChild>
                        <Link href="/dashboard/vendor/profile"><Users className="h-6 w-6 mb-1"/>Edit Profile</Link>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" asChild>
                        <Link href="/dashboard/vendor/services"><ListOrdered className="h-6 w-6 mb-1"/>Manage Services</Link>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" asChild>
                        <Link href="/dashboard/vendor/analytics"><AreaChart className="h-6 w-6 mb-1"/>View Analytics</Link>
                    </Button>
                     <Button variant="outline" className="h-20 flex-col" asChild>
                        <Link href="/profile"><Settings className="h-6 w-6 mb-1"/>Account Settings</Link>
                    </Button>
                     <Button variant="outline" className="h-20 flex-col" asChild>
                        <Link href="/inbox"><MessageSquare className="h-6 w-6 mb-1"/>Client Inbox</Link>
                    </Button>
                     <Button variant="outline" className="h-20 flex-col" asChild>
                        <Link href="/dashboard/vendor/contracts"><Bot className="h-6 w-6 mb-1"/>Contracts AI</Link>
                    </Button>
                     {vendorData?.slug && (
                        <Button variant="outline" className="h-20 flex-col" asChild>
                            <Link href={`/vendors/${vendorData.slug}`}><Eye className="h-6 w-6 mb-1"/>View Public Page</Link>
                        </Button>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>How Your Listing Appears</CardTitle>
                    <CardDescription>This is a sample of how clients see your profile card in search results.</CardDescription>
                </CardHeader>
                <CardContent>
                    {vendorData ? (
                        <div className="relative">
                            <VendorCard vendor={vendorData} />
                             <Button size="sm" asChild className="absolute top-4 right-4 z-10">
                                <Link href="/dashboard/vendor/profile"><Users className="mr-2"/>Edit</Link>
                             </Button>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted">
                            <p className="text-muted-foreground mb-4">Create your profile to see a preview.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

        {/* Sidebar: Service Preview */}
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Service Spotlight</CardTitle>
                    <CardDescription>A preview of one of your services.</CardDescription>
                </CardHeader>
                <CardContent>
                {firstService && vendorData ? (
                    <div className="space-y-4">
                       <div className="relative w-full h-40 rounded-lg overflow-hidden border bg-muted">
                            <img src={firstService.photos[0]} alt={firstService.name} className="w-full h-full object-cover"/>
                       </div>
                       <div>
                            <h4 className="font-semibold">{firstService.name}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">{firstService.description}</p>
                       </div>
                       <Button className="w-full" asChild>
                         <Link href={`/dashboard/vendor/services/edit/${firstService.id}`}>Edit Service</Link>
                       </Button>
                    </div>
                ) : (
                    <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted">
                        <p className="text-muted-foreground mb-4">You have no services listed yet. Add one to see a preview here.</p>
                        <Button asChild>
                            <Link href="/dashboard/vendor/services/new"><PlusCircle className="mr-2"/>Create Product/Service</Link>
                        </Button>
                    </div>
                )}
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  );
};

export default VendorDashboardPage;
