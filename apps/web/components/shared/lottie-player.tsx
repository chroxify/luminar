'use client';

import { useEffect, useRef } from 'react';
import { DotLottieCommonPlayer, DotLottiePlayer } from '@dotlottie/react-player';
import { useTheme } from 'next-themes';

interface LottieSrc {
  dark: Record<string, unknown> | string;
  light: Record<string, unknown> | string;
}

// TODO: switch to player-component
// https://docs.lottiefiles.com/dotlottie-players/components/player-component/usage/next
export default function LottiePlayer({
  lottieSrc,
  className,
  animate,
  initialColor,
  animationColor,
}: {
  lottieSrc: LottieSrc;
  className?: string;
  animate?: boolean;
  initialColor?: string;
  animationColor?: string;
}) {
  const lottieRef = useRef<DotLottieCommonPlayer>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (animate) {
      lottieRef.current?.play();
    } else {
      lottieRef.current?.stop();
    }
  }, [animate]);

  // Change initial color of svg on change
  useEffect(() => {
    if (lottieRef.current) {
      // Get svg element
      const lottiePlayerSvg = lottieRef.current?.container?.querySelector('svg');

      //? This is needed because chrome adds a blur filter to the svg
      // Edit transform style but keep other styles
      const transformStyle = lottiePlayerSvg
        ?.getAttribute('style')
        ?.replace('transform: translate3d(0px, 0px, 0px);', '');

      // Apply transform style
      lottiePlayerSvg?.setAttribute('style', transformStyle!);

      // Change color of svg
      if (initialColor) {
        lottiePlayerSvg?.querySelectorAll('path').forEach((path: SVGPathElement) => {
          path.style.fill = initialColor;

          // Incase stroke is used in initial svg
          if (path.getAttributeNames().includes('stroke') && path.getAttribute('stroke-opacity') !== '0') {
            path.style.stroke = initialColor;
          }
        });
      }
    }
  }, [lottieRef, initialColor]);

  return (
    <DotLottiePlayer
      style={{ transform: '' }}
      src={theme === undefined ? lottieSrc.light : theme === 'dark' ? lottieSrc.light : lottieSrc.dark}
      ref={lottieRef}
      onEvent={(event) => {
        if (event === 'ready') {
          // Get svg element
          const lottiePlayerSvg = lottieRef.current?.container?.querySelector('svg');

          //? This is needed because chrome adds a blur filter to the svg
          // Edit transform style but keep other styles
          const transformStyle = lottiePlayerSvg
            ?.getAttribute('style')
            ?.replace('transform: translate3d(0px, 0px, 0px);', '');

          // Apply transform style
          lottiePlayerSvg?.setAttribute('style', transformStyle!);

          // Change color of svg
          if (initialColor) {
            lottiePlayerSvg?.querySelectorAll('path').forEach((path: SVGPathElement) => {
              path.style.fill = initialColor;

              // Incase stroke is used in initial svg
              if (
                path.getAttributeNames().includes('stroke') &&
                path.getAttribute('stroke-opacity') !== '0'
              ) {
                path.style.stroke = initialColor;
              }
            });
          }
        } else if (event === 'play') {
          // Get svg element
          const lottiePlayerSvg = lottieRef.current?.container?.querySelector('svg');

          // Change color of svg
          if (animationColor) {
            lottiePlayerSvg?.querySelectorAll('path').forEach((path: SVGPathElement) => {
              path.style.fill = animationColor;

              // Incase stroke is used in animation
              if (
                path.getAttributeNames().includes('stroke') &&
                path.getAttribute('stroke-opacity') !== '0'
              ) {
                path.style.stroke = animationColor;
              }
            });
          }
        } else if (event === 'stop') {
          // Get svg element
          const lottiePlayerSvg = lottieRef.current?.container?.querySelector('svg');

          // Reset color of svg
          lottiePlayerSvg?.querySelectorAll('path').forEach((path: SVGPathElement) => {
            path.style.fill = initialColor ?? '';

            // Incase stroke is used in initial svg
            if (path.getAttributeNames().includes('stroke') && path.getAttribute('stroke-opacity') !== '0') {
              path.style.stroke = initialColor ?? '';
            }
          });
        }
      }}
      className={className}
    />
  );
}
