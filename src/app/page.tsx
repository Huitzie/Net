
import SearchForm from '@/components/search/search-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { categories } from '@/data/categories';
import { Utensils, Camera, Music, Tent, Cake, Wine, Home, Palette, Mic, Truck, MapPin, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const featuredCategories = categories.slice(0, 6); // Show a few featured categories

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary to-purple-700 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <Image src="https://picsum.photos/seed/partyhero/1920/1080" alt="Party background" layout="fill" objectFit="cover" data-ai-hint="event celebration" />
        </div>
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Find the Perfect Vendors for Your Event
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto">
            From taco trucks to wedding planners, Venue Vendors connects you with top-rated professionals to make your event unforgettable.
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Featured Categories Section */}
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Browse Popular Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredCategories.map((category) => {
              const IconComponent = category.icon || Sparkles;
              return (
                <Link href={`/search?category=${category.id}`} key={category.id} legacyBehavior>
                  <a className="block group">
                    <Card className="h-full hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
                      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                        <IconComponent className="h-10 w-10 text-primary" />
                        <CardTitle className="text-xl font-semibold">{category.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{category.description || `Find the best ${category.name.toLowerCase()} for your event.`}</CardDescription>
                      </CardContent>
                    </Card>
                  </a>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" asChild variant="outline">
              <Link href="/search">View All Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            How Venue Vendors Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-primary rounded-full mb-4 inline-block">
                <Search className="h-10 w-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Search & Discover</h3>
              <p className="text-muted-foreground">Easily find vendors by category, location, and keywords.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-primary rounded-full mb-4 inline-block">
                <ListChecks className="h-10 w-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Compare & Choose</h3>
              <p className="text-muted-foreground">View profiles, services, photos, and save your favorites.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-primary rounded-full mb-4 inline-block">
                <CalendarCheck className="h-10 w-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Book & Celebrate</h3>
              <p className="text-muted-foreground">Connect with vendors directly to book their services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action for Vendors */}
      <section className="w-full py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Are You a Vendor?</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Join Venue Vendors today to showcase your services, reach more clients, and grow your business.
          </p>
          <Button size="lg" variant="secondary" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/signup?type=vendor">Sign Up as a Vendor</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

// Dummy icons if not available in lucide-react, actual components should be imported
const ListChecks = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 2H8C4.69 2 2 4.69 2 8v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8c0-3.31-2.69-6-6-6zM12 12H8m8-4H8"/></svg>;
const CalendarCheck = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/></svg>;
const Search = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
