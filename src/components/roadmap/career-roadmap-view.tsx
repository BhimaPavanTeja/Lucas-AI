'use client';

import { useAuth } from '@/hooks/use-auth';
import { useState, useEffect } from 'react';
import { getRoadmapByCareer, type CareerRoadmapData, type RoadmapNode } from '@/lib/roadmap-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  BookOpen, 
  Code, 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  ExternalLink,
  Target,
  TrendingUp,
  Users,
  Award,
  Play
} from 'lucide-react';

export default function CareerRoadmapView() {
  const { user } = useAuth();
  const [roadmapData, setRoadmapData] = useState<CareerRoadmapData | null>(null);
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [viewMode, setViewMode] = useState<'visual' | 'list'>('visual');

  useEffect(() => {
    if (user?.career) {
      // Convert career name to ID format
      const careerId = user.career.toLowerCase().replace(/\s+/g, '-');
      const data = getRoadmapByCareer(careerId);
      setRoadmapData(data || null);
    }
  }, [user]);

  const getCategoryColor = (category: RoadmapNode['category']) => {
    const colors = {
      foundation: 'bg-blue-100 text-blue-800 border-blue-200',
      core: 'bg-green-100 text-green-800 border-green-200',
      advanced: 'bg-orange-100 text-orange-800 border-orange-200',
      specialization: 'bg-purple-100 text-purple-800 border-purple-200',
      mastery: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[category];
  };

  const getCategoryIcon = (category: RoadmapNode['category']) => {
    const icons = {
      foundation: Circle,
      core: Target,
      advanced: TrendingUp,
      specialization: Users,
      mastery: Award
    };
    const IconComponent = icons[category];
    return <IconComponent className="w-4 h-4" />;
  };

  const calculateProgress = () => {
    if (!roadmapData) return 0;
    const completedNodes = roadmapData.nodes.filter(node => node.completed).length;
    return (completedNodes / roadmapData.nodes.length) * 100;
  };

  if (!user || !user.career) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-2">No Career Selected</h2>
            <p className="text-gray-600 mb-4">Complete your profile to view your personalized roadmap</p>
            <Button>Complete Profile</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!roadmapData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-2">Roadmap Coming Soon</h2>
            <p className="text-gray-600">We're working on creating a detailed roadmap for {user.career}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold">{roadmapData.careerName} Roadmap</h1>
          </div>
          <Badge variant="outline" className="ml-auto">
            <Clock className="w-4 h-4 mr-1" />
            {roadmapData.totalEstimatedTime}
          </Badge>
        </div>
        
        <p className="text-gray-600 mb-6">{roadmapData.description}</p>
        
        {/* Progress Bar */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Your Progress</h3>
            <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-sm text-gray-600">
            {roadmapData.nodes.filter(n => n.completed).length} of {roadmapData.nodes.length} skills completed
          </p>
        </div>

        {/* View Mode Toggle */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'visual' | 'list')}>
          <TabsList>
            <TabsTrigger value="visual">Visual Roadmap</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Visual Roadmap */}
      {viewMode === 'visual' && (
        <div className="grid gap-8">
          {/* Roadmap Categories */}
          {['foundation', 'core', 'advanced', 'specialization', 'mastery'].map((category) => {
            const categoryNodes = roadmapData.nodes.filter(node => node.category === category);
            if (categoryNodes.length === 0) return null;

            return (
              <div key={category} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  {getCategoryIcon(category as RoadmapNode['category'])}
                  <h2 className="text-xl font-bold capitalize">{category}</h2>
                  <Badge className={getCategoryColor(category as RoadmapNode['category'])}>
                    {categoryNodes.length} skill{categoryNodes.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categoryNodes.map((node, index) => (
                    <Card 
                      key={node.id} 
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        node.completed ? 'bg-green-50 border-green-200' : 
                        node.current ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => setSelectedNode(node)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {node.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : node.current ? (
                              <Play className="w-5 h-5 text-blue-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-400" />
                            )}
                            {node.title}
                          </CardTitle>
                        </div>
                        <CardDescription className="text-sm">
                          {node.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            {node.estimatedTime}
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {node.skills.slice(0, 3).map((skill, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {node.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{node.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {node.projects.length} project{node.projects.length !== 1 ? 's' : ''}
                            </span>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {roadmapData.nodes.map((node, index) => (
            <Card key={node.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {node.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                        {node.title}
                      </CardTitle>
                      <CardDescription>{node.description}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getCategoryColor(node.category)}>
                    {node.category}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {node.skills.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Projects</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {node.projects.map((project, idx) => (
                        <li key={idx}>• {project}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Resources</h4>
                    <div className="space-y-1">
                      {node.resources.slice(0, 3).map((resource, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <BookOpen className="w-3 h-3" />
                          <span className={resource.free ? 'text-green-600' : 'text-gray-600'}>
                            {resource.title}
                          </span>
                          {resource.url && (
                            <ExternalLink className="w-3 h-3 text-gray-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Selected Node Detail Modal */}
      {selectedNode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {selectedNode.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                  {selectedNode.title}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedNode(null)}
                >
                  ×
                </Button>
              </div>
              <CardDescription>{selectedNode.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Skills You'll Learn</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedNode.skills.map((skill, idx) => (
                    <Badge key={idx} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Project Ideas</h4>
                <ul className="space-y-1">
                  {selectedNode.projects.map((project, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-blue-600" />
                      {project}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Learning Resources</h4>
                <div className="space-y-2">
                  {selectedNode.resources.map((resource, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-4 h-4" />
                        <div>
                          <p className="font-medium">{resource.title}</p>
                          <p className="text-sm text-gray-600 capitalize">{resource.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={resource.free ? "secondary" : "outline"}>
                          {resource.free ? "Free" : "Paid"}
                        </Badge>
                        {resource.url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Estimated time: {selectedNode.estimatedTime}
                </div>
                <Button 
                  className={selectedNode.completed ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {selectedNode.completed ? "Completed" : "Start Learning"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}