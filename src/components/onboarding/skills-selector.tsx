import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus, Code } from 'lucide-react';

interface SkillsSelectorProps {
  onSubmit: (skills: string[]) => void;
  onBack?: () => void;
  isLoading?: boolean;
  selectedCareer?: string;
}

// Common skills by category
const skillCategories = {
  'Programming Languages': [
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'TypeScript', 'Go', 'Rust', 'Swift', 'Kotlin'
  ],
  'Web Development': [
    'HTML', 'CSS', 'React', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Next.js', 'Tailwind CSS', 'Bootstrap'
  ],
  'Data & Analytics': [
    'SQL', 'MongoDB', 'PostgreSQL', 'Excel', 'Tableau', 'Power BI', 'R', 'Pandas', 'NumPy', 'Matplotlib'
  ],
  'Cloud & DevOps': [
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'Linux', 'Terraform', 'Ansible'
  ],
  'Mobile Development': [
    'React Native', 'Flutter', 'Xamarin', 'iOS Development', 'Android Development', 'Ionic'
  ],
  'Security': [
    'Network Security', 'Ethical Hacking', 'Penetration Testing', 'Cryptography', 'Risk Assessment', 'Compliance'
  ],
  'Design & UI/UX': [
    'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'UI Design', 'UX Research', 'Prototyping', 'Wireframing'
  ],
  'Soft Skills': [
    'Problem Solving', 'Communication', 'Team Collaboration', 'Project Management', 'Critical Thinking', 'Leadership'
  ]
};

export default function SkillsSelector({ onSubmit, onBack, isLoading = false, selectedCareer }: SkillsSelectorProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Programming Languages');

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleAddCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills(prev => [...prev, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill));
  };

  const handleSubmit = () => {
    if (selectedSkills.length > 0) {
      onSubmit(selectedSkills);
    }
  };

  const renderSkillBadge = (skill: string, isSelected: boolean) => (
    <Badge
      key={skill}
      variant={isSelected ? "default" : "outline"}
      className={`cursor-pointer transition-all duration-200 ${
        isSelected ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
      }`}
      onClick={() => handleSkillToggle(skill)}
    >
      {skill}
    </Badge>
  );

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Code className="w-6 h-6" />
          Select Your Skills
        </CardTitle>
        <CardDescription>
          Choose skills you already have or want to learn. This helps us recommend the right quests for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected Skills Summary */}
        {selectedSkills.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <Label className="text-sm font-medium mb-2 block">
              Selected Skills ({selectedSkills.length})
            </Label>
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map(skill => (
                <Badge key={skill} variant="default" className="bg-blue-600 text-white">
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 hover:bg-blue-700 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="border-b">
          <div className="flex flex-wrap gap-2 -mb-px">
            {Object.keys(skillCategories).map(category => (
              <button
                key={category}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeCategory === category
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {skillCategories[activeCategory as keyof typeof skillCategories].map(skill => 
            renderSkillBadge(skill, selectedSkills.includes(skill))
          )}
        </div>

        {/* Custom Skill Input */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <Label className="text-sm font-medium mb-2 block">
            Add Custom Skill
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter a skill not listed above..."
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSkill()}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddCustomSkill}
              disabled={!customSkill.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Career-specific recommendations */}
        {selectedCareer && (
          <div className="bg-green-50 p-4 rounded-lg">
            <Label className="text-sm font-medium mb-2 block text-green-800">
              💡 Recommended for {selectedCareer}
            </Label>
            <p className="text-sm text-green-700">
              Based on your chosen career path, consider adding skills from Programming Languages, 
              Web Development, and Cloud & DevOps categories.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          {onBack && (
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              Back
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            className="flex-1"
            disabled={selectedSkills.length === 0 || isLoading}
          >
            {isLoading ? 'Saving...' : `Continue with ${selectedSkills.length} skill${selectedSkills.length !== 1 ? 's' : ''}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}