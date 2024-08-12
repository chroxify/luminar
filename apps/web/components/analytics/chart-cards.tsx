'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@feedbase/ui/components/card';
import { cn } from '@feedbase/ui/lib/utils';
import { AnalyticsProps } from '@/lib/types';
import BarList from '@/components/analytics/bar-list';
import LineChart from '@/components/analytics/line-chart';

export default function AnalyticsCards({
  analyticsData,
  topFeedbackData,
  topChangelogData,
}: {
  analyticsData: AnalyticsProps;
  topFeedbackData: AnalyticsProps;
  topChangelogData: AnalyticsProps;
}) {
  const [changelogsView, setChangelogsView] = useState<'clicks' | 'visitors'>('clicks');
  const [feedbackView, setFeedbackView] = useState<'clicks' | 'visitors'>('clicks');

  // Convert analyticsData dates to only show dd.mm
  const updatedAnalyticsData = analyticsData.map((d) => {
    const date = new Date(d.key);
    return {
      ...d,
      key: `${date.getDate()}.${date.getMonth() + 1}`,
    };
  });

  return (
    <>
      <div className='flex w-full flex-col gap-10 lg:flex-row'>
        <Card className='w-full p-3 lg:w-1/2'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 p-3'>
            <CardTitle>Unique Visitors</CardTitle>

            <span className='text-foreground/60 text-sm '>
              {updatedAnalyticsData.reduce((a, b) => a + b.visitors, 0)}
            </span>
          </CardHeader>
          <CardContent className='max-h-[250px] p-0'>
            <LineChart
              labels={updatedAnalyticsData.map((d) => d.key)}
              data={updatedAnalyticsData.map((d) => d.visitors)}
              dataLabel='Visitors'
            />
          </CardContent>
        </Card>
        <Card className='w-full p-3 lg:w-1/2'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 p-3'>
            <CardTitle>Page Views</CardTitle>

            <span className='text-foreground/60 text-sm '>
              {updatedAnalyticsData.reduce((a, b) => a + b.clicks, 0)}
            </span>
          </CardHeader>
          <CardContent className='max-h-[250px] p-0'>
            <LineChart
              labels={updatedAnalyticsData.map((d) => d.key)}
              data={updatedAnalyticsData.map((d) => d.clicks)}
              dataLabel='Views'
            />
          </CardContent>
        </Card>
      </div>

      <div className='flex w-full flex-col gap-10 sm:flex-row'>
        <Card className='w-full p-3 sm:w-1/2'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 p-3'>
            <CardTitle>Top Changelogs</CardTitle>

            <button
              className='text-foreground/60 text-sm  hover:cursor-pointer'
              onClick={() => {
                setChangelogsView(changelogsView === 'clicks' ? 'visitors' : 'clicks');
              }}
              type='button'>
              {changelogsView === 'clicks' ? 'Views' : 'Visitors'}
            </button>
          </CardHeader>
          <CardContent
            className={cn(
              'min-h-[250px] p-3',
              !topChangelogData.length && 'flex items-center justify-center'
            )}>
            {!topChangelogData.length ? (
              <p className='text-foreground/60 h-full text-sm '>Not enough data</p>
            ) : (
              <BarList
                data={topChangelogData}
                showData={changelogsView}
                title='Top Changelogs'
                moreData={topChangelogData}
                maxItems={5}
              />
            )}
          </CardContent>
        </Card>

        <Card className='w-full p-3 sm:w-1/2'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 p-3'>
            <CardTitle>Top Feedback</CardTitle>

            <button
              className='text-foreground/60 text-sm  hover:cursor-pointer'
              onClick={() => {
                setFeedbackView(feedbackView === 'clicks' ? 'visitors' : 'clicks');
              }}
              type='button'>
              {feedbackView === 'clicks' ? 'Views' : 'Visitors'}
            </button>
          </CardHeader>
          <CardContent
            className={cn(
              'min-h-[250px] p-3',
              !topFeedbackData.length && 'flex items-center justify-center'
            )}>
            {!topFeedbackData.length ? (
              <p className='text-foreground/60 h-full text-sm '>Not enough data</p>
            ) : (
              <BarList
                data={topFeedbackData}
                showData={feedbackView}
                title='Top Feedback'
                moreData={topFeedbackData}
                maxItems={5}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
