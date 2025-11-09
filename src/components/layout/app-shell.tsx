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
import { useState } from 'react';
import { mainNavLinks } from '@/lib/nav-links';
import { cn } from '@/lib/utils';


const SanvedanaLogo = () => (
  <Link href="/" className="flex items-center gap-2 font-semibold">
    <svg
      width="40"
      height="40"
      viewBox="0 0 220 220"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="110" cy="110" r="108" fill="#FFF9E9" stroke="#E0E0E0" strokeWidth="1" />
      <g transform="translate(110, 100)">
        {Array.from({ length: 25 }).map((_, i) => {
          const angle = -90 + (i * 180) / 24;
          const isRed = i % 4 === 0;
          const length = isRed ? 20 : (i % 2 === 0 ? 15 : 10);
          return (
            <line
              key={i}
              x1="0"
              y1="-60"
              x2="0"
              y2={`-${60 + length}`}
              stroke={isRed ? "#d9534f" : "#333"}
              strokeWidth="2.5"
              transform={`rotate(${angle})`}
            />
          );
        })}
        <line x1="-80" y1="0" x2="80" y2="0" stroke="#333" strokeWidth="2.5" />
      </g>
      <path d="M 80 100 L 110 130 L 140 100" stroke="#4285F4" strokeWidth="3" fill="none" />
      <path d="M 85 105 L 85 125 L 110 145 L 135 125 L 135 105" stroke="#4285F4" strokeWidth="3" fill="none" strokeLinejoin="round" strokeLinecap="round" />
      
      <text x="110" y="95" fontFamily="Arial, sans-serif" fontSize="36" fontWeight="bold" textAnchor="middle" fill="#333333">
        संवेदना
      </text>
    </svg>
    <span className={'hidden xl:block text-foreground'}>Sanvedana</span>
  </Link>
);


// This will be replaced with actual user state
const user = null; 

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Do not render the shell on admin routes
  if (pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      
      <header className="sticky top-0 z-50 flex h-24 items-center bg-transparent px-4 md:px-6">
        <div className="container mx-auto flex items-center justify-between w-full">
            <SanvedanaLogo />
            
            <nav className="hidden md:flex items-center gap-6">
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

            <div className="flex items-center gap-4">
                 <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 md:hidden"
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
                 <Button asChild>
                    <Link href="/donations">
                        <Heart className="mr-2" />
                        Donate
                    </Link>
                </Button>
            </div>
        </div>
      </header> 
      <main className="flex-1 -mt-24">{children}</main>
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
