
'use client';

import type { NextPage } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AreaChart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const AnalyticsPage: NextPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/dashboard/vendor">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <AreaChart className="mr-3 h-6 w-6 text-primary" />
            Vendor Analytics
          </CardTitle>
          <CardDescription>
            This feature is coming soon. Here you'll find insights into your profile views, leads, and more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Analytics data will be displayed here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
