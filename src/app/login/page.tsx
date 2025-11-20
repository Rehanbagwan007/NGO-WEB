
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { redirect, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormValues = z.infer<typeof formSchema>;

const SanvedanaLogo = () => (
    <Link href="/" className="flex items-center justify-center gap-2 font-semibold mb-4">
      <svg
        width="40"
        height="40"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10"
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
      <span className="font-headline text-3xl tracking-tighter text-foreground">
        Sanvedana
      </span>
    </Link>
  );

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(values);

    const data = await supabase.auth.signInWithPassword(values);
    const isAuth = await data?.data?.user?.aud  || null 
    console.log(isAuth)

    if(isAuth === "authenticated"){
      redirect("/admin")

    }
     
    

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'Invalid email or password. Please try again.',
      });
       setLoading(false);
    } else {
      toast({
        title: 'Login Successful',
        description: 'Redirecting to dashboard...',
      });
      // Refresh the page to allow middleware to handle the redirect
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <SanvedanaLogo />
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
