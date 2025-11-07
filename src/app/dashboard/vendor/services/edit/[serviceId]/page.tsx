
"use client";

import type { NextPage } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import type { Service } from '@/types';
import { ArrowLeft, Save, UploadCloud, Image as ImageIcon, Trash2, RefreshCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { uploadFile, deleteFileFromUrl } from '@/firebase/storage';


const MAX_FILE_SIZE_MB = 5;
const MAX_TOTAL_FILES = 12;

const serviceFormSchema = z.object({
  name: z.string().min(3, { message: "Service name must be at least 3 characters." }).max(100, { message: "Service name too long." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }).max(1000, { message: "Description too long." }),
  category: z.string({ required_error: "Please select a category." }).min(1, { message: "Please select a category." }),
  newPhotos: z
    .custom<FileList>((val) => val instanceof FileList, "Expected a list of files.")
    .optional()
    .refine(
      (files) => !files || files.length <= MAX_TOTAL_FILES,
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
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const serviceId = params.serviceId as string;

  const serviceDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid || !serviceId) return null;
    return doc(firestore, 'vendors', user.uid, 'services', serviceId);
  }, [firestore, user?.uid, serviceId]);

  const { data: serviceData, isLoading: isServiceLoading } = useDoc<Service>(serviceDocRef);
  
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [photosToRemove, setPhotosToRemove] = useState<string[]>([]); // URLs of existing photos to delete
  const [newPhotoPreviews, setNewPhotoPreviews] = useState<string[]>([]);
  const isLoading = isAuthLoading || isServiceLoading;

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      newPhotos: undefined,
      priceRange: '',
    },
  });
  
  const totalPhotoCount = existingPhotos.length + (form.watch("newPhotos")?.length || 0);

  useEffect(() => {
    if (serviceData) {
      form.reset({
        name: serviceData.name,
        description: serviceData.description,
        category: serviceData.category,
        priceRange: serviceData.priceRange || '',
        newPhotos: undefined,
      });
      setExistingPhotos(serviceData.photos || []);
    }
  }, [serviceData, form]);

  const handleNewPhotoFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      if ((existingPhotos.length + files.length) > MAX_TOTAL_FILES) {
          toast({ title: "Too many photos", description: `You can only have ${MAX_TOTAL_FILES} photos in total.`, variant: "destructive"});
          return;
      }
      form.setValue("newPhotos", files, { shouldValidate: true });
      const previews = Array.from(files).map(file => URL.createObjectURL(file));
      setNewPhotoPreviews(previews);
    }
  };

  const removeExistingPhoto = (index: number) => {
    const photoToRemove = existingPhotos[index];
    setPhotosToRemove(prev => [...prev, photoToRemove]);
    setExistingPhotos(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeNewPhotoPreview = (index: number) => {
    setNewPhotoPreviews(prev => prev.filter((_, i) => i !== index));
    const currentFiles = form.getValues("newPhotos");
    if (currentFiles) {
      const updatedFilesArray = Array.from(currentFiles).filter((_, i) => i !== index);
      const dataTransfer = new DataTransfer();
      updatedFilesArray.forEach(file => dataTransfer.items.add(file));
      form.setValue("newPhotos", dataTransfer.files, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: ServiceFormValues) => {
    if (!user?.uid || !serviceId || !serviceDocRef) return;
    
    if (totalPhotoCount === 0) {
        form.setError("newPhotos", { type: "manual", message: "A service must have at least one photo." });
        return;
    }

    try {
        // 1. Upload new photos
        const newPhotoUrls: string[] = [];
        if (data.newPhotos && data.newPhotos.length > 0) {
            const uploadPromises = Array.from(data.newPhotos).map(file => {
                const path = `vendors/${user.uid}/services/${serviceId}/${file.name}`;
                return uploadFile(file, path);
            });
            const uploadedUrls = await Promise.all(uploadPromises);
            newPhotoUrls.push(...uploadedUrls);
        }

        // 2. Delete photos marked for removal
        if (photosToRemove.length > 0) {
            const deletePromises = photosToRemove.map(url => deleteFileFromUrl(url));
            await Promise.all(deletePromises);
        }

        // 3. Construct final photo array
        const finalPhotoUrls = [...existingPhotos, ...newPhotoUrls];

        const updatedServiceData = {
          name: data.name,
          description: data.description,
          category: data.category,
          photos: finalPhotoUrls,
          priceRange: data.priceRange,
        };
        
        updateDocumentNonBlocking(serviceDocRef, updatedServiceData);

        toast({
          title: 'Service Updated!',
          description: `The service "${data.name}" has been successfully updated.`,
        });
        router.push('/dashboard/vendor/services');
    } catch(error) {
       console.error("Error updating service:", error);
       toast({
        title: "Update Failed",
        description: "An error occurred while updating the service. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user && !isAuthLoading) {
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {existingPhotos.map((photoUrl, index) => (
                      <div key={`existing-${index}`} className="relative group aspect-square border rounded-md overflow-hidden shadow">
                        <Image src={photoUrl} alt={`Existing photo ${index + 1}`} fill style={{objectFit: 'cover'}} data-ai-hint="service photo" />
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
                  <FormDescription>Click trash icon to remove an existing photo.</FormDescription>
                </FormItem>
              )}

              {/* New Photo Uploads */}
              <FormField
                control={form.control}
                name="newPhotos"
                render={({ fieldState }) => (
                  <FormItem>
                    <FormLabel>Add New Photos</FormLabel>
                     <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleNewPhotoFiles}
                          className="flex-grow text-sm file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />
                         <UploadCloud className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Total photos (existing + new) cannot exceed {MAX_TOTAL_FILES}. Each file max {MAX_FILE_SIZE_MB}MB.
                    </FormDescription>
                    {newPhotoPreviews.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-medium">New photos to upload:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                          {newPhotoPreviews.map((previewUrl, index) => (
                             <div key={`new-${index}`} className="relative group aspect-square border rounded-md overflow-hidden shadow">
                              <Image src={previewUrl} alt={`New photo preview ${index + 1}`} fill style={{objectFit: 'cover'}} data-ai-hint="service photo preview" />
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
                <Button type="submit" className="bg-accent hover:bg-accent/90" disabled={form.formState.isSubmitting || totalPhotoCount > MAX_TOTAL_FILES}>
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
