import { CSSProperties, FocusEvent, PointerEvent, useEffect, useRef, useState } from 'react';
import { cn } from '@feedbase/ui/lib/utils';
import { LucideIcon } from 'lucide-react';

type Props = {
  selectedTab: string;
  tabs: {
    label: string;
    icon?: LucideIcon;
  }[];
  setSelectedTab: (tab: string) => void;
  className?: string;
};

export default function AnimatedTabs({ tabs, selectedTab, setSelectedTab, className }: Props): JSX.Element {
  // Nav Ref
  const navRef = useRef<HTMLDivElement>(null);
  const navRect = navRef.current?.getBoundingClientRect();

  const [buttonRefs, setButtonRefs] = useState<Array<HTMLButtonElement | null>>([]);
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(
    tabs.findIndex((tab) => tab.label === selectedTab)
  );

  useEffect(() => {
    setButtonRefs((prev) => prev.slice(0, tabs.length));
  }, [tabs.length]);

  const [hoveredTabIndex, setHoveredTabIndex] = useState<number | null>(null);
  const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);

  const selectedRect = buttonRefs[selectedTabIndex]?.getBoundingClientRect();

  const [isInitialHoveredElement, setIsInitialHoveredElement] = useState(true);
  const isInitialRender = useRef(true);

  const onLeaveTabs = () => {
    setIsInitialHoveredElement(true);
    setHoveredTabIndex(null);
  };

  const onEnterTab = (e: PointerEvent<HTMLButtonElement> | FocusEvent<HTMLButtonElement>, i: number) => {
    if (!e.target || !(e.target instanceof HTMLButtonElement)) return;

    setHoveredTabIndex((prev) => {
      if (prev !== null && prev !== i) {
        setIsInitialHoveredElement(false);
      }

      return i;
    });
    setHoveredRect(e.target.getBoundingClientRect());
  };

  // Hover Styles
  const hoverStyles: CSSProperties = { opacity: 0 };
  if (navRect && hoveredRect) {
    hoverStyles.transform = `translate3d(${hoveredRect.left - navRect.left}px,${
      hoveredRect.top - navRect.top
    }px,0px)`;
    hoverStyles.width = hoveredRect.width;
    hoverStyles.height = hoveredRect.height;
    hoverStyles.opacity = hoveredTabIndex !== null ? 1 : 0;
    hoverStyles.transition = isInitialHoveredElement
      ? `opacity 150ms`
      : `transform 150ms 0ms, opacity 150ms 0ms, width 150ms`;
  }

  // Select Styles
  const selectStyles: CSSProperties = { opacity: 0 };
  if (navRect && selectedRect) {
    selectStyles.width = selectedRect.width * 0.85;
    selectStyles.transform = `translateX(calc(${selectedRect.left - navRect.left}px + 10%))`;
    selectStyles.opacity = 1;
    selectStyles.transition = isInitialRender.current
      ? `opacity 150ms 150ms`
      : `transform 150ms 0ms, opacity 150ms 150ms, width 150ms`;

    isInitialRender.current = false;
  }

  return (
    <nav
      ref={navRef}
      className={cn(
        'relative z-10 -mb-[1px] flex w-full flex-shrink-0 flex-row items-center justify-start gap-2.5 px-3 py-2 pt-4',
        className
      )}
      onPointerLeave={onLeaveTabs}>
      {tabs.map((item, i) => {
        return (
          <button
            type='button'
            key={item.label}
            className={cn(
              'text-md text-muted-foreground relative z-20 flex h-8 cursor-pointer select-none items-center gap-1.5 rounded-md bg-transparent px-3 text-sm font-medium  transition-colors',
              { 'text-foreground': hoveredTabIndex === i || selectedTabIndex === i }
            )}
            ref={(el) => (buttonRefs[i] = el)}
            onPointerEnter={(e) => {
              onEnterTab(e, i);
            }}
            onFocus={(e) => {
              onEnterTab(e, i);
            }}
            onClick={() => {
              setSelectedTabIndex(i);
              setSelectedTab(item.label);
            }}>
            {item.icon ? <item.icon className='h-4 w-4' /> : null}
            {item.label}
          </button>
        );
      })}

      {/* Hover Indicator */}
      {/* <div
        className='bg-secondary absolute left-0 top-0 z-10 rounded-md transition-[width]'
        style={hoverStyles}
      /> */}
      <div className='bg-primary absolute bottom-0 left-0 z-10 h-0.5 rounded-full' style={selectStyles} />
    </nav>
  );
}
