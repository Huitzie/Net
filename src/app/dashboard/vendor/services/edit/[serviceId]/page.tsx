
"use client";

import type { NextPage } from 'next';
import { useAuthMock } from '@/hooks/use-auth-mock';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { categories } from '@/data/categories';
import { getServiceById, updateService } from '@/data/vendors';
import type { Service } from '@/types';
import { ArrowLeft, Save, UploadCloud, Image as ImageIcon, Trash2, RefreshCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';


const MAX_FILE_SIZE_MB = 5;
const MAX_TOTAL_FILES = 5;

const serviceFormSchema = z.object({
  name: z.string().min(3, { message: "Service name must be at least 3 characters." }).max(100, { message: "Service name too long." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }).max(1000, { message: "Description too long." }),
  category: z.string({ required_error: "Please select a category." }).min(1, { message: "Please select a category." }),
  photos: z
    .custom<FileList>((val) => val instanceof FileList, "Expected a list of files.")
    .optional() // Make FileList optional for cases where only existing photos are kept
    .refine(
      (files) => !files || files.length <= MAX_TOTAL_FILES, // Apply only if files exist
      { message: `You can upload a maximum of ${MAX_TOTAL_FILES} new photos.` }
    )
    .refine(
      (files) => !files || Array.from(files).every((file) => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024),
      { message: `Each new file must be ${MAX_FILE_SIZE_MB}MB or less.` }
    )
    .refine(
      (files) => !files || Array.from(files).every((file) => file.type.startsWith("image/")),
      { message: "Only image files are allowed for new uploads." }
    ),
  priceRange: z.string().max(50, { message: "Price range too long." }).optional(),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;


const EditServicePage: NextPage = () => {
  const { isAuthenticated, user } = useAuthMock();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const serviceId = params.serviceId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [serviceData, setServiceData] = useState<Service | null>(null);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [newPhotoPreviews, setNewPhotoPreviews] = useState<string[]>([]);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      photos: undefined,
      priceRange: '',
    },
  });

  useEffect(() => {
    if (isAuthenticated && user?.accountType === 'vendor' && user.id && serviceId) {
      const fetchedService = getServiceById(user.id, serviceId);
      if (fetchedService) {
        setServiceData(fetchedService);
        form.reset({
          name: fetchedService.name,
          description: fetchedService.description,
          category: fetchedService.category,
          priceRange: fetchedService.priceRange || '',
          photos: undefined, // Handled separately by existingPhotos / newPhotoPreviews
        });
        setExistingPhotos(fetchedService.photos || []);
      } else {
        toast({ title: "Service not found", variant: "destructive" });
        router.push('/dashboard/vendor/services');
      }
      setIsLoading(false);
    }
  }, [isAuthenticated, user, serviceId, form, router, toast]);

  const handleNewPhotoFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      form.setValue("photos", files, { shouldValidate: true }); // Update RHF
      const previews = Array.from(files).map(file => URL.createObjectURL(file));
      setNewPhotoPreviews(previews);
    }
  };

  const removeExistingPhoto = (index: number) => {
    setExistingPhotos(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeNewPhotoPreview = (index: number) => {
    setNewPhotoPreviews(prev => prev.filter((_, i) => i !== index));
    const currentFiles = form.getValues("photos");
    if (currentFiles) {
      const updatedFilesArray = Array.from(currentFiles).filter((_, i) => i !== index);
      // Create a new FileList (this is a bit hacky as FileList is immutable)
      const dataTransfer = new DataTransfer();
      updatedFilesArray.forEach(file => dataTransfer.items.add(file));
      form.setValue("photos", dataTransfer.files.length > 0 ? dataTransfer.files : undefined);
    }
  };


  const onSubmit = (data: ServiceFormValues) => {
    if (!user?.id || !serviceId) return;

    // Combine existing photos (that weren't removed) with any new photos
    const finalPhotoFileNames: string[] = [...existingPhotos];
    if (data.photos && data.photos.length > 0) {
        // Mock: In a real app, upload new files and get their URLs.
        // Here, we'll just use filenames for new uploads.
        const newUploadedPhotoNames = Array.from(data.photos).map(file => `mock-updated-${file.name}`);
        finalPhotoFileNames.push(...newUploadedPhotoNames);
    }

    const updatedServiceData = {
      name: data.name,
      description: data.description,
      category: data.category,
      photos: finalPhotoFileNames, // Use the combined list of photo URLs/names
      priceRange: data.priceRange,
    };
    
    const result = updateService(user.id, serviceId, updatedServiceData);

    if (result) {
      toast({
        title: 'Service Updated!',
        description: `The service "${data.name}" has been successfully updated.`,
      });
      router.push('/dashboard/vendor/services');
    } else {
      toast({
        title: 'Error Updating Service',
        description: 'There was an issue updating the service. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!isAuthenticated || user?.accountType !== 'vendor') {
    // This case should ideally be handled by a layout or higher-order component
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-4">You must be logged in as a vendor to edit a service.</p>
        <Button asChild><Link href="/login">Log In</Link></Button>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex justify-center items-center min-h-[60vh]">
            <RefreshCw className="h-10 w-10 text-primary animate-spin" />
            <p className="ml-3 text-lg text-muted-foreground">Loading service details...</p>
        </div>
      </div>
    );
  }
  
  if (!serviceData && !isLoading) {
     return (
      <div className="container mx-auto py-12 px-4 md:px-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
        <p className="text-muted-foreground mb-4">The requested service could not be found or you do not have permission to edit it.</p>
        <Button asChild variant="outline"><Link href="/dashboard/vendor/services">Back to Services</Link></Button>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/dashboard/vendor/services">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Services
        </Link>
      </Button>
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl flex items-center">
            <Save className="mr-3 h-7 w-7 text-primary" /> Edit Service
          </CardTitle>
          <CardDescription>Update the details for your service: {serviceData?.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Wedding Photography Package" {...field} /></FormControl>
                    <FormDescription>A clear and concise name for your service.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe what this service includes..." className="resize-y min-h-[120px]" {...field} />
                    </FormControl>
                    <FormDescription>Provide a detailed description of what the service offers.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Choose the most relevant category.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Existing Photos Management */}
              {existingPhotos.length > 0 && (
                <FormItem>
                  <FormLabel>Current Photos</FormLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {existingPhotos.map((photoUrl, index) => (
                      <div key={`existing-${index}`} className="relative group aspect-square border rounded-md overflow-hidden shadow">
                        <Image src={photoUrl} alt={`Existing photo ${index + 1}`} layout="fill" objectFit="cover" data-ai-hint="service photo" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeExistingPhoto(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <FormDescription>These are the photos currently associated with this service. Click trash to remove.</FormDescription>
                </FormItem>
              )}

              {/* New Photo Uploads */}
              <FormField
                control={form.control}
                name="photos"
                render={({ field: { onChange, value, ...restField }, fieldState }) => (
                  <FormItem>
                    <FormLabel>Add or Replace Photos</FormLabel>
                     <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="file"
                          multiple
                          onChange={handleNewPhotoFiles} // Use custom handler
                          className="flex-grow text-sm file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />
                         <UploadCloud className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload new images to add or replace existing ones (max {MAX_TOTAL_FILES} files, {MAX_FILE_SIZE_MB}MB each).
                      { (existingPhotos.length + (form.getValues("photos")?.length || 0)) > MAX_TOTAL_FILES && 
                        <span className="text-destructive block"> Total photos (existing + new) cannot exceed {MAX_TOTAL_FILES}.</span>
                      }
                    </FormDescription>
                    {newPhotoPreviews.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-medium">New photos to upload:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {newPhotoPreviews.map((previewUrl, index) => (
                             <div key={`new-${index}`} className="relative group aspect-square border rounded-md overflow-hidden shadow">
                              <Image src={previewUrl} alt={`New photo preview ${index + 1}`} layout="fill" objectFit="cover" data-ai-hint="service photo preview" />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeNewPhotoPreview(index)}
                                >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />


              <FormField
                control={form.control}
                name="priceRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Range (Optional)</FormLabel>
                    <FormControl><Input placeholder="e.g., $100 - $500" {...field} /></FormControl>
                    <FormDescription>Give clients an idea of the cost.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-accent hover:bg-accent/90" disabled={form.formState.isSubmitting || ((existingPhotos.length + (form.getValues("photos")?.length || 0)) > MAX_TOTAL_FILES)}>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditServicePage;

```