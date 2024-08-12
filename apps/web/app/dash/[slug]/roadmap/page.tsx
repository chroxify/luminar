import RoadmapBoard from '@/components/roadmap/dashboard/roadmap-board';
import RoadmapHeader from '@/components/roadmap/dashboard/roadmap-header';

export default async function Roadmap() {
  return (
    <div className='flex h-full w-full flex-col'>
      {/* Header */}
      <RoadmapHeader />

      {/* Board */}
      <RoadmapBoard />
    </div>
  );
}
