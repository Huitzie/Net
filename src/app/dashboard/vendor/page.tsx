
"use client";
import type { NextPage } from 'next';
import { useAuthMock } from '@/hooks/use-auth-mock';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AreaChart, BarChart3, DollarSign, Edit, Eye, ListOrdered, PlusCircle, Settings, Users, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const VendorDashboardPage: NextPage = () => {
  const { isAuthenticated, user } = useAuthMock();

  if (!isAuthenticated || user?.accountType !== 'vendor') {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-4">You must be logged in as a vendor to view this page.</p>
        <Button asChild>
          <Link href="/login">Log In</Link>
        </Button>
      </div>
    );
  }

  // Mock data for demonstration
  const vendorData = {
    name: user.name || "Your Awesome Services",
    profileViews: 1250,
    leads: 78,
    activeListings: 5,
    totalEarnings: 12500.75, // Example
    profileImage: `https://picsum.photos/seed/${user.id}/200/200`
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Welcome, {vendorData.name}!</h1>
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
            <div className="text-2xl font-bold">{vendorData.profileViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendorData.leads}</div>
            <p className="text-xs text-muted-foreground">+15 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <ListOrdered className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendorData.activeListings}</div>
            <p className="text-xs text-muted-foreground">Manage your services</p>
          </CardContent>
        </Card>
         <Card className="bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings (Example)</CardTitle>
            <DollarSign className="h-4 w-4 text-primary-foreground/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${vendorData.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-primary-foreground/70">Based on completed bookings</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Manage Services Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Manage Your Services</CardTitle>
            <CardDescription>View, edit, or add new services to your profile.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for services list - to be implemented */}
            <div className="border border-dashed rounded-lg p-8 text-center">
              <ListOrdered className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">Your listed services will appear here.</p>
              <Button variant="secondary" asChild>
                <Link href="/dashboard/vendor/services"><PlusCircle className="mr-2 h-4 w-4" /> Manage Services</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Profile */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/profile"><Edit className="mr-2 h-4 w-4"/> Edit Profile</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/vendor/analytics"><AreaChart className="mr-2 h-4 w-4"/> View Analytics</Link>
              </Button>
               <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/vendor/bookings"><FileText className="mr-2 h-4 w-4"/> Manage Bookings</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/vendor/settings"><Settings className="mr-2 h-4 w-4"/> Account Settings</Link>
              </Button>
            </CardContent>
          </Card>
           <Card className="text-center">
              <CardContent className="pt-6">
                <Image src={vendorData.profileImage} alt={vendorData.name} width={96} height={96} className="rounded-full mx-auto mb-4" data-ai-hint="vendor profile image" />
                <h3 className="text-lg font-semibold">{vendorData.name}</h3>
                <p className="text-sm text-muted-foreground">Vendor Account</p>
                <Button variant="link" asChild className="mt-2">
                  <Link href={`/vendors/${user.name.toLowerCase().replace(/\s+/g, '-')}`}>View Public Profile</Link>
                </Button>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboardPage;
