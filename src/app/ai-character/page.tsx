import AICharacter from '@/components/ai/ai-character';

export const metadata = {
  title: 'AI Character',
};

export default function Page() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI Character & Student Observation</h1>
      <AICharacter />
    </main>
  );
}
