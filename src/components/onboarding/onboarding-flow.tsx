'use client';
import React from 'react';
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle } from 'lucide-react';
import CareerExplorer from './career-explorer';
import PersonalDetailsForm from './personal-details-form';
import SkillsSelector from './skills-selector';
import { CareerInfo } from '@/lib/career-data';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type OnboardingStep = 'welcome' | 'career' | 'personal' | 'skills' | 'complete';

interface OnboardingData {
  career?: CareerInfo;
  personalDetails?: {
    dateOfBirth: string;
    location: string;
    bio: string;
    experience: string;
  };
  skills?: string[];
}

export default function OnboardingFlow() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    { id: 'welcome', title: 'Welcome', completed: false },
    { id: 'career', title: 'Career Path', completed: false },
    { id: 'personal', title: 'Personal Info', completed: false },
    { id: 'skills', title: 'Skills', completed: false },
    { id: 'complete', title: 'Complete', completed: false },
  ];

  const getCurrentStepIndex = () => steps.findIndex(step => step.id === currentStep);
  const progress = ((getCurrentStepIndex() + 1) / steps.length) * 100;

  const handleCareerSelect = (career: CareerInfo) => {
    setOnboardingData(prev => ({ ...prev, career }));
    setCurrentStep('personal');
  };

  const handlePersonalDetailsSubmit = (personalDetails: any) => {
    setOnboardingData(prev => ({ ...prev, personalDetails }));
    setCurrentStep('skills');
  };

  const handleSkillsSubmit = async (skills: string[]) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const updatedData = { ...onboardingData, skills };
      
      // Update user document in Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        career: updatedData.career?.name || '',
        skills: skills,
        xp: 0,
        level: 0,
        isProfileComplete: true,
        dateOfBirth: updatedData.personalDetails?.dateOfBirth,
        location: updatedData.personalDetails?.location,
        bio: updatedData.personalDetails?.bio,
        experience: updatedData.personalDetails?.experience,
      });

      setCurrentStep('complete');
      
      // Automatically redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error updating user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteOnboarding = () => {
    router.push('/dashboard');
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const isCompleted = index < getCurrentStepIndex();
          const isCurrent = step.id === currentStep;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                isCompleted ? 'bg-green-600 border-green-600 text-white' :
                isCurrent ? 'bg-blue-600 border-blue-600 text-white' :
                'border-gray-300 text-gray-400'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  isCompleted ? 'bg-green-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          );
        })}
      </div>
      <Progress value={progress} className="w-full" />
      <p className="text-sm text-gray-600 mt-2 text-center">
        Step {getCurrentStepIndex() + 1} of {steps.length}: {steps[getCurrentStepIndex()]?.title}
      </p>
    </div>
  );

  const renderWelcomeStep = () => (
    <Card className="max-w-2xl mx-auto text-center">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Image 
            src="/lucas-logo.png" 
            alt="Lucas AI Logo" 
            width={32} 
            height={32} 
            className="w-8 h-8"
          />
          Welcome to Lucas AI!
        </CardTitle>
        <CardDescription className="text-lg">
          Let's set up your personalized learning journey
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-left space-y-4">
          <h3 className="font-semibold text-lg">What we'll do together:</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <Circle className="w-5 h-5 text-blue-600" />
              <span>Explore different tech career paths</span>
            </li>
            <li className="flex items-center gap-3">
              <Circle className="w-5 h-5 text-blue-600" />
              <span>Share some personal details</span>
            </li>
            <li className="flex items-center gap-3">
              <Circle className="w-5 h-5 text-blue-600" />
              <span>Select your current skills</span>
            </li>
            <li className="flex items-center gap-3">
              <Circle className="w-5 h-5 text-blue-600" />
              <span>Get personalized quest recommendations</span>
            </li>
          </ul>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Takes about 5 minutes</strong> - You'll start at Level 0 and unlock amazing quests 
            based on your chosen career path!
          </p>
        </div>
        <Button 
          onClick={() => setCurrentStep('career')} 
          className="w-full"
          size="lg"
        >
          Let's Get Started! 🚀
        </Button>
      </CardContent>
    </Card>
  );

  const renderCompleteStep = () => (
    <Card className="max-w-2xl mx-auto text-center">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2 text-2xl text-green-600">
          <CheckCircle className="w-8 h-8" />
          Setup Complete!
        </CardTitle>
        <CardDescription className="text-lg">
          Redirecting to your personalized dashboard...
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-green-50 p-6 rounded-lg space-y-4">
          <h3 className="font-semibold text-lg text-green-800">What's Next?</h3>
          <div className="text-left space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span><strong>Career Path:</strong> {onboardingData.career?.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span><strong>Skills Selected:</strong> {onboardingData.skills?.length || 0} skills</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span><strong>Starting Level:</strong> Level 0 (Ready to learn!)</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-semibold">Your dashboard includes:</h4>
          <ul className="text-left space-y-2 text-sm">
            <li>• Personalized quests based on your career path</li>
            <li>• Skill progression tracking</li>
            <li>• Learning roadmap for {onboardingData.career?.name}</li>
            <li>• Resource library with curated content</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Redirecting automatically in 2 seconds...</strong>
          </p>
        </div>

        <Button 
          onClick={handleCompleteOnboarding} 
          className="w-full"
          size="lg"
        >
          Enter Dashboard Now 🎯
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {renderStepIndicator()}

        {currentStep === 'welcome' && renderWelcomeStep()}
        
        {currentStep === 'career' && (
          <CareerExplorer
            onCareerSelect={handleCareerSelect}
            selectedCareer={onboardingData.career}
          />
        )}

        {currentStep === 'personal' && (
          <PersonalDetailsForm
            onSubmit={handlePersonalDetailsSubmit}
            onBack={() => setCurrentStep('career')}
            isLoading={isLoading}
          />
        )}

        {currentStep === 'skills' && (
          <SkillsSelector
            onSubmit={handleSkillsSubmit}
            onBack={() => setCurrentStep('personal')}
            isLoading={isLoading}
            selectedCareer={onboardingData.career?.name}
          />
        )}

        {currentStep === 'complete' && renderCompleteStep()}
      </div>
    </div>
  );
}