'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@feedbase/ui/components/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@feedbase/ui/components/chart';
import { cn } from '@feedbase/ui/lib/utils';
import { Bar, LabelList, BarChart as ReBarChart, XAxis, YAxis } from 'recharts';

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--accent))',
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--secondary))',
  },
  label: {
    color: 'hsl(var(--foreground))',
  },
} satisfies ChartConfig;

export function BarChart() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomCursor = (props: any) => {
    const { x, y, width, height, points, className } = props;

    const indicatorWidth = 2;

    return (
      <svg>
        <defs>
          <linearGradient id='backgroundGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' style={{ stopColor: 'var(--color-desktop)', stopOpacity: 0.5 }} />
            <stop offset='50%' style={{ stopColor: 'var(--color-desktop)', stopOpacity: 0.4 }} />
            <stop offset='95%' style={{ stopColor: 'var(--color-desktop)', stopOpacity: 0 }} />
          </linearGradient>

          <filter id='darkenLeftLine'>
            <feComponentTransfer>
              <feFuncR type='linear' slope='0.67' />
              <feFuncG type='linear' slope='0.67' />
              <feFuncB type='linear' slope='0.67' />
            </feComponentTransfer>
          </filter>
        </defs>

        <g>
          {/* 2px width indicator */}
          <path
            x={x}
            y={y}
            d={`M ${x},${y} h ${indicatorWidth} v ${height} h -${indicatorWidth} Z`}
            fill='var(--color-desktop)'
            filter='url(#darkenLeftLine)'
            pointerEvents='none'
          />

          {/* Main path with gradient */}
          <path
            x={x + indicatorWidth}
            y={y}
            d={`M ${x + indicatorWidth},${y} h ${width - indicatorWidth} v ${height} h -${
              width - indicatorWidth
            } Z`}
            fill='url(#backgroundGradient)'
            className={cn('cursor-pointer', className)}
            // onClick={() => console.log('clicked')}
            pointerEvents='auto'
            width={width - indicatorWidth}
            height={height}
            points={points}
            type='linear'
          />
        </g>
      </svg>
    );
  };

  return (
    <Card className='h-fit w-full'>
      <CardHeader className='p-4 pb-2'>
        <CardTitle>Bar Chart - Custom Label</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className='-ml-[1px] px-0 pb-4 pt-0'>
        <ChartContainer config={chartConfig} className='!h-[230px] w-full overflow-x-visible'>
          <ReBarChart
            accessibilityLayer
            data={chartData}
            layout='vertical'
            margin={{
              right: 16,
            }}>
            <YAxis
              dataKey='month'
              type='category'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey='desktop' type='number' hide padding={{ left: 16 }} />
            <ChartTooltip cursor={<CustomCursor />} content={<div />} />
            <Bar dataKey='desktop' layout='vertical' fill='var(--color-desktop)' radius={4}>
              <LabelList
                dataKey='month'
                position='insideLeft'
                offset={8}
                className='fill-[--color-label]'
                fontSize={12}
              />
              <LabelList
                dataKey='desktop'
                position='right'
                offset={8}
                className='fill-foreground'
                fontSize={12}
              />
            </Bar>
          </ReBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
