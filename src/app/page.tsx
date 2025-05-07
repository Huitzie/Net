
import SearchForm from '@/components/search/search-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { categories } from '@/data/categories';
import { Utensils, Camera, Music, Tent, Cake, Wine, Palette, Mic, Truck, MapPin, Sparkles, ListChecks, CalendarCheck, Search as SearchIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const featuredCategories = categories.slice(0, 6); // Show a few featured categories

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary to-[hsl(var(--primary-dark))] text-primary-foreground relative overflow-hidden">
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
                <SearchIcon className="h-10 w-10 text-primary-foreground" />
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
