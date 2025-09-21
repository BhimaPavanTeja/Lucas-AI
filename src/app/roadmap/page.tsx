'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { Header } from '@/components/layout/header';
import CareerRoadmapView from '@/components/roadmap/career-roadmap-view';

export default function RoadmapPage() {
  return (
    <ProtectedRoute requireProfileComplete={true}>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">
          <CareerRoadmapView />
        </main>
      </div>
    </ProtectedRoute>
  );
}