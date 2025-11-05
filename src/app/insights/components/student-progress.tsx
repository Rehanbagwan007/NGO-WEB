'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  generateStudentProgressInsights,
  type GenerateStudentProgressInsightsOutput,
} from '@/ai/flows/generate-student-progress-insights';
import { students } from '@/lib/data';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function StudentProgress() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] =
    useState<GenerateStudentProgressInsightsOutput | null>(null);
  const [studentData, setStudentData] = useState(
    JSON.stringify(students, null, 2)
  );

  async function handleAnalyze() {
    setLoading(true);
    setResult(null);
    try {
      const insights = await generateStudentProgressInsights({
        studentRecords: studentData,
      });
      setResult(insights);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Analyze Student Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="student-data">Student Records (JSON)</Label>
            <Textarea
              id="student-data"
              className="min-h-[300px] font-mono text-xs"
              value={studentData}
              onChange={(e) => setStudentData(e.target.value)}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Using mock student data by default. You can edit the JSON to analyze different records.
            </p>
          </div>
          <Button onClick={handleAnalyze} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Progress Insights
          </Button>
        </CardContent>
      </Card>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Analyzing records...</p>
            </div>
          ) : result ? (
            <div className="space-y-4 text-sm">
                <p className="prose prose-sm max-w-none whitespace-pre-wrap">{result.insights}</p>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Click the button to analyze the provided student data and generate AI-driven insights.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
