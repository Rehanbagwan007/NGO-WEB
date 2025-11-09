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
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export const adminNavLinks: NavLink[] = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard />, match: 'exact' },
  { href: '/admin/students', label: 'Students', icon: <Users />, match: 'partial' },
  { href: '/admin/staff', label: 'Team', icon: <Briefcase />, match: 'partial' },
  { href: '/admin/donations', label: 'Donations', icon: <HeartHandshake />, match: 'partial' },
  { href: '/admin/events', label: 'Events Manager', icon: <Calendar />, match: 'partial' },
  { href: '/admin/gallery', label: 'Gallery Manager', icon: <Palette />, match: 'partial' },
  { href: '/admin/blog', label: 'Blog/News Manager', icon: <Newspaper />, match: 'partial' },
  { href: '/admin/programs', label: 'Programs Manager', icon: <BookOpenCheck />, match: 'partial' },
  { href: '/admin/stories', label: 'Success Stories', icon: <Sparkles />, match: 'partial' },
  { href: '/admin/insights', label: 'AI Insights', icon: <BrainCircuit />, match: 'partial' },
  { href: '/admin/website-settings', label: 'Website Settings', icon: <Globe />, match: 'partial' },
  { href: '/admin/social', label: 'Social Media', icon: <Share2 />, match: 'partial' },
  { href: '/admin/settings', label: 'Settings', icon: <Settings />, match: 'partial' },
];
