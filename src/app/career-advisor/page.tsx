'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { Header } from '@/components/layout/header';
import CareerAdvisorChat from '../../components/career-advisor/career-advisor-chat';

export default function CareerAdvisorPage() {
  return (
    <ProtectedRoute requireProfileComplete={true}>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">
          <CareerAdvisorChat />
        </main>
      </div>
    </ProtectedRoute>
  );
}