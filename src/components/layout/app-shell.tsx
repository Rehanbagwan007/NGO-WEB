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
  <Link href="/" className="flex items-center group">
    <div className="font-headline font-black text-foreground text-xl leading-none">
        <div>SAN</div>
        <div>VED</div>
        <div>ANA.</div>
    </div>
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
      
      <header className="sticky top-0 z-50 flex h-24 items-center border-b border-transparent bg-transparent px-4 md:px-6">
        <div className="flex items-center justify-between w-full">
            <SanvedanaLogo />
            
            <div className="flex items-center gap-4">
                <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-8">
                    {mainNavLinks.map((link) => (
                        <Link
                        key={link.href}
                        href={link.href}
                        className={cn(`transition-colors hover:text-primary font-medium uppercase tracking-wider text-xs`,
                            pathname === link.href ? 'text-primary' : 'text-foreground'
                        )}
                        >
                        {link.label}
                        </Link>
                    ))}
                    <Link href="/donations" className="transition-colors hover:text-primary font-medium uppercase tracking-wider text-xs">Donate</Link>
                </nav>

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
                    <SheetContent side="right" className="w-full">
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
                <Button variant="ghost" size="icon">
                    <ShoppingCart className="h-6 w-6" />
                    <span className="sr-only">Cart</span>
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
