'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  Search, 
  MapPin, 
  DollarSign, 
  Clock, 
  Users,
  Building,
  Star,
  ArrowUpRight,
  Filter
} from 'lucide-react';

// Mock data for job insights
const trendingJobs = [
  {
    title: 'AI/ML Engineer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    salary: '$140K - $180K',
    growth: '+25%',
    remote: true,
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning'],
    demand: 'Very High'
  },
  {
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'Austin, TX',
    salary: '$90K - $130K',
    growth: '+18%',
    remote: true,
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    demand: 'High'
  },
  {
    title: 'Data Scientist',
    company: 'DataTech',
    location: 'New York, NY',
    salary: '$120K - $160K',
    growth: '+22%',
    remote: false,
    skills: ['Python', 'SQL', 'Tableau', 'Statistics'],
    demand: 'Very High'
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudFirst',
    location: 'Seattle, WA',
    salary: '$110K - $150K',
    growth: '+20%',
    remote: true,
    skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform'],
    demand: 'High'
  },
  {
    title: 'Product Manager',
    company: 'InnovateLabs',
    location: 'Boston, MA',
    salary: '$130K - $170K',
    growth: '+15%',
    remote: true,
    skills: ['Strategy', 'Analytics', 'Agile', 'Leadership'],
    demand: 'High'
  }
];

const skillDemands = [
  { skill: 'Python', demand: 95, growth: '+12%', jobs: '45K+' },
  { skill: 'JavaScript', demand: 92, growth: '+8%', jobs: '38K+' },
  { skill: 'React', demand: 88, growth: '+15%', jobs: '32K+' },
  { skill: 'Node.js', demand: 85, growth: '+10%', jobs: '28K+' },
  { skill: 'AWS', demand: 82, growth: '+18%', jobs: '25K+' },
  { skill: 'Machine Learning', demand: 78, growth: '+25%', jobs: '22K+' },
  { skill: 'Docker', demand: 75, growth: '+14%', jobs: '20K+' },
  { skill: 'TypeScript', demand: 72, growth: '+20%', jobs: '18K+' }
];

const salaryRanges = [
  { role: 'Software Engineer', min: 80, max: 150, avg: 115 },
  { role: 'Data Scientist', min: 90, max: 160, avg: 125 },
  { role: 'Product Manager', min: 100, max: 170, avg: 135 },
  { role: 'DevOps Engineer', min: 85, max: 150, avg: 120 },
  { role: 'AI/ML Engineer', min: 120, max: 200, avg: 160 },
  { role: 'Frontend Developer', min: 70, max: 130, avg: 100 },
  { role: 'Backend Developer', min: 80, max: 140, avg: 110 }
];

const locationInsights = [
  { city: 'San Francisco', avgSalary: 165, jobCount: '12K+', costIndex: 1.8 },
  { city: 'New York', avgSalary: 155, jobCount: '15K+', costIndex: 1.7 },
  { city: 'Seattle', avgSalary: 145, jobCount: '8K+', costIndex: 1.4 },
  { city: 'Austin', avgSalary: 125, jobCount: '6K+', costIndex: 1.1 },
  { city: 'Boston', avgSalary: 140, jobCount: '5K+', costIndex: 1.5 },
  { city: 'Remote', avgSalary: 120, jobCount: '20K+', costIndex: 1.0 }
];

export function JobInsightsComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const filteredJobs = trendingJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || job.title.toLowerCase().includes(selectedRole.toLowerCase());
    const matchesLocation = selectedLocation === 'all' || job.location.toLowerCase().includes(selectedLocation.toLowerCase());
    
    return matchesSearch && matchesRole && matchesLocation;
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="trending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trending">Trending Jobs</TabsTrigger>
          <TabsTrigger value="skills">Skill Demand</TabsTrigger>
          <TabsTrigger value="salaries">Salary Insights</TabsTrigger>
          <TabsTrigger value="locations">Location Data</TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search & Filter Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search jobs or companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="engineer">Engineer</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="scientist">Data Scientist</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="san francisco">San Francisco</SelectItem>
                    <SelectItem value="new york">New York</SelectItem>
                    <SelectItem value="austin">Austin</SelectItem>
                    <SelectItem value="seattle">Seattle</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Trending Jobs List */}
          <div className="grid gap-4">
            {filteredJobs.map((job, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Building className="h-4 w-4" />
                        {job.company}
                        <MapPin className="h-4 w-4 ml-2" />
                        {job.location}
                        {job.remote && (
                          <Badge variant="secondary" className="ml-2">Remote</Badge>
                        )}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{job.salary}</div>
                      <div className="flex items-center gap-1 text-sm text-green-500">
                        <TrendingUp className="h-4 w-4" />
                        {job.growth} growth
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => (
                          <Badge key={skill} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">Demand: {job.demand}</span>
                      </div>
                      <Button className="gap-2">
                        View Details
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Most In-Demand Skills</CardTitle>
              <CardDescription>
                Skills ranked by demand, growth rate, and job availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillDemands.map((skill, index) => (
                  <div key={skill.skill} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-muted-foreground">
                        #{index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold">{skill.skill}</h3>
                        <p className="text-sm text-muted-foreground">{skill.jobs} jobs available</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-lg font-bold">{skill.demand}%</div>
                        <Badge variant="secondary" className="text-green-600">
                          {skill.growth}
                        </Badge>
                      </div>
                      <div className="w-32 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${skill.demand}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salaries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Salary Ranges by Role</CardTitle>
              <CardDescription>
                Current market salary data across different tech roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {salaryRanges.map((salary) => (
                  <div key={salary.role} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{salary.role}</h3>
                      <div className="text-right">
                        <div className="font-bold">${salary.avg}K avg</div>
                        <div className="text-sm text-muted-foreground">
                          ${salary.min}K - ${salary.max}K
                        </div>
                      </div>
                    </div>
                    <div className="relative h-4 bg-gray-200 rounded-full">
                      <div 
                        className="absolute h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                        style={{ width: `${(salary.avg / 200) * 100}%` }}
                      />
                      <div 
                        className="absolute h-4 w-1 bg-white rounded-full"
                        style={{ left: `${(salary.avg / 200) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tech Job Markets by Location</CardTitle>
              <CardDescription>
                Compare job opportunities, salaries, and cost of living
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {locationInsights.map((location) => (
                  <Card key={location.city} className="border">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {location.city}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {location.jobCount} active positions
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            ${location.avgSalary}K
                          </div>
                          <p className="text-sm text-muted-foreground">Average salary</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="text-sm">
                          Cost Index: <span className="font-semibold">{location.costIndex}x</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Explore Jobs
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}