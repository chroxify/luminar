import FeedbackHeader from '@/components/feedback/dashboard/feedback-header';
import FeedbackList from '@/components/feedback/dashboard/feedback-list';

export default async function Feedback() {
  return (
    <div className='flex h-full w-full flex-col'>
      {/* Header */}
      <FeedbackHeader />

      {/* Feedback List */}
      <FeedbackList />
    </div>
  );
}
