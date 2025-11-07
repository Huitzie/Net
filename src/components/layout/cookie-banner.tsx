
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Cookie } from 'lucide-react';

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
      <Card className="container mx-auto flex flex-col md:flex-row items-center justify-between p-4 shadow-2xl">
        <div className="flex items-center mb-4 md:mb-0">
          <Cookie className="h-6 w-6 mr-3 text-primary" />
          <p className="text-sm text-card-foreground">
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Button onClick={handleAccept} className="bg-accent hover:bg-accent/90">
            Accept
          </Button>
        </div>
      </Card>
    </div>
  );
}
