import { Header } from '@/components/Header';
import { AiAnalyticsClient } from './AiAnalyticsClient';

export default async function AiAnalyticsPage() {
  return (
    <>
      <Header title="AI Analytics" />
      <div className="flex-1 overflow-y-auto">
        <AiAnalyticsClient />
      </div>
    </>
  );
}
