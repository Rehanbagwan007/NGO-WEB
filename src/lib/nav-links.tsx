
import {
  LayoutDashboard,
  Users,
  Briefcase,
  HeartHandshake,
  Share2,
  Settings,
  BrainCircuit,
  Home,
  Info,
  Calendar,
  Phone,
  Newspaper,
  Palette,
  Sparkles,
  BookOpenCheck,
  Globe,
  Facebook,
  Twitter,
  Instagram,
} from 'lucide-react';
import type { ReactNode } from 'react';

type NavLink = {
  href: string;
  label: string;
  icon?: ReactNode;
  match?: 'exact' | 'partial';
};

export const mainNavLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
];

export const adminNavLinks: NavLink[] = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard />, match: 'exact' },
  { href: '/admin/donations', label: 'Donations', icon: <HeartHandshake />, match: 'partial' },
  { href: '/admin/events', label: 'Events Manager', icon: <Calendar />, match: 'partial' },
  { href: '/admin/staff', label: 'Staff', icon: <Users />, match: 'partial'},
  { href: '/admin/website-settings', label: 'Website Settings', icon: <Globe />, match: 'partial' },
  { href: '/admin/social', label: 'Social Media', icon: <Share2 />, match: 'partial' },
];
