import { FilterCombobox } from '../../feedback/common/filter-combobox';
import SortFeedbackDropdown from '../sort-dropdown';

export default function RoadmapHeader() {
  return (
    <div className='flex h-[52px] w-full flex-row items-center justify-between px-5 pt-5'>
      <h2 className='text-2xl font-medium'>Roadmap</h2>

      <div className='flex items-center gap-2'>
        {/* Sort Button */}
        <SortFeedbackDropdown />

        {/* Filter Combobox */}
        <FilterCombobox />
      </div>
    </div>
  );
}
