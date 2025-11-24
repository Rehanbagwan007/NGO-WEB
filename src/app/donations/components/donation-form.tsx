
'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';
import { createDonationOrder, verifyDonation } from '../actions';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email.'),
  amount: z.coerce
    .number()
    .min(10, 'Donation amount must be at least ₹10.'),
});

type DonationFormValues = z.infer<typeof formSchema>;

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function DonationForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', amount: 1000 },
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    const checkUser = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            form.setValue('email', user.email || '');
            // You might need to fetch the user's name from your profiles table
            // form.setValue('name', user.user_metadata?.full_name || '');
        }
    }
    checkUser();

    return () => {
      document.body.removeChild(script);
    };
  }, [form]);

  const onSubmit = async (values: DonationFormValues) => {
    setLoading(true);

    try {
      // 1. Create an order on the server
      const orderResult = await createDonationOrder({
        amount: values.amount,
      });
      
      if (!orderResult.success || !orderResult.order) {
        throw new Error(orderResult.error || 'Could not create payment order.');
      }
      
      const { order } = orderResult;

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: order.currency,
        name: 'Sanvedana',
        description: 'Donation to support special needs children',
        order_id: order.id,
        method: {
            upi: true,
        },
        handler: async function (response: any) {
          // 3. Verify the payment
          toast({ title: 'Processing payment...', description: 'Please wait while we verify your donation.' });
          
          const verificationResult = await verifyDonation({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            donorName: values.name,
            email: values.email,
            amount: values.amount
          });
          
          if (verificationResult.success) {
            toast({
                title: 'Donation Successful!',
                description: "Thank you so much for your generous contribution.",
            });
            router.refresh(); // Refresh the page to show the new donation in the history
          } else {
            throw new Error(verificationResult.error || 'Payment verification failed.');
          }
        },
        prefill: {
          name: values.name,
          email: values.email,
        },
        theme: {
          color: '#F59E0B', // Primary color (orange)
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response: any) {
         toast({
            variant: 'destructive',
            title: 'Payment Failed',
            description: response.error.description || 'An unknown error occurred.',
         });
         setLoading(false);
      });

      rzp.open();

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: (error as Error).message,
      });
      setLoading(false);
    }
  };

  return (
    <Card>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle>Support Our Cause</CardTitle>
                    <CardDescription>
                    Your generosity helps us provide critical care and education.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="your.email@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Donation Amount (INR)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="1000" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Donate Now
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}
