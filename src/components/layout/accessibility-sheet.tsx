
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/theme';
import { Monitor, Moon, Sun, Type, ZoomIn, ZoomOut, Accessibility } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

const FONT_SIZES = [
  { name: 'Small', value: 0.9 },
  { name: 'Default', value: 1 },
  { name: 'Medium', value: 1.1 },
  { name: 'Large', value: 1.2 },
];

const THEMES = [
  { name: 'Light', icon: Sun, value: 'light' },
  { name: 'Dark', icon: Moon, value: 'dark' },
  { name: 'High Contrast', icon: Monitor, value: 'high-contrast' },
];

interface AccessibilitySheetProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export function AccessibilitySheet({ open, onOpenChange }: AccessibilitySheetProps) {
  const { theme, setTheme, fontSize, setFontSize } = useTheme();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-sm">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-2xl">
            <Accessibility className="h-6 w-6" />
            Accessibility Settings
          </SheetTitle>
          <SheetDescription>
            Adjust the site's appearance to fit your needs.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-8 py-6">
          {/* Font Size Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Font Size</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setFontSize(fontSize - 0.1)}
                aria-label="Decrease font size"
              >
                <ZoomOut className="h-5 w-5" />
              </Button>
              <div className="flex-grow text-center text-lg font-medium">
                {(fontSize * 100).toFixed(0)}%
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setFontSize(fontSize + 0.1)}
                aria-label="Increase font size"
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {FONT_SIZES.map((size) => (
                <Button
                  key={size.name}
                  variant={fontSize === size.value ? 'default' : 'outline'}
                  onClick={() => setFontSize(size.value)}
                  className="w-full"
                >
                  {size.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Theme Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Color Theme</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {THEMES.map((item) => (
                <Button
                  key={item.value}
                  variant={theme === item.value ? 'default' : 'outline'}
                  onClick={() => setTheme(item.value as 'light' | 'dark' | 'high-contrast')}
                  className="w-full h-12 flex items-center justify-center gap-2"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
