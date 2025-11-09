'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { Menu, Search } from 'lucide-react';
import { adminNavLinks } from '@/lib/nav-links';
import { Input } from '@/components/ui/input';

const SanvedanaLogo = ({ inSheet = false }: { inSheet?: boolean }) => (
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
    <span className={cn(inSheet ? '' : 'xl:block text-foreground')}>Sanvedana</span>
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
        { 'bg-sidebar-accent text-sidebar-foreground': isActive }
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

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-sidebar text-sidebar-foreground md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <SanvedanaLogo />
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {adminNavLinks.map((link) => (
                <NavLink key={link.href} link={link} />
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
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
                    <AvatarImage src="https://picsum.photos/seed/admin-avatar/100/100" alt="@admin" />
                    <AvatarFallback>AD</AvatarFallback>
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
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40">
          {children}
        </main>
      </div>
    </div>
  );
}
