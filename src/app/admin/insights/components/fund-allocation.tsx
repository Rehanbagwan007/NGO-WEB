'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  generateFundAllocationRecommendations,
  type GenerateFundAllocationRecommendationsOutput,
} from '@/ai/flows/generate-fund-allocation-recommendations';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  studentNeeds: z.string().min(10, {
    message: 'Student needs must be at least 10 characters.',
  }),
  availableFunds: z.coerce.number().positive({
    message: 'Available funds must be a positive number.',
  }),
  previousAllocations: z.string().optional(),
});

export function FundAllocation() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] =
    useState<GenerateFundAllocationRecommendationsOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentNeeds: '',
      availableFunds: 0,
      previousAllocations: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const recommendation = await generateFundAllocationRecommendations(values);
      setResult(recommendation);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // You could use a toast notification here to show the error
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Provide Allocation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="studentNeeds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Needs & Priorities</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., New therapy equipment, more teaching staff for smaller class sizes, vocational training programs..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe the current needs and priorities for the students.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availableFunds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Funds (INR)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 500000" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the total amount of funds available for allocation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="previousAllocations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Previous Allocations (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Last quarter: 40% to salaries, 30% to infrastructure, 30% to student activities."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide details of previous fund allocations, if any.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Recommendations
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Generating insights...</p>
            </div>
          ) : result ? (
            <div className="space-y-6 text-sm">
                <div>
                    <h3 className="font-semibold text-base mb-2">Recommendations</h3>
                    <p className="prose prose-sm max-w-none whitespace-pre-wrap">{result.recommendations}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-base mb-2">Rationale</h3>
                    <p className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">{result.rationale}</p>
                </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Fill out the form to generate AI-powered recommendations.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
