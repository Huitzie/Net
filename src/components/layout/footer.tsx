
"use client";
import type { FC } from 'react';
import { siteConfig } from '@/config/site';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-8 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
              <Link href="/" className="flex items-center space-x-2 mb-2">
                  <Sparkles className="h-7 w-7 text-accent" />
                  <span className="font-bold text-xl">{siteConfig.name}</span>
              </Link>
              <p className="text-sm text-primary-foreground/80">{siteConfig.description}</p>
          </div>
          <div className="text-center md:text-right">
             <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center md:justify-end mb-2">
                <Link href="/about" className="text-sm text-primary-foreground/80 hover:text-primary-foreground">About Us</Link>
                <a href="mailto:info@venuevendors.org" className="text-sm text-primary-foreground/80 hover:text-primary-foreground">Contact Us</a>
                <Link href="/terms" className="text-sm text-primary-foreground/80 hover:text-primary-foreground">Terms & Conditions</Link>
             </div>
             <p className="text-sm text-primary-foreground/70">
                &copy; {currentYear} {siteConfig.name}. All rights reserved.
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
