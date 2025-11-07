
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Cookie, Info } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'vv_cookie_consent';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // This effect runs only on the client-side
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="container mx-auto flex flex-col md:flex-row items-start md:items-center justify-between p-4 shadow-2xl">
        <div className="flex items-start md:items-center mb-4 md:mb-0 mr-4">
          <Info className="h-6 w-6 mr-3 text-primary shrink-0 mt-1 md:mt-0" />
          <div className="text-sm text-card-foreground">
             <p className="font-semibold">Important Information</p>
             <p className="text-xs text-muted-foreground">
                Venue Vendors is a discovery platform. We do not manage agreements, services, or payments between clients and vendors. Please ensure you conduct your own due diligence and confirm all arrangements directly with your chosen service provider. By using our site, you agree to our terms of use.
             </p>
          </div>
        </div>
        <div className="flex-shrink-0 self-end md:self-center">
          <Button onClick={handleAccept} className="bg-accent hover:bg-accent/90">
            I Understand
          </Button>
        </div>
      </Card>
    </div>
  );
}
