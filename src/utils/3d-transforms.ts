/**
 * CSS 3D Transform utilities for card tilt effects
 */

export interface TiltOptions {
  max?: number; // Maximum tilt angle in degrees
  perspective?: number; // Perspective distance
  scale?: number; // Scale on hover
  speed?: number; // Transition speed
  glare?: boolean; // Add glare effect
}

/**
 * Initialize 3D tilt effect on an element
 */
export function initTilt(element: HTMLElement, options: TiltOptions = {}) {
  const {
    max = 8,
    perspective = 1000,
    scale = 1.02,
    speed = 400,
    glare = false,
  } = options;

  // Check for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Set perspective on parent
  element.style.transformStyle = 'preserve-3d';
  element.style.perspective = `${perspective}px`;

  let glareElement: HTMLElement | null = null;

  if (glare) {
    glareElement = document.createElement('div');
    glareElement.className = 'tilt-glare';
    glareElement.style.cssText = `
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%);
      opacity: 0;
      pointer-events: none;
      transition: opacity ${speed}ms cubic-bezier(0.22, 1, 0.36, 1);
      border-radius: inherit;
      mix-blend-mode: overlay;
    `;
    element.style.position = 'relative';
    element.appendChild(glareElement);
  }

  let rafId: number | null = null;
  
  const handleMouseMove = (e: MouseEvent) => {
    if (rafId) return; // Skip if already scheduled
    
    rafId = requestAnimationFrame(() => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -max;
      const rotateY = ((x - centerX) / centerX) * max;

      element.style.transform = `
        perspective(${perspective}px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(${scale}, ${scale}, ${scale})
      `;

      if (glareElement) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glareElement.style.background = `
          radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.2) 0%, transparent 50%)
        `;
        glareElement.style.opacity = '1';
      }
      
      rafId = null;
    });
  };

  const handleMouseLeave = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    if (glareElement) {
      glareElement.style.opacity = '0';
    }
  };

  element.style.transition = `transform ${speed}ms cubic-bezier(0.22, 1, 0.36, 1)`;

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  // Return cleanup function
  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
    if (glareElement && element.contains(glareElement)) {
      element.removeChild(glareElement);
    }
  };
}

/**
 * Initialize tilt on all elements with data-tilt attribute
 */
export function initAllTilts() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Only on desktop/tablet
  if (window.innerWidth < 768) {
    return;
  }

  const tiltElements = document.querySelectorAll('[data-tilt]');
  const cleanups: (() => void)[] = [];

  tiltElements.forEach((element) => {
    const options: TiltOptions = {
      max: parseFloat(element.getAttribute('data-tilt-max') || '8'),
      perspective: parseFloat(element.getAttribute('data-tilt-perspective') || '1000'),
      scale: parseFloat(element.getAttribute('data-tilt-scale') || '1.02'),
      glare: element.hasAttribute('data-tilt-glare'),
    };

    const cleanup = initTilt(element as HTMLElement, options);
    if (cleanup) {
      cleanups.push(cleanup);
    }
  });

  // Return master cleanup
  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}

