'use client';

import type { Roadmap } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { GitMerge, CheckCircle, Circle } from 'lucide-react';

interface RoadmapDisplayProps {
  roadmap: Roadmap;
}

export default function RoadmapDisplay({ roadmap }: RoadmapDisplayProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitMerge className="h-6 w-6 text-primary" />
          <span>Career Roadmap</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {roadmap && roadmap.steps.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {roadmap.steps.map((step, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    {step.isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="text-left font-medium">{step.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-10 text-muted-foreground">
                  {step.description}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-center text-sm text-muted-foreground">No roadmap available for your career path yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
