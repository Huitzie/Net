
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
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { categories } from '@/data/categories';
import { addServiceToVendor } from '@/data/vendors'; // Import addServiceToVendor
import type { Service } from '@/types'; // Import Service type
import { ArrowLeft, PlusCircle, UploadCloud, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import Image from 'next/image';


const MAX_FILE_SIZE_MB = 5;
const MAX_TOTAL_FILES = 5;

const serviceFormSchema = z.object({
  name: z.string().min(3, { message: "Service name must be at least 3 characters." }).max(100, { message: "Service name too long." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }).max(1000, { message: "Description too long." }),
  category: z.string({ required_error: "Please select a category." }).min(1, { message: "Please select a category." }),
  photos: z
    .custom<FileList>((val) => val instanceof FileList, {
      message: "Expected a list of files.",
    })
    .refine((files) => files.length > 0, { message: "Please upload at least one photo."})
    .refine((files) => files.length <= MAX_TOTAL_FILES, {
      message: `You can upload a maximum of ${MAX_TOTAL_FILES} photos.`,
    })
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024),
      { message: `Each file must be ${MAX_FILE_SIZE_MB}MB or less.` }
    )
    .refine(
      (files) => Array.from(files).every((file) => file.type.startsWith("image/")),
      { message: "Only image files are allowed (e.g., JPG, PNG, GIF)." }
    )
    .optional(), // Keep optional here as FileList might not exist on initial render or if no files chosen
  priceRange: z.string().max(50, { message: "Price range too long." }).optional(),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;

const AddNewServicePage: NextPage = () => {
  const { isAuthenticated, user } = useAuthMock();
  const router = useRouter();
  const { toast } = useToast();
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);


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

  if (!isAuthenticated || user?.accountType !== 'vendor') {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-4">You must be logged in as a vendor to add a new service.</p>
        <Button asChild>
          <Link href="/login">Log In</Link>
        </Button>
      </div>
    );
  }
  
  const handlePhotoFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      form.setValue("photos", files, { shouldValidate: true }); // Update RHF
      const previews = Array.from(files).map(file => URL.createObjectURL(file));
      setPhotoPreviews(previews);
    } else {
      form.setValue("photos", undefined); // Clear if no files selected
      setPhotoPreviews([]);
    }
  };

  const removePhotoPreview = (index: number) => {
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
    const currentFiles = form.getValues("photos");
    if (currentFiles) {
      const updatedFilesArray = Array.from(currentFiles).filter((_, i) => i !== index);
      // Create a new FileList
      const dataTransfer = new DataTransfer();
      updatedFilesArray.forEach(file => dataTransfer.items.add(file));
      form.setValue("photos", dataTransfer.files.length > 0 ? dataTransfer.files : undefined, { shouldValidate: true });
    }
  };


  const onSubmit = (data: ServiceFormValues) => {
    if (!user?.id) {
      toast({ title: "User not found", variant: "destructive"});
      return;
    }
    if (!data.photos || data.photos.length === 0) {
        form.setError("photos", { type: "manual", message: "Please upload at least one photo." });
        return;
    }

    // Mock photo upload: In a real app, you'd upload files here and get URLs.
    // For this mock, we'll just use file names.
    const photoFileNames = Array.from(data.photos).map(file => `mock-uploaded-${file.name}`);

    const newService: Omit<Service, 'id'> = { // Omit ID as it will be generated
      name: data.name,
      description: data.description,
      category: data.category, // This is category name, consistent with Service type
      photos: photoFileNames,
      priceRange: data.priceRange,
    };
    
    const addedService = addServiceToVendor(user.id, newService as Service); // Cast as Service for mock

    if (addedService) {
      toast({
        title: 'Service Added!',
        description: `The service "${data.name}" has been successfully added.`,
      });
      form.reset();
      setPhotoPreviews([]);
      router.push('/dashboard/vendor/services'); // Redirect to services management page
    } else {
      toast({
        title: 'Error Adding Service',
        description: 'There was an issue adding the service. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/dashboard/vendor">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl flex items-center">
            <PlusCircle className="mr-3 h-7 w-7 text-primary" /> Add New Service
          </CardTitle>
          <CardDescription>Fill out the form below to list a new service on your vendor profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Wedding Photography Package" {...field} />
                    </FormControl>
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
                      <Textarea
                        placeholder="Describe what this service includes, its benefits, and any important details."
                        className="resize-y min-h-[120px]"
                        {...field}
                      />
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
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category for your service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Choose the most relevant category for this service.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="photos"
                render={({ fieldState }) => ( 
                  <FormItem>
                    <FormLabel>Service Photos</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="file"
                          multiple
                          onChange={handlePhotoFiles}
                          className="flex-grow text-sm file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />
                        <UploadCloud className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload images showcasing this service (max {MAX_TOTAL_FILES} files, {MAX_FILE_SIZE_MB}MB each). At least one photo required.
                    </FormDescription>
                     {photoPreviews.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-medium">Selected photo previews:</p>
                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {photoPreviews.map((previewUrl, index) => (
                            <div key={index} className="relative group aspect-square border rounded-md overflow-hidden shadow">
                              <Image src={previewUrl} alt={`Photo preview ${index + 1}`} layout="fill" objectFit="cover" data-ai-hint="photo preview" />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removePhotoPreview(index)}
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
                    <FormControl>
                      <Input placeholder="e.g., $100 - $500, Starting at $50/hr" {...field} />
                    </FormControl>
                    <FormDescription>Give clients an idea of the cost involved.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-accent hover:bg-accent/90" disabled={form.formState.isSubmitting}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Service
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddNewServicePage;
