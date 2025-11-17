'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Menu, Search, LogOut } from 'lucide-react';
import { adminNavLinks } from '@/lib/nav-links';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';

const SanvedanaLogo = ({ inSheet = false }: { inSheet?: boolean }) => (
  <Link href="/" className="flex items-center gap-2 font-semibold">
     <svg
      width="40"
      height="40"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8"
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
    <span className={cn('font-headline text-xl tracking-tighter', inSheet ? '' : 'xl:block text-foreground')}>Sanvedana</span>
  </Link>
);

const NavLink = ({
  link,
}: {
  link: (typeof adminNavLinks)[0];
}) => {
  const pathname = usePathname();
  const isActive =
    link.match === 'exact'
      ? pathname === link.href
      : pathname.startsWith(link.href);

  return (
    <Link
      href={link.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/70 transition-all hover:text-sidebar-foreground',
        { 'bg-sidebar-accent text-sidebar-accent-foreground': isActive }
      )}
    >
      {link.icon}
      <span className='truncate'>{link.label}</span>
    </Link>
  );
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-sidebar text-sidebar-foreground md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <SanvedanaLogo />
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {adminNavLinks.map((link) => (
                <NavLink key={link.href} link={link} />
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col bg-sidebar text-sidebar-foreground">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <SanvedanaLogo inSheet />
              </div>
              <nav className="grid gap-2 text-lg font-medium">
                {adminNavLinks.map((link) => (
                  <NavLink key={link.href} link={link} />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                    <AvatarImage src={"https://picsum.photos/seed/admin-avatar/100/100"} alt={'Admin'} />
                    <AvatarFallback>{'A'}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4"/>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
