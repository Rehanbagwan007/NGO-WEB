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
      width="100"
      height="100"
      viewBox="0 0 258 258"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-16 h-16"
    >
      <circle cx="129" cy="129" r="129" fill="#FFFAF0" />
      <path
        d="M129 65C158.376 65 182 88.6243 182 118C182 132.849 174.971 146.223 163.754 155.026C163.094 155.539 162.38 155.992 161.621 156.389L161.536 156.441C152.213 162.1 141.039 165.5 129 165.5C99.6243 165.5 76 141.876 76 112.5C76 96.2575 84.0537 81.705 97.5937 72.8489"
        stroke="#E57373"
        strokeWidth="10"
        strokeMiterlimit="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M109.11 96.2891L113.898 102.328C114.156 102.664 114.542 102.859 114.949 102.859C115.356 102.859 115.742 102.664 116.001 102.328L120.789 96.2891C122.309 94.3359 124.962 93.9844 126.856 95.5391C128.751 97.0938 129.063 99.7891 127.544 101.742L121.235 110.055C122.915 110.391 124.434 111.125 125.761 112.195L126.019 112.383C128.024 113.828 128.409 116.523 126.856 118.414C125.302 120.305 122.649 120.656 120.724 119.211L115.649 115.289C115.242 114.9805 114.657 114.9805 114.251 115.289L109.176 119.211C107.251 120.656 104.598 120.305 103.044 118.414C101.491 116.523 101.876 113.828 103.882 112.383L104.139 112.195C105.466 111.125 106.985 110.391 108.665 110.055L102.356 101.742C100.837 99.7891 101.149 97.0938 103.044 95.5391C104.938 93.9844 107.591 94.3359 109.11 96.2891Z"
        fill="#FFB74D"
      />
      <path
        d="M93 168.5L100.5 175.5L111 164"
        stroke="#4CAF50"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M129 178C142.255 178 153 167.255 153 154C153 140.745 142.255 130 129 130C115.745 130 105 140.745 105 154C105 167.255 115.745 178 129 178Z"
        stroke="#4CAF50"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M152 165L160.5 175.5L174 158.5"
        stroke="#4CAF50"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M110 197L116 204L129 191L142 204L148 197"
        stroke="#4CAF50"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M93.3022 51.5C100.906 43.033 114.072 38 129 38C156.062 38 178 59.938 178 87"
        stroke="#E57373"
        strokeWidth="10"
        strokeMiterlimit="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="129"
        y="235"
        fontFamily="'Space Grotesk', sans-serif"
        fontSize="24"
        fontWeight="bold"
        textAnchor="middle"
        fill="#333333"
      >
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
