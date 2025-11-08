
"use client";

import  { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories as allCategoriesList } from "@/data/categories";
import { getCitiesByState, getStates, type City } from '@/services/geo'; 
import { Search } from "lucide-react";
import type { Category } from '@/types';

const ALL_CATEGORIES_VALUE = "_all_categories_";

const searchFormSchema = z.object({
  state: z.string().min(1, "State is required."),
  city: z.string().min(1, "City is required."),
  category: z.string().optional().default(ALL_CATEGORIES_VALUE), 
  keyword: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

interface SearchFormProps {
  initialValues?: Partial<SearchFormValues>;
}

export default function SearchForm({ initialValues }: SearchFormProps) {
  const router = useRouter();
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      state: initialValues?.state || "",
      city: initialValues?.city || "",
      category: initialValues?.category || ALL_CATEGORIES_VALUE, 
      keyword: initialValues?.keyword || "",
    },
  });

  const selectedState = form.watch("state");

  useEffect(() => {
    async function fetchStates() {
      const fetchedStates = await getStates();
      setStates(fetchedStates);
      if (initialValues?.state && fetchedStates.includes(initialValues.state)) {
        form.setValue("state", initialValues.state);
      }
    }
    fetchStates();
  }, [initialValues?.state, form]);

  useEffect(() => {
    async function fetchCities() {
      if (selectedState) {
        const fetchedCities = await getCitiesByState(selectedState);
        setCities(fetchedCities);
        
        const currentFormCity = form.getValues("city");
        const initialCityExistsInNewList = initialValues?.city && fetchedCities.some(c => c.city === initialValues.city);

        if (initialValues?.city && initialCityExistsInNewList) {
             if (currentFormCity !== initialValues.city) { 
                form.setValue("city", initialValues.city);
            }
        } else if (initialValues?.city && !initialCityExistsInNewList && selectedState === initialValues.state) {
            if (currentFormCity === initialValues.city) {
                 form.setValue("city", "");
            }
        } else if (!initialValues?.city && currentFormCity && !fetchedCities.some(c => c.city === currentFormCity)) {
            form.setValue("city", "");
        }
      } else {
        setCities([]);
         if (form.getValues("city") !== "") { 
            form.setValue("city", ""); 
        }
      }
    }
    if (selectedState) {
        fetchCities();
    } else {
        setCities([]);
        if (!initialValues?.city || initialValues?.state !== selectedState ) {
           if (form.getValues("city") !== "") {
             form.setValue("city", "");
           }
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState, initialValues?.city, initialValues?.state, form.setValue, form.getValues]);

  function onSubmit(data: SearchFormValues) {
    const { state, city, keyword, category } = data;
    
    const params = new URLSearchParams();
    if (state) params.append("state", state);
    if (city) params.append("city", city);
    
    if (category && category !== ALL_CATEGORIES_VALUE) {
      params.append("category", category);
    }

    if (keyword) params.append("keyword", keyword);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end p-4 bg-card shadow-lg rounded-lg border">
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <Select onValueChange={ (value) => {
                field.onChange(value);
                if (initialValues?.state && value !== initialValues.state && initialValues.city === form.getValues().city) {
                  form.setValue('city', '');
                } else if (!initialValues?.state && form.getValues().city && cities.length > 0 && !cities.find(c => c.city === form.getValues().city)) {
                   form.setValue('city', '');
                }
              }} 
              value={field.value || ""} 
              >
                <FormControl>
                  <SelectTrigger className="text-primary">
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {states.map((stateName) => (
                    <SelectItem key={stateName} value={stateName} className="text-primary focus:text-primary hover:text-primary">
                      {stateName}
                    </SelectItem>
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
              <Select 
                onValueChange={field.onChange} 
                value={field.value || ""} 
                disabled={!selectedState || cities.length === 0}
              >
                <FormControl>
                  <SelectTrigger className="text-primary">
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cities.map((cityObj) => (
                    <SelectItem key={cityObj.city} value={cityObj.city} className="text-primary focus:text-primary hover:text-primary">
                      {cityObj.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  <SelectTrigger className="text-primary">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value={ALL_CATEGORIES_VALUE}>All Categories</SelectItem>
                    {allCategoriesList.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full lg:col-span-1 md:col-span-2 col-span-1 bg-accent hover:bg-accent/90">
          <Search className="mr-2 h-4 w-4" /> Search Vendors
        </Button>
      </form>
    </Form>
  );
}
