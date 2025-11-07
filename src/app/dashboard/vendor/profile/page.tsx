
"use client";

import type { NextPage } from 'next';
import { useUser, useFirestore, useDoc, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { getStates, getCitiesByState } from '@/services/geo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, RefreshCw, UploadCloud } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import type { Vendor } from '@/types';
import Image from 'next/image';
import { uploadFile } from '@/firebase/storage';

const MAX_FILE_SIZE_MB = 5;

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  tagline: z.string().max(100).optional(),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }),
  state: z.string().min(1, { message: "Please select a state." }),
  city: z.string().min(1, { message: "Please select a city." }),
  profileImageFile: z.custom<FileList>().optional()
    .refine((files) => !files || files?.[0]?.size <= MAX_FILE_SIZE_MB * 1024 * 1024, `Profile image must be ${MAX_FILE_SIZE_MB}MB or less.`)
    .refine((files) => !files || files?.[0]?.type.startsWith("image/"), "Profile image must be an image file."),
  bannerImageFile: z.custom<FileList>().optional()
    .refine((files) => !files || files?.[0]?.size <= MAX_FILE_SIZE_MB * 1024 * 1024, `Banner image must be ${MAX_FILE_SIZE_MB}MB or less.`)
    .refine((files) => !files || files?.[0]?.type.startsWith("image/"), "Banner image must be an image file."),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const VendorProfileSetupPage: NextPage = () => {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const vendorRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'vendors', user.uid);
  }, [firestore, user?.uid]);

  const { data: vendorData, isLoading: isVendorLoading } = useDoc<Vendor>(vendorRef);

  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<{ city: string }[]>([]);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      tagline: '',
      description: '',
      state: '',
      city: '',
    },
  });

  const selectedState = form.watch("state");

  useEffect(() => {
    getStates().then(setStates);
  }, []);

  useEffect(() => {
    if (selectedState) {
      getCitiesByState(selectedState).then(setCities);
    } else {
      setCities([]);
    }
    form.setValue('city', '');
  }, [selectedState, form]);

  useEffect(() => {
    if (vendorData) {
      form.reset({
        name: vendorData.name,
        tagline: vendorData.tagline || '',
        description: vendorData.description,
        state: vendorData.state,
        city: vendorData.city,
      });
      if(vendorData.profileImage) setProfileImagePreview(vendorData.profileImage);
      if(vendorData.bannerImage) setBannerImagePreview(vendorData.bannerImage);
    }
  }, [vendorData, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user || !vendorRef) return;
    
    form.clearErrors(); // Clear previous errors

    try {
        let profileImageUrl = vendorData?.profileImage || `https://picsum.photos/seed/${user.uid}/400/300`;
        let bannerImageUrl = vendorData?.bannerImage || `https://picsum.photos/seed/${user.uid}banner/1200/400`;

        // Upload profile image if a new one is selected
        if (data.profileImageFile && data.profileImageFile.length > 0) {
            const file = data.profileImageFile[0];
            const path = `vendors/${user.uid}/profile-image-${file.name}`;
            profileImageUrl = await uploadFile(file, path);
        }

        // Upload banner image if a new one is selected
        if (data.bannerImageFile && data.bannerImageFile.length > 0) {
            const file = data.bannerImageFile[0];
            const path = `vendors/${user.uid}/banner-image-${file.name}`;
            bannerImageUrl = await uploadFile(file, path);
        }

        const profileData: Partial<Vendor> = {
            name: data.name,
            tagline: data.tagline,
            description: data.description,
            state: data.state,
            city: data.city,
            id: user.uid,
            slug: data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            profileImage: profileImageUrl,
            bannerImage: bannerImageUrl,
            contactEmail: user.email || 'hello@venuevendors.org',
        };

        setDocumentNonBlocking(vendorRef, profileData, { merge: true });

        toast({
            title: "Profile Saved",
            description: "Your public vendor profile has been updated.",
        });

        router.push('/dashboard/vendor');
    } catch(error) {
        console.error("Error saving profile:", error);
        toast({
            title: "Upload Failed",
            description: "There was a problem uploading your images. Please try again.",
            variant: "destructive",
        });
    }
  };

  if (isUserLoading || isVendorLoading) {
    return (
      <div className="container mx-auto flex min-h-[80vh] items-center justify-center">
        <RefreshCw className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect logic moved into useEffect to prevent rendering issues
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login?redirect=/dashboard/vendor/profile');
    }
  }, [isUserLoading, user, router]);

  if (!user) {
    return null; // Return null while redirecting
  }
  
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setProfileImagePreview(URL.createObjectURL(file));
        // We use setValue to make sure react-hook-form is aware of the change
        form.setValue('profileImageFile', e.target.files as FileList);
      }
  };

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
       if (file) {
        setBannerImagePreview(URL.createObjectURL(file));
        form.setValue('bannerImageFile', e.target.files as FileList);
      }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 md:px-6">
       <Button variant="outline" asChild className="mb-6">
        <Link href="/dashboard/vendor">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl">
            {vendorData ? 'Edit Your Vendor Profile' : 'Create Your Vendor Profile'}
          </CardTitle>
          <CardDescription>
            This information will be displayed publicly on your vendor page for clients to see.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
               <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Acme Events Co." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tagline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tagline (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Making Your Events Unforgettable" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <FormField
                    control={form.control}
                    name="profileImageFile"
                    render={() => ( // field is not used directly, using custom handlers
                    <FormItem>
                      <FormLabel>Profile Picture</FormLabel>
                        {profileImagePreview && (
                            <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-dashed">
                                <Image src={profileImagePreview} alt="Profile preview" fill style={{objectFit: 'cover'}} />
                            </div>
                        )}
                      <FormControl>
                        <Input type="file" onChange={handleProfileImageChange} accept="image/*" />
                      </FormControl>
                      <FormDescription>A square image for your main profile. (Max {MAX_FILE_SIZE_MB}MB)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                 />
                <FormField
                    control={form.control}
                    name="bannerImageFile"
                    render={() => ( // field is not used directly, using custom handlers
                    <FormItem>
                      <FormLabel>Banner Image</FormLabel>
                        {bannerImagePreview && (
                            <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-dashed">
                                <Image src={bannerImagePreview} alt="Banner preview" fill style={{objectFit: 'cover'}} />
                            </div>
                        )}
                      <FormControl>
                        <Input type="file" onChange={handleBannerImageChange} accept="image/*" />
                      </FormControl>
                      <FormDescription>A wide banner for your profile page. (Max {MAX_FILE_SIZE_MB}MB)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                 />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Public Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell clients about your business, your passion, and what makes you unique."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your state of operation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {states.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedState}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your primary city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((c) => (
                            <SelectItem key={c.city} value={c.city}>{c.city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <div className="flex justify-end pt-4">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Saving...' : 'Save Profile'}
                  <Save className="ml-2 h-4 w-4" /> 
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorProfileSetupPage;
