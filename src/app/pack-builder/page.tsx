import { PackBuilderClient } from '@/components/pack-builder-client';
import { Suspense } from 'react';

interface PackBuilderPageProps {
  searchParams: { grade?: string };
}

export default function PackBuilderPage({ searchParams }: PackBuilderPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <PackBuilderClient initialGrade={searchParams.grade} />
    </Suspense>
  );
}
