import { animate, inView, timeline, stagger } from 'motion';

/**
 * Checks if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Modern easing curve for smooth, cinematic motion
 */
const SPRING_EASE = [0.22, 1, 0.36, 1];

/**
 * Fade in animation with optional slide up
 */
export const fadeIn = (
  element: string | Element,
  options: { delay?: number; duration?: number; y?: number } = {}
) => {
  if (prefersReducedMotion()) return;

  const { delay = 0, duration = 0.6, y = 40 } = options;

  animate(
    element,
    { opacity: [0, 1], transform: [`translateY(${y}px)`, 'translateY(0)'] },
    { delay, duration, easing: SPRING_EASE }
  );
};

/**
 * Staggered fade in for multiple elements
 */
export const staggerFadeIn = (
  elements: string | NodeListOf<Element> | Element[],
  options: { delay?: number; stagger?: number; duration?: number } = {}
) => {
  if (prefersReducedMotion()) return;

  const { delay = 0, stagger: staggerDelay = 0.06, duration = 0.6 } = options;

  animate(
    elements,
    { opacity: [0, 1], transform: ['translateY(30px)', 'translateY(0)'] },
    { delay: stagger(staggerDelay, { start: delay }), duration, easing: SPRING_EASE }
  );
};

/**
 * Reveal sections on scroll
 */
export const revealOnScroll = (selector: string, options: { margin?: string } = {}) => {
  if (prefersReducedMotion()) {
    // Show immediately if motion is reduced
    document.querySelectorAll(selector).forEach((el) => {
      (el as HTMLElement).style.opacity = '1';
    });
    return;
  }

  const { margin = '-80px' } = options;

  inView(
    selector,
    ({ target }) => {
      animate(
        target,
        { opacity: [0, 1], transform: ['translateY(30px)', 'translateY(0)'] },
        { duration: 0.6, easing: SPRING_EASE }
      );
    },
    { margin }
  );
};

/**
 * Parallax scroll effect
 */
export const parallax = (element: Element, speed: number = 0.5) => {
  if (prefersReducedMotion()) return;

  const updateParallax = () => {
    const rect = element.getBoundingClientRect();
    const scrolled = window.scrollY;
    const offset = scrolled * speed;

    // Only apply when element is in viewport
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      (element as HTMLElement).style.transform = `translateY(${offset}px)`;
    }
  };

  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();

  // Return cleanup function
  return () => window.removeEventListener('scroll', updateParallax);
};

/**
 * Subtle scale hover effect (no magnetic pull)
 */
export const subtleHover = (element: Element) => {
  if (prefersReducedMotion()) return;

  element.addEventListener('mouseenter', () => {
    animate(
      element,
      { scale: 1.02 },
      { duration: 0.3, easing: SPRING_EASE }
    );
  });

  element.addEventListener('mouseleave', () => {
    animate(
      element,
      { scale: 1 },
      { duration: 0.3, easing: SPRING_EASE }
    );
  });
};

/**
 * Subtle glow effect on card hover (no shine animation)
 */
export const cardGlow = (card: Element) => {
  if (prefersReducedMotion()) return;

  card.addEventListener('mouseenter', () => {
    animate(
      card,
      { 
        boxShadow: ['0 1px 3px var(--shadow)', '0 12px 32px var(--shadow-lg)'],
      },
      { duration: 0.4, easing: SPRING_EASE }
    );
  });

  card.addEventListener('mouseleave', () => {
    animate(
      card,
      { 
        boxShadow: ['0 12px 32px var(--shadow-lg)', '0 1px 3px var(--shadow)'],
      },
      { duration: 0.4, easing: SPRING_EASE }
    );
  });
};

/**
 * Initialize all animations on page load
 */
export const initAnimations = () => {
  // Reveal sections on scroll (handles reduced motion internally)
  revealOnScroll('.animate-reveal');

  if (prefersReducedMotion()) {
    // Show stagger items immediately
    document.querySelectorAll('[data-stagger-item]').forEach((el) => {
      (el as HTMLElement).style.opacity = '1';
    });
    return;
  }

  // Stagger children within containers
  const staggerContainers = document.querySelectorAll('[data-stagger]');
  staggerContainers.forEach((container) => {
    const children = container.querySelectorAll('[data-stagger-item]');
    if (children.length) {
      // Set initial state
      children.forEach((child) => {
        (child as HTMLElement).style.opacity = '0';
      });
      
      inView(container, () => {
        staggerFadeIn(children, { stagger: 0.06 });
      }, { margin: '-60px' });
    }
  });

  // Subtle hover effects (skip buttons that have CSS hover animations)
  document.querySelectorAll('[data-magnetic]').forEach((element) => {
    // Skip if element has btn class (CSS handles hover)
    if (!element.classList.contains('btn') && 
        !element.classList.contains('btn-primary') && 
        !element.classList.contains('btn-secondary')) {
      subtleHover(element);
    }
  });
};

/**
 * Optional: Lantern cursor glow effect (disabled for cleaner aesthetic)
 */
export const initLanternGlow = () => {
  // Disabled for modern, minimal aesthetic
  return;
};

