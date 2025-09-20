import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar, MapPin, User, FileText } from 'lucide-react';

const personalDetailsSchema = z.object({
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  bio: z.string().min(10, 'Bio must be at least 10 characters').max(500, 'Bio must not exceed 500 characters'),
  experience: z.enum(['beginner', 'intermediate', 'advanced'], {
    required_error: 'Please select your experience level',
  }),
});

type PersonalDetailsFormData = z.infer<typeof personalDetailsSchema>;

interface PersonalDetailsFormProps {
  onSubmit: (data: PersonalDetailsFormData) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

export default function PersonalDetailsForm({ onSubmit, onBack, isLoading = false }: PersonalDetailsFormProps) {
  const form = useForm<PersonalDetailsFormData>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      dateOfBirth: '',
      location: '',
      bio: '',
      experience: undefined,
    },
  });

  const handleSubmit = (data: PersonalDetailsFormData) => {
    onSubmit(data);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <User className="w-6 h-6" />
          Personal Details
        </CardTitle>
        <CardDescription>
          Tell us a bit about yourself to personalize your learning experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date of Birth
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      placeholder="Select your date of birth"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., San Francisco, CA or Remote"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Beginner</span>
                          <span className="text-sm text-gray-500">New to programming and tech</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="intermediate">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Intermediate</span>
                          <span className="text-sm text-gray-500">Some experience with coding projects</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="advanced">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Advanced</span>
                          <span className="text-sm text-gray-500">Experienced developer looking to specialize</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Bio
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your background, interests, and what motivates you to learn tech..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <div className="text-sm text-gray-500 mt-1">
                    {field.value?.length || 0}/500 characters
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-4">
              {onBack && (
                <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                  Back
                </Button>
              )}
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Continue'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}