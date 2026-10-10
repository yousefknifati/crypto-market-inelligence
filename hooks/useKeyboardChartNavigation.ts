import {
  useCallback,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

export function useKeyboardChartNavigation(pointCount: number) {
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);

  const handleChartBlur = useCallback(() => setActivePointIndex(null), []);
  const handleChartFocus = useCallback(
    () => setActivePointIndex(Math.max(0, pointCount - 1)),
    [pointCount],
  );
  const handleChartKeyDown = useCallback(
    (event: ReactKeyboardEvent<SVGSVGElement>) => {
      const lastIndex = Math.max(0, pointCount - 1);

      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const direction = event.key === "ArrowLeft" ? -1 : 1;
        setActivePointIndex((currentIndex) =>
          Math.min(
            lastIndex,
            Math.max(0, (currentIndex ?? lastIndex) + direction),
          ),
        );
      } else if (event.key === "Home") {
        event.preventDefault();
        setActivePointIndex(0);
      } else if (event.key === "End") {
        event.preventDefault();
        setActivePointIndex(lastIndex);
      }
    },
    [pointCount],
  );

  return {
    activePointIndex,
    handleChartBlur,
    handleChartFocus,
    handleChartKeyDown,
    setActivePointIndex,
  };
}
