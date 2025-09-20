import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowRight, Briefcase, Code, DollarSign, TrendingUp } from 'lucide-react';
import { careers, CareerInfo } from '@/lib/career-data';

interface CareerExplorerProps {
  onCareerSelect: (career: CareerInfo) => void;
  selectedCareer?: CareerInfo;
}

export default function CareerExplorer({ onCareerSelect, selectedCareer }: CareerExplorerProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const renderCareerCard = (career: CareerInfo) => (
    <Card 
      key={career.id} 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        selectedCareer?.id === career.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
      }`}
      onClick={() => onCareerSelect(career)}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {career.name}
          <ArrowRight className="w-4 h-4" />
        </CardTitle>
        <CardDescription>{career.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-sm">{career.averageSalary}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm">{career.growthRate}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {career.skills.slice(0, 3).map((skill: string) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {career.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{career.skills.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCareerDetails = (career: CareerInfo) => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Overview</h3>
        <p className="text-gray-600">{career.overview}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="projects">Sample Projects</TabsTrigger>
          <TabsTrigger value="skills">Required Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-4">
          <div className="grid gap-3">
            {career.opportunities.map((opportunity: string, index: number) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <span>{opportunity}</span>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-3">
            {career.projects.map((project: string, index: number) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-3">
                  <Code className="w-5 h-5 text-green-600" />
                  <span>{project}</span>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {career.skills.map((skill: string) => (
              <Badge key={skill} variant="outline" className="py-2 px-3">
                {skill}
              </Badge>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Career Statistics</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-600">Average Salary</span>
            <p className="font-semibold">{career.averageSalary}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Job Growth</span>
            <p className="font-semibold">{career.growthRate}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Explore Career Paths</h2>
        <p className="text-gray-600">
          Discover different tech careers and find your passion. Each path offers unique opportunities and challenges.
        </p>
      </div>

      {!selectedCareer ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {careers.map(renderCareerCard)}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => onCareerSelect(undefined as any)}
            >
              ← Back to Careers
            </Button>
            <div>
              <h2 className="text-2xl font-bold">{selectedCareer.name}</h2>
              <p className="text-gray-600">{selectedCareer.description}</p>
            </div>
          </div>
          
          <ScrollArea className="h-[600px]">
            {renderCareerDetails(selectedCareer)}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}