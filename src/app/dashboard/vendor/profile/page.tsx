
"use client";

import type { NextPage } from 'next';
import { useUser, useFirestore, useDoc, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { getStates, getCitiesByState } from '@/services/geo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, RefreshCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import type { Vendor } from '@/types';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  tagline: z.string().max(100).optional(),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }),
  state: z.string().min(1, { message: "Please select a state." }),
  city: z.string().min(1, { message: "Please select a city." }),
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
    }
  }, [vendorData, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user || !vendorRef) return;

    const profileData: Partial<Vendor> = {
      ...data,
      id: user.uid,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      // In a real app, you would upload images and get URLs here
      profileImage: vendorData?.profileImage || `https://picsum.photos/seed/${user.uid}/400/300`,
      bannerImage: vendorData?.bannerImage || `https://picsum.photos/seed/${user.uid}banner/1200/400`,
      contactEmail: user.email,
    };

    setDocumentNonBlocking(vendorRef, profileData, { merge: true });

    toast({
      title: "Profile Saved",
      description: "Your public vendor profile has been updated.",
    });

    router.push('/dashboard/vendor');
  };

  if (isUserLoading || isVendorLoading) {
    return (
      <div className="container mx-auto flex min-h-[80vh] items-center justify-center">
        <RefreshCw className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    router.replace('/login?redirect=/dashboard/vendor/profile');
    return null;
  }

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <Save className="mr-2 h-4 w-4" /> 
                  {form.formState.isSubmitting ? 'Saving...' : 'Save Profile'}
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
