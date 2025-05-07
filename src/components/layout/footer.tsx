
"use client";
import type { FC } from 'react';
import { siteConfig } from '@/config/site';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-8">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="flex flex-col items-center justify-center mb-4">
            <Link href="/" className="flex items-center space-x-2 mb-2">
                <Sparkles className="h-7 w-7 text-accent" />
                <span className="font-bold text-xl">{siteConfig.name}</span>
            </Link>
            <p className="text-sm text-primary-foreground/80">{siteConfig.description}</p>
        </div>
        <p className="text-sm text-primary-foreground/70">
          &copy; {currentYear} {siteConfig.name}. All rights reserved.
        </p>
         <p className="text-xs text-primary-foreground/60 mt-2">
            Crafted with <span role="img" aria-label="love">💜</span> for memorable events.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
