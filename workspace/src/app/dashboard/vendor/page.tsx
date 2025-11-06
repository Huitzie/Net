
"use client";
import type { NextPage } from 'next';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AreaChart, BarChart3, DollarSign, Edit, Eye, ListOrdered, PlusCircle, Settings, Users, FileText, MessageSquare, Heart, UploadCloud, Trash2, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Mock data for new sections
const mockMessages = [
    { id: 'msg1', sender: 'Alice Wonderland', subject: 'Question about availability', date: '2024-07-28', unread: true },
    { id: 'msg2', sender: 'Bob The Builder', subject: 'Can you do custom orders?', date: '2024-07-27', unread: false },
    { id: 'msg3', sender: 'Charlie Brown', subject: 'Follow up on quote #123', date: '2024-07-26', unread: false },
    { id: 'msg4', sender: 'Diana Prince', subject: 'Urgent: Event Date Change', date: '2024-07-29', unread: true },
];

const mockFavoritedBy = [
    { id: 'user1', name: 'Eve Future', avatar: `https://avatar.vercel.sh/eve.png?size=40` },
    { id: 'user2', name: 'Frank Ocean', avatar: `https://avatar.vercel.sh/frank.png?size=40` },
    { id: 'user3', name: 'Grace Hopper', avatar: `https://avatar.vercel.sh/grace.png?size=40` },
];

const mockContracts = [
    { id: 'contract1', name: 'Wedding Photography Agreement - Smith.pdf', status: 'Uploaded', date: '2024-07-20' },
    { id: 'contract2', name: 'Corporate Event Catering - Acme Corp.docx', status: 'Sent', date: '2024-07-15' },
    { id: 'contract3', name: 'Birthday Party DJ Services - Jones.pdf', status: 'Signed', date: '2024-07-10' },
];


const VendorDashboardPage: NextPage = () => {
  const { user, isUserLoading } = useUser();
  // TODO: Replace with firestore user profile
  const accountType = 'vendor';

  if (isUserLoading) {
      return <div>Loading...</div>
  }

  if (!user || accountType !== 'vendor') {
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
    name: user.displayName || "Your Awesome Services",
    profileViews: 1250,
    leads: 78,
    activeListings: 5,
    totalEarnings: 12500.75, // Example
    profileImage: user.photoURL ?? `https://picsum.photos/seed/${user.uid}/200/200`
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
            <div className="border border-dashed rounded-lg p-8 text-center">
              <ListOrdered className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">Your listed services will appear here.</p>
              <Button variant="secondary" asChild>
                <Link href="/dashboard/vendor/services"><ListOrdered className="mr-2 h-4 w-4" /> Manage Services</Link>
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
                <Image src={vendorData.profileImage} alt={vendorData.name} width={96} height={96} className="rounded-full mx-auto mb-4" data-ai-hint="vendor profile" />
                <h3 className="text-lg font-semibold">{vendorData.name}</h3>
                <p className="text-sm text-muted-foreground">Vendor Account</p>
                <Button variant="link" asChild className="mt-2">
                  <Link href={`/vendors/${(user.displayName || '').toLowerCase().replace(/\s+/g, '-')}`}>View Public Profile</Link>
                </Button>
              </CardContent>
            </Card>
        </div>
      </div>

      {/* New Sections: Messages, Favorites, Contracts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Messages Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><MessageSquare className="mr-2 h-5 w-5 text-primary"/> Recent Messages</CardTitle>
            <CardDescription>Your latest client communications.</CardDescription>
          </CardHeader>
          <CardContent>
            {mockMessages.length > 0 ? (
              <ul className="space-y-3">
                {mockMessages.slice(0, 3).map(msg => ( 
                  <li key={msg.id} className={`p-3 rounded-lg shadow-sm ${msg.unread ? 'bg-primary/10 border-l-4 border-primary' : 'bg-muted/30'}`}>
                    <div className="flex justify-between items-center">
                      <p className={`font-semibold ${msg.unread ? 'text-primary' : 'text-foreground'}`}>{msg.sender}</p>
                      <span className="text-xs text-muted-foreground">{msg.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-0.5">{msg.subject}</p>
                    <Button variant="link" size="sm" className="p-0 h-auto mt-1 text-primary hover:underline">View Message</Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4">No new messages.</p>
            )}
            {mockMessages.length > 3 && (
                <Button variant="outline" className="w-full mt-4">View All Messages</Button>
            )}
          </CardContent>
        </Card>

        {/* Favorited By Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Heart className="mr-2 h-5 w-5 text-rose-500 fill-rose-500"/> Who Favorited You</CardTitle>
            <CardDescription>Clients who added you to their favorites.</CardDescription>
          </CardHeader>
          <CardContent>
            {mockFavoritedBy.length > 0 ? (
              <div className="space-y-3">
                {mockFavoritedBy.slice(0,5).map(client => ( // Show up to 5
                  <div key={client.id} className="flex items-center space-x-3 p-2.5 bg-muted/30 rounded-lg shadow-sm">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={client.avatar} alt={client.name} data-ai-hint="user avatar" />
                      <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground">{client.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No favorites from clients yet.</p>
            )}
             {mockFavoritedBy.length > 5 && (
                <Button variant="outline" className="w-full mt-4">View All Favorites</Button>
            )}
          </CardContent>
        </Card>

        {/* Contracts Management Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-primary"/> Contracts</CardTitle>
            <CardDescription>Manage your service agreements.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="contractUpload" className="text-sm font-medium">Upload New Contract</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input id="contractUpload" type="file" className="flex-grow text-sm file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                  <Button size="sm" className="shrink-0"><UploadCloud className="mr-1.5 h-4 w-4"/> Upload</Button>
                </div>
              </div>
              <Separator />
              <h4 className="text-sm font-medium text-foreground">Uploaded Contracts</h4>
              {mockContracts.length > 0 ? (
                <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {mockContracts.map(contract => (
                    <li key={contract.id} className="flex justify-between items-center p-2.5 bg-muted/30 rounded-lg shadow-sm">
                      <div className="flex-grow overflow-hidden">
                        <p className="text-sm font-medium text-foreground truncate" title={contract.name}>{contract.name}</p>
                        <p className={`text-xs ${contract.status === 'Signed' ? 'text-green-600' : 'text-muted-foreground'}`}>
                          Status: {contract.status} <span className="text-muted-foreground">- {contract.date}</span>
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 p-0 ml-2 shrink-0">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> View</DropdownMenuItem>
                          <DropdownMenuItem disabled={contract.status === 'Signed'}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-3">No contracts uploaded.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorDashboardPage;
