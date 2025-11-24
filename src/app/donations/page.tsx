
'use client';

import { createClient } from '@/lib/supabase/client';
import type { Donation } from '@/lib/types';
import { use, useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { DonationForm } from './components/donation-form';
import { Skeleton } from '@/components/ui/skeleton';

async function getUserDonations() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return [];
    }

    const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('email', user.email)
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching user donations:', error);
        return [];
    }

    return data;
}

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDonations() {
        const userDonations = await getUserDonations();
        setDonations(userDonations);
        setLoading(false);
    }
    loadDonations();
  }, []);


  const getBadgeVariant = (status: Donation['status']) => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };
    
  return (
    <main className="flex flex-1 flex-col gap-8 p-4 lg:gap-6 lg:p-6 container mx-auto mt-12">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Make a Donation</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <DonationForm />

        <Card>
          <CardHeader>
            <CardTitle>My Donation History</CardTitle>
            <CardDescription>
              Thank you for your generous support of Sanvedana.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            ) : donations.length > 0 ? (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Amount</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {donations.map((donation) => (
                    <TableRow key={donation.id}>
                        <TableCell>
                        {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                        }).format(donation.amount)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                        {format(new Date(donation.date), 'PPP')}
                        </TableCell>
                        <TableCell>
                        <Badge variant={getBadgeVariant(donation.status)}>
                            {donation.status}
                        </Badge>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            ) : (
                <div className="text-center text-muted-foreground py-8">
                    You haven&apos;t made any donations yet.
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
