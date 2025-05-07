
"use client";
import Link from 'next/link';
import { siteConfig, type NavItem } from '@/config/site';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogIn, LogOut, User, ListChecks, LayoutDashboard, Heart, Menu, Search, Sparkles } from 'lucide-react';
import { useAuthMock } from '@/hooks/use-auth-mock';
import ConfettiPattern from '@/components/ui/confetti-pattern';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import * as React from 'react';

const Header = () => {
  const { isAuthenticated, user, logout, simulateLogin } = useAuthMock();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const userNavigation = user?.accountType ? siteConfig.userNav[user.accountType] : [];

  const renderUserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`https://avatar.vercel.sh/${user?.name}.png`} alt={user?.name || 'User'} />
            <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userNavigation.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link href={item.href} className="flex items-center gap-2">
              {item.title === "My Favs" && <Heart className="h-4 w-4" />}
              {item.title === "Dashboard" && <LayoutDashboard className="h-4 w-4" />}
              {item.title === "My Profile" && <User className="h-4 w-4" />}
              {item.title}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="flex items-center gap-2 cursor-pointer">
          <LogOut className="h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
  
  const renderAuthButtons = () => (
    <div className="hidden md:flex items-center space-x-2">
      <Button variant="ghost" asChild className="text-header-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground/80">
        <Link href="/login">Log In</Link>
      </Button>
      <Button variant="secondary" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
        <Link href="/signup">Sign Up</Link>
      </Button>
      {/* Quick login buttons for testing */}
      {process.env.NODE_ENV === 'development' && (
        <>
          <Button size="sm" variant="outline" onClick={() => simulateLogin('client')}>Login Client</Button>
          <Button size="sm" variant="outline" onClick={() => simulateLogin('vendor')}>Login Vendor</Button>
        </>
      )}
    </div>
  );

  const MobileNav = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-header-foreground">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-xs bg-background p-6">
        <Link href="/" className="flex items-center space-x-2 mb-6" onClick={() => setIsMobileMenuOpen(false)}>
          <Sparkles className="h-7 w-7 text-primary" />
          <span className="font-bold text-xl text-primary">{siteConfig.name}</span>
        </Link>
        <nav className="flex flex-col space-y-3">
          {siteConfig.mainNav.map((item) => (
             <Button
              key={item.href}
              asChild
              variant="ghost"
              className="justify-start text-lg font-medium text-foreground hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Link href={item.href}>{item.title}</Link>
            </Button>
          ))}
          <hr className="my-3"/>
          {isAuthenticated ? (
            <>
              {userNavigation.map((item) => (
                 <Button
                  key={item.href}
                  asChild
                  variant="ghost"
                  className="justify-start text-lg font-medium text-foreground hover:text-primary flex items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href={item.href}>
                    {item.title === "My Favs" && <Heart className="h-5 w-5" />}
                    {item.title === "Dashboard" && <LayoutDashboard className="h-5 w-5" />}
                    {item.title === "My Profile" && <User className="h-5 w-5" />}
                    {item.title}
                  </Link>
                </Button>
              ))}
              <Button onClick={() => { logout(); setIsMobileMenuOpen(false); }} variant="ghost" className="w-full justify-start text-lg font-medium flex items-center gap-2 text-foreground hover:text-primary">
                <LogOut className="h-5 w-5" /> Log out
              </Button>
            </>
          ) : (
            <>
               <Button asChild variant="ghost" className="justify-start text-lg font-medium text-foreground hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild variant="ghost" className="justify-start text-lg font-medium text-foreground hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-header-background text-header-foreground shadow-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6 relative">
        <div className="flex items-center space-x-2 md:space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-accent" />
            <span className="font-bold text-2xl tracking-tight">{siteConfig.name}</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
            {siteConfig.mainNav.map((item: NavItem) => (
              <Button asChild variant="ghost" className="text-header-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground/80" key={item.href}>
                <Link href={item.href}>
                  {item.title}
                </Link>
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild className="text-header-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground/80 hidden md:inline-flex">
            <Link href="/search">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Link>
          </Button>
          {isAuthenticated ? renderUserMenu() : renderAuthButtons()}
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Header;
