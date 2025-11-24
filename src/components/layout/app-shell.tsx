
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
import { Menu, Heart, Facebook, Instagram, Twitter } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { useState, useEffect } from 'react';
import { mainNavLinks } from '@/lib/nav-links';
import { cn } from '@/lib/utils';
import type { WebsiteContent } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { LuHandHeart } from "react-icons/lu";

const SanvedanaLogo = ({ scrolled = false }: { scrolled?: boolean }) => (
    <Link href="/" className="flex items-center gap-2 font-semibold transition-all duration-300">
      <svg
        width="40"
        height="40"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("transition-all duration-300", scrolled ? 'h-8 w-8' : 'h-10 w-10')}
      >
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'hsl(var(--primary) / 0.8)', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <path
          d="M50 10 C 20 10, 10 30, 10 50 C 10 70, 20 90, 50 90"
          fill="none"
          stroke="url(#logo-gradient)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M50 10 C 80 10, 90 30, 90 50 C 90 70, 80 90, 50 90"
          fill="none"
          stroke="url(#logo-gradient)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M30 50 C 30 35, 40 25, 50 25 C 60 25, 70 35, 70 50 C 70 65, 60 75, 50 75 C 40 75, 30 65, 30 50 Z"
          fill="url(#logo-gradient)"
        />
      </svg>
      <span className={cn("font-headline text-2xl tracking-tighter", scrolled ? 'hidden' : 'inline')}>
        Sanvedana
      </span>
    </Link>
  );


export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [content, setContent] = useState<WebsiteContent | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    const fetchContent = async () => {
        const supabase = createClient();
        const { data, error } = await supabase.from('website_content').select('*');
        if (error) console.error('Error fetching footer content:', error);
        else {
            const contentAsObject = data?.reduce((acc, item) => {
                acc[item.id as keyof WebsiteContent] = item.content || '';
                return acc;
            }, {} as WebsiteContent) || {};
            setContent(contentAsObject);
        }
    };
    fetchContent();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginRoute = pathname === '/login';

  if (isAdminRoute || isLoginRoute) {
    return <>{children}</>;
  }

  const copyrightText = content?.footer_copyright?.replace('{year}', new Date().getFullYear().toString()) || `© ${new Date().getFullYear()} Sanvedana. All rights reserved.`;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      
      <header className={cn("sticky top-0 z-50 flex h-24 w-full items-center px-4 md:px-6 transition-all duration-300", isScrolled && '')}>
        <div className="container mx-auto flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
                <SanvedanaLogo scrolled={isScrolled} />
            </div>

            <div className="flex items-center gap-4">
                <nav className={cn(
                    "items-center gap-6 hidden md:flex transition-all duration-300",
                    isScrolled && "opacity-0 -translate-y-4"
                  )}>
                  {mainNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(`font-nav font-bold uppercase text-sm transition-colors hover:text-primary`,
                        pathname === link.href ? 'text-primary' : 'text-foreground/70'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link href="/admin" className="font-nav font-bold uppercase text-sm transition-colors hover:text-primary text-foreground/70">Dashboard</Link>
                </nav>

                <div className={cn("flex items-center gap-4")}>
                    <Button asChild className="transition-all duration-300 rounded-full">
                        <Link href="/donations">
                            <LuHandHeart className="h-6 w-6" />
                            <span className={cn("hidden sm:inline ml-2", isScrolled && 'lg:hidden xl:inline')}>Donate</span>
                        </Link>
                    </Button>
                </div>
                
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
            </div>
        </div>
      </header> 
      <main className="flex-1 -mt-24 h-full">{children}</main>
       <footer className="border-t bg-background">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-8 px-4 py-8 md:px-6">
            <div className="text-center md:text-left">
              <SanvedanaLogo />
              <p className="mt-2 text-sm text-muted-foreground">
                {content?.footer_about || 'Empowering specially-abled children since 2005.'}
              </p>
            </div>
             <div className="flex justify-center items-center gap-4">
                {content?.social_facebook && (
                    <Button asChild variant="ghost" size="icon">
                        <Link href={content.social_facebook} target="_blank" rel="noopener noreferrer"><Facebook className="h-5 w-5" /></Link>
                    </Button>
                )}
                 {content?.social_instagram && (
                    <Button asChild variant="ghost" size="icon">
                        <Link href={content.social_instagram} target="_blank" rel="noopener noreferrer"><Instagram className="h-5 w-5" /></Link>
                    </Button>
                )}
                 {content?.social_twitter && (
                    <Button asChild variant="ghost" size="icon">
                        <Link href={content.social_twitter} target="_blank" rel="noopener noreferrer"><Twitter className="h-5 w-5" /></Link>
                    </Button>
                )}
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              {copyrightText}
            </p>
          </div>
        </footer>
    </div>
  );
}
