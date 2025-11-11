
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
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (values.email === 'admin@example.com' && values.password === 'password') {
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      router.push('/admin');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <Link href="/" className="flex items-center gap-2 font-semibold justify-center mb-4">
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
                <span className='text-foreground text-2xl'>Sanvedana</span>
            </Link>
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
