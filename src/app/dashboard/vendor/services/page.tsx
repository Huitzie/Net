
"use client";

import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useAuthMock } from '@/hooks/use-auth-mock';
import { getVendorServices, deleteService as apiDeleteService } from '@/data/vendors';
import type { Service } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ArrowLeft, Edit, Eye, PlusCircle, Trash2, ListOrdered, DollarSign, Tag } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';

const ManageServicesPage: NextPage = () => {
  const { isAuthenticated, user } = useAuthMock();
  const router = useRouter();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user?.accountType === 'vendor' && user.id) {
      const fetchedServices = getVendorServices(user.id); // Assuming user.id is the vendorId
      if (fetchedServices) {
        setServices(fetchedServices);
      }
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.accountType !== 'vendor') {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-4">You must be logged in as a vendor to manage services.</p>
        <Button asChild>
          <Link href="/login">Log In</Link>
        </Button>
      </div>
    );
  }

  const handleDeleteService = (serviceId: string, serviceName: string) => {
    if (!user?.id) return;
    const success = apiDeleteService(user.id, serviceId);
    if (success) {
      setServices(prevServices => prevServices.filter(s => s.id !== serviceId));
      toast({
        title: "Service Deleted",
        description: `Service "${serviceName}" has been successfully deleted.`,
      });
    } else {
      toast({
        title: "Error Deleting Service",
        description: `Could not delete service "${serviceName}". Please try again.`,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <div className="h-8 bg-muted rounded w-1/2 animate-pulse mb-6"></div>
            <div className="space-y-4">
                {[1, 2].map(i => (
                <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted rounded-t-lg"></div>
                    <CardContent className="p-4 space-y-3">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                    </CardContent>
                </Card>
                ))}
            </div>
        </div>
    );
  }


  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/dashboard/vendor">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center">
            <ListOrdered className="mr-3 h-8 w-8 text-primary" />
            Manage Your Services
          </h1>
          <p className="text-muted-foreground">View, edit, add, or remove services offered on your profile.</p>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90">
          <Link href="/dashboard/vendor/services/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Service
          </Link>
        </Button>
      </div>

      {services.length === 0 && !isLoading ? (
        <Card className="text-center py-12 shadow-lg">
          <CardHeader>
            <ListOrdered className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle className="text-2xl">No Services Listed Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-6">
              It looks like you haven't added any services to your profile. Click the button below to get started.
            </CardDescription>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
              <Link href="/dashboard/vendor/services/new">
                <PlusCircle className="mr-2 h-5 w-5" /> Add Your First Service
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3">
                {service.photos && service.photos.length > 0 && (
                  <div className="md:col-span-1 relative h-48 md:h-auto bg-muted">
                    <Image
                      src={service.photos[0]}
                      alt={service.name}
                      layout="fill"
                      objectFit="cover"
                      className="md:rounded-l-lg md:rounded-tr-none"
                      data-ai-hint="service photo"
                    />
                  </div>
                )}
                <div className={`p-6 ${service.photos && service.photos.length > 0 ? 'md:col-span-2' : 'md:col-span-3'}`}>
                  <CardHeader className="p-0 mb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-semibold">{service.name}</CardTitle>
                       <Badge variant="outline" className="ml-auto shrink-0">
                         <Tag className="h-3 w-3 mr-1.5" /> {service.category}
                       </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 mb-4">
                    <p className="text-foreground/80 text-sm line-clamp-3">{service.description}</p>
                    {service.priceRange && (
                      <p className="text-primary font-semibold mt-2 flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />{service.priceRange}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="p-0 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/vendor/services/edit/${service.id}`}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the service
                            "{service.name}" from your profile.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteService(service.id, service.name)}>
                            Yes, Delete Service
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                     <Button variant="ghost" size="sm" asChild className="text-primary">
                      <Link href={`/vendors/${user?.slug}/services/${service.id}`}> {/*  TODO: Adjust if service pages are implemented */}
                        <Eye className="mr-2 h-4 w-4" /> View Public
                      </Link>
                    </Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageServicesPage;
