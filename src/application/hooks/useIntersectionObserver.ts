"use client";

import { useEffect, useState } from "react";

interface UseIntersectionObserverProps {
  ref?: React.RefObject<HTMLElement | null>;
}

export function useIntersectionObserver({ ref }: UseIntersectionObserverProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref?.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "0px" }
    );

    observer.observe(ref.current);

    return () => {
      observer?.disconnect();
    };
  }, [ref]);

  return { isIntersecting };
}
