
"use client";
import type { NextPage } from 'next';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import type { Vendor, Service } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AreaChart, Eye, ListOrdered, PlusCircle, Settings, Users, FileText, MessageSquare, Heart, UploadCloud, Trash2, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Mock data for sections not yet connected to Firestore
const mockMessages = [
    { id: 'msg1', sender: 'Alice Wonderland', subject: 'Question about availability', date: '2024-07-28', unread: true },
    { id: 'msg2', sender: 'Bob The Builder', subject: 'Can you do custom orders?', date: '2024-07-27', unread: false },
    { id: 'msg3', sender: 'Charlie Brown', subject: 'Follow up on quote #123', date: '2024-07-26', unread: false },
];

const mockFavoritedBy = [
    { id: 'user1', name: 'Eve Future', avatar: `https://avatar.vercel.sh/eve.png?size=40` },
    { id: 'user2', name: 'Frank Ocean', avatar: `https://avatar.vercel.sh/frank.png?size=40` },
];

const mockContracts = [
    { id: 'contract1', name: 'Wedding Photography Agreement - Smith.pdf', status: 'Uploaded', date: '2024-07-20' },
    { id: 'contract2', name: 'Corporate Event Catering - Acme Corp.docx', status: 'Sent', date: '2024-07-15' },
];


const VendorDashboardPage: NextPage = () => {
  const { user } = useUser();
  const firestore = useFirestore();
  
  const vendorRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'vendors', user.uid);
  }, [firestore, user?.uid]);
  
  const { data: vendorData } = useDoc<Vendor>(vendorRef);

  const servicesRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return collection(firestore, 'vendors', user.uid, 'services');
  }, [firestore, user?.uid]);

  const { data: services } = useCollection<Service>(servicesRef);

  // Note: The layout already handles loading and auth checks.
  // We can assume `user` and `vendorData` are available here.
  const activeListings = services?.length || 0;

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

      {/* Stats Cards - some data is still mocked */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
            <p className="text-xs text-muted-foreground">+20% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78</div>
            <p className="text-xs text-muted-foreground">+15 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <ListOrdered className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeListings}</div>
            <p className="text-xs text-muted-foreground">Manage your services</p>
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
              <p className="text-muted-foreground mb-2">You have {activeListings} service(s) listed.</p>
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
                <Link href="/dashboard/vendor/profile"><Users className="mr-2 h-4 w-4"/> Edit Public Profile</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/profile"><Settings className="mr-2 h-4 w-4"/> Account Settings</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/vendor/analytics"><AreaChart className="mr-2 h-4 w-4"/> View Analytics</Link>
              </Button>
            </CardContent>
          </Card>
           <Card className="text-center">
              <CardContent className="pt-6">
                <Image src={vendorData?.profileImage || user?.photoURL || `https://picsum.photos/seed/${user?.uid}/200/200`} alt={vendorData?.name || ''} width={96} height={96} className="rounded-full mx-auto mb-4" data-ai-hint="vendor profile" />
                <h3 className="text-lg font-semibold">{vendorData?.name}</h3>
                <p className="text-sm text-muted-foreground">Vendor Account</p>
                {vendorData?.slug && (
                  <Button variant="link" asChild className="mt-2">
                    <Link href={`/vendors/${vendorData.slug}`}>View Public Profile</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
        </div>
      </div>

      {/* Mock Data Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><MessageSquare className="mr-2 h-5 w-5 text-primary"/> Recent Messages</CardTitle>
            <CardDescription>Your latest client communications.</CardDescription>
          </CardHeader>
          <CardContent>
            {mockMessages.length > 0 ? (
              <ul className="space-y-3">
                {mockMessages.slice(0, 2).map(msg => ( 
                  <li key={msg.id} className={`p-3 rounded-lg shadow-sm ${msg.unread ? 'bg-primary/10 border-l-4 border-primary' : 'bg-muted/30'}`}>
                    <div className="flex justify-between items-center">
                      <p className={`font-semibold ${msg.unread ? 'text-primary' : 'text-foreground'}`}>{msg.sender}</p>
                      <span className="text-xs text-muted-foreground">{msg.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-0.5">{msg.subject}</p>
                  </li>
                ))}
              </ul>
            ) : <p className="text-muted-foreground text-center py-4">No new messages.</p> }
            {mockMessages.length > 2 && <Button variant="outline" className="w-full mt-4">View All Messages</Button> }
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Heart className="mr-2 h-5 w-5 text-rose-500 fill-rose-500"/> Who Favorited You</CardTitle>
            <CardDescription>Clients who added you to their favorites.</CardDescription>
          </CardHeader>
          <CardContent>
            {mockFavoritedBy.length > 0 ? (
              <div className="space-y-3">
                {mockFavoritedBy.map(client => (
                  <div key={client.id} className="flex items-center space-x-3 p-2.5 bg-muted/30 rounded-lg shadow-sm">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={client.avatar} alt={client.name} data-ai-hint="user avatar" />
                      <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground">{client.name}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-muted-foreground text-center py-4">No favorites yet.</p> }
          </CardContent>
        </Card>

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
                <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {mockContracts.map(contract => (
                    <li key={contract.id} className="flex justify-between items-center p-2.5 bg-muted/30 rounded-lg shadow-sm">
                      <p className="text-sm font-medium text-foreground truncate" title={contract.name}>{contract.name}</p>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 p-0 ml-2 shrink-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent><DropdownMenuItem><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem></DropdownMenuContent>
                      </DropdownMenu>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-muted-foreground text-center py-3">No contracts uploaded.</p> }
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorDashboardPage;
