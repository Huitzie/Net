
import type { NextPage, Metadata } from 'next';
import SuggestCategoryForm from '@/components/forms/suggest-category-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Suggest a Category | Venue Vendors',
  description: 'Help us grow! Suggest a new vendor category for Venue Vendors.',
};

interface SuggestCategoryPageProps {
  searchParams?: {
    name?: string;
  };
}

const SuggestCategoryPage: NextPage<SuggestCategoryPageProps> = ({ searchParams }) => {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <Lightbulb className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-3xl font-bold">Suggest a New Category</CardTitle>
            <CardDescription className="text-lg text-muted-foreground pt-2">
              Help us expand Venue Vendors! If you don't see a category that fits a service,
              let us know. We appreciate your input.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SuggestCategoryForm initialCategoryName={searchParams?.name} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuggestCategoryPage;
