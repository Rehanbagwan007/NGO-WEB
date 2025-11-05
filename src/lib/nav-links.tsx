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
} from 'lucide-react';
import type { ReactNode } from 'react';

type NavLink = {
  href: string;
  label: string;
  icon?: ReactNode;
};

export const mainNavLinks: NavLink[] = [
  { href: '/', label: 'Home', icon: <Home className="h-4 w-4"/> },
  { href: '/about', label: 'About Us', icon: <Info className="h-4 w-4"/> },
  { href: '/events', label: 'Events', icon: <Calendar className="h-4 w-4"/> },
  { href: '/contact', label: 'Contact', icon: <Phone className="h-4 w-4"/> },
];

export const adminNavLinks: NavLink[] = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4"/> },
  { href: '/admin/students', label: 'Students', icon: <Users className="h-4 w-4"/> },
  { href: '/admin/staff', label: 'Staff', icon: <Briefcase className="h-4 w-4"/> },
  { href: '/admin/donations', label: 'Donations', icon: <HeartHandshake className="h-4 w-4"/> },
  { href: '/admin/social', label: 'Social Media', icon: <Share2 className="h-4 w-4"/> },
  { href: '/admin/insights', label: 'AI Insights', icon: <BrainCircuit className="h-4 w-4"/> },
  { href: '/admin/settings', label: 'Settings', icon: <Settings className="h-4 w-4"/> },
];
