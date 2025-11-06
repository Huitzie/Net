"use client";
import Link from 'next/link';
import { siteConfig, type NavItem } from '@/config/site';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogIn, LogOut, User, ListChecks, LayoutDashboard, Heart, Menu, Search, Sparkles } from 'lucide-react';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
// import ConfettiPattern from '@/components/ui/confetti-pattern'; // Not used
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import * as React from 'react';
import { useRouter } from 'next/navigation';

const Header = () => {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // This is a placeholder. In a real app, you'd fetch this from your database
  // after the user logs in.
  const userAccountType = user ? 'client' : null; // or 'vendor'

  const userNavigation = userAccountType ? siteConfig.userNav[userAccountType] : [];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const renderUserMenu = () => {
    if (isUserLoading) {
      return null; // Or a loading spinner
    }

    if (!user) {
      return renderAuthButtons();
    }
    
    return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.photoURL ?? `https://avatar.vercel.sh/${user.displayName || user.email}.png`} alt={user.displayName || 'User'} />
            <AvatarFallback>{user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.displayName || user.email}</p>
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
        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
          <LogOut className="h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )};
  
  const renderAuthButtons = () => (
    <div className="hidden md:flex items-center space-x-2">
      <Button variant="ghost" asChild className="text-header-foreground hover:bg-header-foreground/10 hover:text-header-foreground">
        <Link href="/login">Log In</Link>
      </Button>
      <Button variant="secondary" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
        <Link href="/signup">Sign Up</Link>
      </Button>
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
          {user ? (
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
              <Button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} variant="ghost" className="w-full justify-start text-lg font-medium flex items-center gap-2 text-foreground hover:text-primary">
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
              <Button asChild variant="ghost" className="text-header-foreground border border-header-foreground/20 hover:bg-header-foreground/10 hover:text-header-foreground" key={item.href}>
                <Link href={item.href}>
                  {item.title}
                </Link>
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild className="text-header-foreground hover:bg-header-foreground/10 hover:text-header-foreground hidden md:inline-flex">
            <Link href="/search">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Link>
          </Button>
          {renderUserMenu()}
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Header;
