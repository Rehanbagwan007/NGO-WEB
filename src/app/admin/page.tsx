
'use client';

import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import Link from 'next/link';
import { dashboardMetrics as hardcodedMetrics, recentDonations as hardcodedDonations } from '@/lib/data';
import { format, subMonths, startOfMonth, endOfMonth, getMonth, getYear } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import type { Donation } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardMetrics {
  totalStudents: number;
  activeStudents: number;
  totalStaff: number;
  donationsThisMonth: number;
  socialMediaFollowers: {
    facebook: number;
    instagram: number;
    twitter: number;
  };
  donationHistory: { month: string; total: number }[];
  recentDonations: Donation[];
}

async function getDashboardData(): Promise<{ metrics: DashboardMetrics, recentDonations: Donation[] }> {
    const supabase = createClient();
    const now = new Date();
    const firstDayOfMonth = startOfMonth(now);

    const { data: donationsThisMonthData, error: donationsThisMonthError } = await supabase
        .from('donations')
        .select('amount')
        .gte('date', firstDayOfMonth.toISOString());
    
    if (donationsThisMonthError) console.error("Error fetching this month's donations", donationsThisMonthError);

    const donationsThisMonth = donationsThisMonthData?.reduce((sum, d) => sum + d.amount, 0) || 0;

    const sevenMonthsAgo = startOfMonth(subMonths(now, 6));
    const { data: donationHistoryData, error: donationHistoryError } = await supabase
        .from('donations')
        .select('amount, date')
        .gte('date', sevenMonthsAgo.toISOString());
        
    if (donationHistoryError) console.error("Error fetching donation history", donationHistoryError);

    const monthlyTotals: { [key: string]: number } = {};

    if (donationHistoryData) {
        for (const donation of donationHistoryData) {
            const date = new Date(donation.date);
            const monthKey = format(date, 'MMM');
            monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + donation.amount;
        }
    }

    const donationHistory = Array.from({ length: 7 }).map((_, i) => {
        const date = subMonths(now, i);
        const month = format(date, 'MMM');
        return {
            month,
            total: monthlyTotals[month] || 0,
        };
    }).reverse();


    const { data: recentDonationsData, error: recentDonationsError } = await supabase
        .from('donations')
        .select('*')
        .order('date', { ascending: false })
        .limit(3);

    if (recentDonationsError) console.error("Error fetching recent donations:", recentDonationsError);


    return {
        metrics: {
            ...hardcodedMetrics, // Use hardcoded values for non-donation metrics
            donationsThisMonth,
            donationHistory,
        },
        recentDonations: recentDonationsData || []
    };
}


export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentDonations, setRecentDonations] = useState<Donation[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { metrics: fetchedMetrics, recentDonations: fetchedRecentDonations } = await getDashboardData();
      setMetrics(fetchedMetrics);
      setRecentDonations(fetchedRecentDonations);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading || !metrics || !recentDonations) {
    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
            </div>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-2/3" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-1/2" />
                            <Skeleton className="h-3 w-1/3 mt-1" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                    <CardHeader>
                        <CardTitle>Donation Overview</CardTitle>
                        <CardDescription>A summary of donations over the past few months.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="w-full h-[350px]" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Donations</CardTitle>
                        <CardDescription>Last 3 donations from various sources.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-8">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton className="h-9 w-9 rounded-full" />
                                <div className="grid gap-1 flex-1">
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-3 w-1/3" />
                                </div>
                                <Skeleton className="h-5 w-1/4" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </>
    )
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Donations This Month
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{metrics.donationsThisMonth.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-muted-foreground">
              For the current month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.activeStudents}
            </div>
            <p className="text-xs text-muted-foreground">
              out of {metrics.totalStudents} total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <CircleUser className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.totalStaff}
            </div>
            <p className="text-xs text-muted-foreground">
              +3 since last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Social Media Reach
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(metrics.socialMediaFollowers)
                .reduce((a, b) => a + b, 0)
                .toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-muted-foreground">
              +590 this week
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Donation Overview</CardTitle>
            <CardDescription>
              A summary of donations over the past 7 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={metrics.donationHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${Number(value) / 1000}k`}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Month
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {payload[0].payload.month}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Total
                              </span>
                              <span className="font-bold">
                                ₹
                                {payload[0].value?.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="total"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Donations</CardTitle>
              <CardDescription>
                Last 3 donations received.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/admin/donations">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-8">
            {recentDonations.length > 0 ? (
                recentDonations.map((donation) => (
                    <div key={donation.id} className="flex items-center gap-4">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage
                            src={`https://picsum.photos/seed/${donation.id}/100/100`}
                            alt="Avatar"
                        />
                        <AvatarFallback>{donation.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">
                            {donation.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {format(new Date(donation.date), 'PPP')}
                        </p>
                        </div>
                        <div className="ml-auto font-medium">
                        +₹{donation.amount.toLocaleString('en-IN')}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center text-sm text-muted-foreground">No recent donations found.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
