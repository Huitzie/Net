
"use client";

import  { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";

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
import { getCategories, getCategoryById } from "@/data/categories";
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
  const [allCategoriesList, setAllCategoriesList] = useState<Category[]>([]);
  
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

  const [categorySearchText, setCategorySearchText] = useState<string>("");
  const [categorySuggestions, setCategorySuggestions] = useState<Category[]>([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState<boolean>(false);
  const categoryInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    async function fetchInitialData() {
      const [fetchedStates, fetchedCategories] = await Promise.all([getStates(), getCategories()]);
      setStates(fetchedStates);
      setAllCategoriesList(fetchedCategories);

      if (initialValues?.state && fetchedStates.includes(initialValues.state)) {
        form.setValue("state", initialValues.state);
      }

      if (initialValues?.category && initialValues.category !== ALL_CATEGORIES_VALUE) {
        const initialCategoryObject = fetchedCategories.find(c => c.id === initialValues.category);
        if (initialCategoryObject) {
          setCategorySearchText(initialCategoryObject.name);
          form.setValue('category', initialCategoryObject.id, { shouldValidate: true, shouldDirty: true });
        } else {
          setCategorySearchText(""); 
          form.setValue('category', ALL_CATEGORIES_VALUE);
        }
      } else if (initialValues?.category === ALL_CATEGORIES_VALUE) {
        setCategorySearchText(""); 
        form.setValue('category', ALL_CATEGORIES_VALUE);
      } else {
        setCategorySearchText("");
      }
    }
    fetchInitialData();
  }, [initialValues?.state, initialValues?.category, form]);

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
  }, [selectedState, initialValues?.city, initialValues?.state]);


  const handleCategoryInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value;
    setCategorySearchText(searchText);
    form.setValue('category', ALL_CATEGORIES_VALUE); // Reset to "All" until a suggestion is picked

    if (searchText.trim() === "") {
      setCategorySuggestions(allCategoriesList); // Show all if input is cleared or only contains spaces
      setIsSuggestionsVisible(true); // Keep suggestions visible to show all
    } else {
      const filtered = allCategoriesList.filter(cat =>
        cat.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setCategorySuggestions(filtered);
      setIsSuggestionsVisible(true);
    }
  };

  const handleSuggestionClick = (category: Category) => {
    setCategorySearchText(category.name);
    form.setValue('category', category.id);
    setIsSuggestionsVisible(false);
  };
  
  const handleAllCategoriesClick = () => {
    setCategorySearchText(""); // Or a placeholder like "All Categories"
    form.setValue('category', ALL_CATEGORIES_VALUE);
    setIsSuggestionsVisible(false);
  };


  const handleCategoryInputFocus = () => {
     if (categorySearchText.trim() === "" && !isSuggestionsVisible) {
        setCategorySuggestions(allCategoriesList); // Show all categories if input is empty on focus
     }
    setIsSuggestionsVisible(true);
  };
  
  useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
          if (
              categoryInputRef.current && !categoryInputRef.current.contains(event.target as Node) &&
              suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)
          ) {
              setIsSuggestionsVisible(false);
          }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
          document.removeEventListener("mousedown", handleClickOutside);
      };
  }, [categoryInputRef, suggestionsRef]);


  function onSubmit(data: SearchFormValues) {
    const { state, city, keyword } = data;
    let categoryToSearch = form.getValues('category');

    if (categorySearchText && (categoryToSearch === ALL_CATEGORIES_VALUE || !categoryToSearch)) {
      const matchedCategoryByName = allCategoriesList.find(c => c.name.toLowerCase() === categorySearchText.toLowerCase());
      if (matchedCategoryByName) {
        categoryToSearch = matchedCategoryByName.id;
      } else {
        router.push(`/suggest-category?name=${encodeURIComponent(categorySearchText)}`);
        return; 
      }
    }

    const params = new URLSearchParams();
    if (state) params.append("state", state);
    if (city) params.append("city", city);
    
    if (categoryToSearch && categoryToSearch !== ALL_CATEGORIES_VALUE) {
      params.append("category", categoryToSearch);
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
        
        <FormItem>
          <FormLabel>Category</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                ref={categoryInputRef}
                placeholder="Type or select a category"
                value={categorySearchText}
                onChange={handleCategoryInputChange}
                onFocus={handleCategoryInputFocus}
                className="text-primary"
              />
              {isSuggestionsVisible && (categorySuggestions.length > 0 || categorySearchText.trim() === "") && (
                <div ref={suggestionsRef} className="absolute z-10 w-full bg-card border mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  <ul>
                    <li
                      className="p-2 hover:bg-accent cursor-pointer text-primary"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleAllCategoriesClick();
                      }}
                    >
                      All Categories
                    </li>
                    {categorySuggestions.map((cat) => (
                      <li
                        key={cat.id}
                        className="p-2 hover:bg-accent cursor-pointer text-primary"
                        onMouseDown={(e) => { 
                          e.preventDefault();
                          handleSuggestionClick(cat);
                        }}
                      >
                        {cat.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </FormControl>
        </FormItem>
        
        <Button type="submit" className="w-full lg:col-span-1 md:col-span-2 col-span-1 bg-accent hover:bg-accent/90">
          <Search className="mr-2 h-4 w-4" /> Search Vendors
        </Button>
      </form>
    </Form>
  );
}
