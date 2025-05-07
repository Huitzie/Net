
"use client";

import  { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
import { Input } from "@/components/ui/input";
import { categories as allCategories } from "@/data/categories";
import { getCitiesByState, getStates, type City } from '@/services/geo'; // Assuming geo service exists
import { Search } from "lucide-react";

const ALL_CATEGORIES_VALUE = "_all_categories_";

const searchFormSchema = z.object({
  state: z.string().min(1, "State is required."),
  city: z.string().min(1, "City is required."),
  category: z.string().optional(),
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
      category: initialValues?.category || "", // If initial is "" placeholder shows, if initial is ALL_CATEGORIES_VALUE, "All Categories" shows
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
        // Check if initialValues.city is present and is among the fetched cities
        const currentFormCity = form.getValues("city");
        const initialCityExistsInNewList = initialValues?.city && fetchedCities.some(c => c.city === initialValues.city);

        if (initialValues?.city && initialCityExistsInNewList) {
            // If there's an initial city and it's valid for the new state, set it.
             if (currentFormCity !== initialValues.city) { // Only set if different to avoid loop if initialValues itself causes re-render
                form.setValue("city", initialValues.city);
            }
        } else if (initialValues?.city && !initialCityExistsInNewList && selectedState === initialValues.state) {
            // If there was an initial city for the same state, but it's no longer valid (e.g. data changed),
            // and the current form city is that invalid initial city, reset it to allow placeholder or new selection.
            if (currentFormCity === initialValues.city) {
                 form.setValue("city", "");
            }
        } else if (!initialValues?.city && currentFormCity && !fetchedCities.some(c => c.city === currentFormCity)) {
            // If there was no initial city, but the form has a city selected that's not in the new list, reset.
            form.setValue("city", "");
        } else if (fetchedCities.length > 0 && currentFormCity === "" && !initialValues?.city) {
            // If cities are loaded, form city is empty, and there was no initial city, do nothing (let placeholder show)
        }


      } else {
        setCities([]);
         if (form.getValues("city") !== "") { // Only reset if not already empty
            form.setValue("city", ""); 
        }
      }
    }
    if (selectedState) {
        fetchCities();
    } else {
        setCities([]);
        // If state is cleared, clear city unless it was an initial value we want to preserve until state is selected
        if (!initialValues?.city || initialValues?.state !== selectedState ) {
           if (form.getValues("city") !== "") {
             form.setValue("city", "");
           }
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState, initialValues?.city, initialValues?.state, form.setValue, form.getValues]);


  function onSubmit(data: SearchFormValues) {
    const params = new URLSearchParams();
    if (data.state) params.append("state", data.state);
    if (data.city) params.append("city", data.city);
    
    let categoryToQuery = data.category;
    if (categoryToQuery === ALL_CATEGORIES_VALUE) {
      categoryToQuery = ""; // Treat sentinel as empty string for query (no category filter)
    }
    if (categoryToQuery) params.append("category", categoryToQuery);

    if (data.keyword) params.append("keyword", data.keyword);
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
                // If changing state, and current city was from initialValues but for a different state, clear it.
                if (initialValues?.state && value !== initialValues.state && initialValues.city === form.getValues().city) {
                  form.setValue('city', '');
                } else if (!initialValues?.state && form.getValues().city && cities.length > 0 && !cities.find(c => c.city === form.getValues().city)) {
                  // Or if no initial state, and current city is not in the new list of cities, clear it.
                   form.setValue('city', '');
                }
              }} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {states.map((stateName) => (
                    <SelectItem key={stateName} value={stateName}>
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
                value={field.value} // Controlled component
                disabled={!selectedState || cities.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cities.map((cityObj) => (
                    <SelectItem key={cityObj.city} value={cityObj.city}>
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
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ALL_CATEGORIES_VALUE}>All Categories</SelectItem>
                  {allCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Keyword search can be added here if needed for a more detailed search page
        <FormField
          control={form.control}
          name="keyword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keyword (optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., rustic, DJ, gluten-free" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        */}

        <Button type="submit" className="w-full lg:col-span-1 md:col-span-2 col-span-1 bg-accent hover:bg-accent/90">
          <Search className="mr-2 h-4 w-4" /> Search Vendors
        </Button>
      </form>
    </Form>
  );
}

