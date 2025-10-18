import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    // Skip on mobile or if reduced motion
    if (window.innerWidth < 768) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Direct cursor follow - no lag, instant like default
    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    // Check if hovering over clickable element
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.closest('[data-magnetic]') !== null ||
        target.style.cursor === 'pointer' ||
        window.getComputedStyle(target).cursor === 'pointer';

      setIsPointer(isClickable);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Don't render on mobile or if reduced motion
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 768) return null;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  }

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor ${isPointer ? 'pointer' : ''}`}
      aria-hidden="true"
    >
      {/* Orange glow */}
      <div className="cursor-glow" />
      
      {/* Crosshair */}
      <div className={`crosshair ${isPointer ? 'hidden' : ''}`}>
        <div className="crosshair-horizontal" />
        <div className="crosshair-vertical" />
      </div>
      
      {/* Pointer dot */}
      <div className={`pointer-dot ${isPointer ? '' : 'hidden'}`} />
    </div>
  );
}

