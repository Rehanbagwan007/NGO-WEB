"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '../ui/dropdown-menu';
import { Menu, Heart, ShoppingCart } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { useState, useEffect } from 'react';
import { mainNavLinks } from '@/lib/nav-links';
import { cn } from '@/lib/utils';


const SanvedanaLogo = ({ scrolled = false }: { scrolled?: boolean }) => (
  <Link href="/" className="flex items-center gap-2 font-semibold transition-all duration-300">
    <div className={cn("relative w-auto h-16", { 'w-10 h-10': scrolled })}>
      <div className={cn("absolute inset-0 transition-opacity duration-300", scrolled ? 'opacity-0' : 'opacity-100')}>
         <svg
          width="200"
          height="60"
          viewBox="0 0 400 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M63.38,62.34C59.22,62.34 55.6,62.84 52.53,63.83C49.45,64.81 46.88,66.23 44.8,68.08C42.72,69.93 41.28,72.2 40.48,74.9C39.68,77.59 39.28,80.64 39.28,84.05C39.28,87.68 39.8,90.86 40.85,93.58C41.9,96.3 43.48,98.54 45.58,100.31C47.68,102.08 50.2,103.4 53.15,104.28C56.1,105.16 59.38,105.6 63,105.6C66.62,105.6 69.9,105.16 72.85,104.28C75.8,103.4 78.32,102.08 80.42,100.31C82.52,98.54 84.1,96.3 85.15,93.58C86.2,90.86 86.72,87.68 86.72,84.05C86.72,80.96 86.37,78.21 85.67,75.8C84.97,73.4 83.79,71.29 82.14,69.48C80.49,67.67 78.41,66.27 75.9,65.28C73.39,64.29 70.51,63.83 67.25,63.93C65.91,63.96 64.62,64.01 63.38,64.09V62.34Z M63,67.8C68.4,67.8 72.78,69.41 76.13,72.63C79.48,75.85 81.15,80.02 81.15,85.12C81.15,90.32 79.48,94.54 76.13,97.78C72.78,101.02 68.4,102.65 63,102.65C57.6,102.65 53.22,101.02 49.87,97.78C46.52,94.54 44.85,90.32 44.85,85.12C44.85,80.02 46.52,75.85 49.87,72.63C53.22,69.41 57.6,67.8 63,67.8Z" fill="black"/>
            <path d="M129.5,104.5l-13-41h5.5l10.5,35.5l10.5-35.5h5.5l-13,41h-5l-3-9.5h-13l-3,9.5h-5.5Z" fill="black"/>
            <path d="M103,42.5a9,9 0 1,1-18,0a9,9 0 1,1 18,0" fill="#d9534f"/>
            <path d="M10,88.5h100v4H10zM100.5,49v40h-4V51c-4,1-8.5,2.5-12,5l-2.5-3.5c4-3,9-5,14.5-6Z" fill="black" />
            <path d="M228.31,104.59h-4.63l-2.7-7.92h-17.37l-2.7,7.92h-4.63l13.68-40.42h5.36l13,40.42Zm-16.18-11.42h9.76l-4.88-14.86h-0.09l-4.79,14.86Z" fill="black" />
            <path d="M185.74,64.17c-13.4,0-21.72,8.19-21.72,20.31,0,12.08,8.28,20.1,21.68,20.1,13.44,0,21.72-8,21.72-20.06,0-12.16-8.28-20.35-21.68-20.35Zm0,36.5c-10.7,0-16.71-6.22-16.71-16.19,0-9.97,6-16.23,16.71-16.23,10.74,0,16.72,6.26,16.72,16.23,0,9.97-6,16.19-16.72,16.19Z" fill="black"/>
            <path d="M265.23,64.17v40.42h-4.59v-18.1h-13.77v18.1h-4.59v-40.42h4.59v18.1h13.77v-18.1h4.59Z" fill="black"/>
            <path d="M331,64.17h4.63l-13.41,20.14,14,20.28h-5l-11.66-17.37-2.66,2.37v15h-4.59v-40.42h4.59v15.33l13.1-15.33Z" fill="black"/>
            <path d="M304.5,84.5c0-11.5,8-20.5,19.5-20.5s19.5,9,19.5,20.5-8,20.5-19.5,20.5-19.5-9-19.5-20.5Zm35,0c0-9-6-16.5-15.5-16.5s-15.5,7.5-15.5,16.5,6,16.5,15.5,16.5,15.5-7.5,15.5-16.5Z" fill="black"/>
            <path d="M375,64.5v40h-4v-40h-10v-3.5h24v3.5h-10Z" fill="black"/>
        </svg>
      </div>
      <div className={cn("absolute inset-0 flex items-center justify-center transition-opacity duration-300", scrolled ? 'opacity-100' : 'opacity-0')}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.125 4.125L9.875 9.875M9.875 4.125L4.125 9.875" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14.125 14.125L19.875 19.875M19.875 14.125L14.125 19.875" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
      </div>
    </div>
  </Link>
);


// This will be replaced with actual user state
const user = null; 

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Do not render the shell on admin routes
  if (pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      
      <header className={cn("sticky top-0 z-50 flex h-24 w-full items-center px-4 md:px-6 transition-all duration-300",
        isScrolled ? '' : ''
      )}>
        <div className="container mx-auto flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
                <SanvedanaLogo scrolled={isScrolled} />
            </div>

            <div className="flex items-center gap-4">
                <nav className={cn("hidden md:flex items-center gap-6 transition-opacity duration-300", isScrolled ? "opacity-0 pointer-events-none" : "opacity-100")}>
                  {mainNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(`font-semibold transition-colors hover:text-primary`,
                        pathname === link.href ? 'text-primary' : 'text-foreground/70'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className={cn("hidden md:flex items-center gap-4 transition-opacity duration-300", isScrolled ? "opacity-0 pointer-events-none" : "opacity-100")}>
                    <Button asChild>
                        <Link href="/donations">
                            <Heart className="mr-2 h-4 w-4" />
                            Donate
                        </Link>
                    </Button>
                </div>
                
                 <Button variant="ghost" size="icon">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="sr-only">Shopping Cart</span>
                </Button>

                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        >
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full bg-background">
                        <nav className="grid gap-6 text-lg font-medium mt-16">
                        <div className="mb-4">
                            <SanvedanaLogo />
                        </div>
                        {mainNavLinks.map((link) => (
                            <Link
                            key={link.href}
                            href={link.href}
                            className={cn(`transition-colors hover:text-primary text-2xl font-bold`,
                                pathname === link.href ? 'text-primary' : 'text-foreground'
                            )}
                            onClick={() => setIsMobileMenuOpen(false)}
                            >
                            {link.label}
                            </Link>
                        ))}
                         <Link href="/donations" className={cn(`transition-colors hover:text-primary text-2xl font-bold`,
                                pathname === '/donations' ? 'text-primary' : 'text-foreground'
                            )}
                            onClick={() => setIsMobileMenuOpen(false)}>Donate</Link>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
      </header> 
      <main className="flex-1">{children}</main>
       <footer className="border-t bg-background">
          <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row md:px-6">
            <div className="text-center sm:text-left">
              <SanvedanaLogo />
              <p className="mt-2 text-sm text-muted-foreground">
                Empowering specially-abled children since 2005.
              </p>
            </div>
             <div className="flex gap-4">
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Cookies</Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy & Policy</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Sanvedana. All rights reserved.
            </p>
          </div>
        </footer>
    </div>
  );
}
