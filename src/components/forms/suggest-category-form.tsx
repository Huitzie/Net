
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

const suggestCategoryFormSchema = z.object({
  categoryName: z.string().min(3, "Category name must be at least 3 characters.").max(50, "Category name too long."),
  description: z.string().min(10, "Please provide a brief description.").max(500, "Description too long."),
  reason: z.string().optional(),
  email: z.string().email("Please enter a valid email address.").optional(),
});

type SuggestCategoryFormValues = z.infer<typeof suggestCategoryFormSchema>;

interface SuggestCategoryFormProps {
  initialCategoryName?: string;
}

export default function SuggestCategoryForm({ initialCategoryName }: SuggestCategoryFormProps) {
  const { toast } = useToast();
  const form = useForm<SuggestCategoryFormValues>({
    resolver: zodResolver(suggestCategoryFormSchema),
    defaultValues: {
      categoryName: initialCategoryName || "",
      description: "",
      reason: "",
      email: "",
    },
  });

  useEffect(() => {
    if (initialCategoryName) {
      form.setValue("categoryName", initialCategoryName);
    }
  }, [initialCategoryName, form]);

  async function onSubmit(data: SuggestCategoryFormValues) {
    // In a real app, this would send an email or API request to an admin.
    // For this mock, we'll just simulate success.
    console.log("Category Suggestion:", data);

    toast({
      title: "Suggestion Sent!",
      description: `Thanks for suggesting "${data.categoryName}". We'll review it shortly.`,
    });
    form.reset({ categoryName: "", description: "", reason: "", email: "" }); // Reset form after submission
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="categoryName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Suggested Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Drone Photographers, Custom Neon Signs" {...field} />
              </FormControl>
              <FormDescription>
                A clear and concise name for the new category.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description of the Category</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what kind of services would fall under this category. For example, 'Vendors who provide custom-made neon signs for events and businesses.'"
                  className="resize-y min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Help us understand the scope of this category.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for Suggestion (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Why do you think this category should be added? (e.g., growing trend, unmet need)"
                  className="resize-y min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Email (Optional)</FormLabel>
              <FormControl>
                <Input type="email" placeholder="hello@venuevendors.org" {...field} />
              </FormControl>
              <FormDescription>
                We may contact you if we have questions about your suggestion.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full md:w-auto bg-accent hover:bg-accent/90">
          <Send className="mr-2 h-4 w-4" /> Submit Suggestion
        </Button>
      </form>
    </Form>
  );
}
