import {
  LayoutDashboard,
  Users,
  Briefcase,
  HeartHandshake,
  Share2,
  Settings,
  BrainCircuit,
} from 'lucide-react';
import type { ReactNode } from 'react';

type NavLink = {
  href: string;
  label: string;
  icon: ReactNode;
};

export const navLinks: NavLink[] = [
  { href: '/', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4"/> },
  { href: '/students', label: 'Students', icon: <Users className="h-4 w-4"/> },
  { href: '/staff', label: 'Staff', icon: <Briefcase className="h-4 w-4"/> },
  { href: '/donations', label: 'Donations', icon: <HeartHandshake className="h-4 w-4"/> },
  { href: '/social', label: 'Social Media', icon: <Share2 className="h-4 w-4"/> },
  { href: '/insights', label: 'AI Insights', icon: <BrainCircuit className="h-4 w-4"/> },
  { href: '/settings', label: 'Settings', icon: <Settings className="h-4 w-4"/> },
];
