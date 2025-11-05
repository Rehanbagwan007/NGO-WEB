'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FundAllocation } from './components/fund-allocation';
import { StudentProgress } from './components/student-progress';

export default function InsightsPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">AI Insights</h1>
      </div>
      <p className="text-muted-foreground text-sm">
        Leverage AI to gain insights into student data and optimize fund allocation.
      </p>

      <Tabs defaultValue="student-progress" className="mt-4">
        <TabsList>
          <TabsTrigger value="student-progress">Student Progress</TabsTrigger>
          <TabsTrigger value="fund-allocation">Fund Allocation</TabsTrigger>
        </TabsList>
        <TabsContent value="student-progress" className="mt-4">
            <StudentProgress />
        </TabsContent>
        <TabsContent value="fund-allocation" className="mt-4">
            <FundAllocation />
        </TabsContent>
      </Tabs>
    </>
  );
}
