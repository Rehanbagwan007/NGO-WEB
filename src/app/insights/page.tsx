import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { FundAllocation } from './components/fund-allocation';
import { StudentProgress } from './components/student-progress';

export default function InsightsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">
          AI-Powered Insights
        </h1>
        <p className="text-muted-foreground">
          Leverage AI to generate insights and predictions on student progress
          and fund allocation.
        </p>
      </div>

      <Tabs defaultValue="fund-allocation" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="fund-allocation">
            Fund Allocation Recommendations
          </TabsTrigger>
          <TabsTrigger value="student-progress">
            Student Progress Insights
          </TabsTrigger>
        </TabsList>
        <TabsContent value="fund-allocation" className="mt-4">
          <FundAllocation />
        </TabsContent>
        <TabsContent value="student-progress" className="mt-4">
          <StudentProgress />
        </TabsContent>
      </Tabs>
    </main>
  );
}
