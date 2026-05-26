const DESKTOP_MQ = '(min-width: 768px)';

const springDefaults = { stiffness: 100, damping: 30, mass: 2 };
const captionSpring = { stiffness: 350, damping: 30, mass: 1 };

export interface TiltedCardOptions {
  rotateAmplitude?: number;
  scaleOnHover?: number;
  showTooltip?: boolean;
}

export interface TiltedCardHandle {
  dispose: () => void;
}

class Spring {
  value: number;
  target = 0;
  velocity = 0;

  constructor(
    initial: number,
    private stiffness: number,
    private damping: number,
    private mass: number
  ) {
    this.value = initial;
    this.target = initial;
  }

  set(next: number) {
    this.target = next;
  }

  step(dt: number) {
    const force = -this.stiffness * (this.value - this.target) - this.damping * this.velocity;
    this.velocity += (force / this.mass) * dt;
    this.value += this.velocity * dt;
  }

  isSettled(epsilon = 0.001) {
    return Math.abs(this.value - this.target) < epsilon && Math.abs(this.velocity) < epsilon;
  }
}

function parseFloatAttr(value: string | undefined, fallback: number): number {
  if (value === undefined || value === '') return fallback;
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
}

export function createTiltedCard(
  figure: HTMLElement,
  options: TiltedCardOptions = {}
): TiltedCardHandle | null {
  const inner = figure.querySelector<HTMLElement>('[data-tilted-inner]');
  const caption = figure.querySelector<HTMLElement>('[data-tilted-caption]');
  if (!inner) return null;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = window.matchMedia(DESKTOP_MQ).matches;
  if (reduced || !desktop) return null;

  const rotateAmplitude = options.rotateAmplitude ?? parseFloatAttr(figure.dataset.rotateAmplitude, 6);
  const scaleOnHover = options.scaleOnHover ?? parseFloatAttr(figure.dataset.scaleOnHover, 1.03);
  const showTooltip = options.showTooltip ?? figure.dataset.showTooltip !== 'false';

  const rotateX = new Spring(0, springDefaults.stiffness, springDefaults.damping, springDefaults.mass);
  const rotateY = new Spring(0, springDefaults.stiffness, springDefaults.damping, springDefaults.mass);
  const scale = new Spring(1, springDefaults.stiffness, springDefaults.damping, springDefaults.mass);
  const captionOpacity = new Spring(0, captionSpring.stiffness, captionSpring.damping, captionSpring.mass);
  const captionRotate = new Spring(0, captionSpring.stiffness, captionSpring.damping, captionSpring.mass);

  let lastOffsetY = 0;
  let captionX = 0;
  let captionY = 0;
  let hovering = false;
  let rafId = 0;
  let lastTime = 0;

  const apply = () => {
    inner.style.transform = `rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg) scale(${scale.value})`;

    if (caption && showTooltip) {
      caption.style.opacity = String(captionOpacity.value);
      caption.style.transform = `translate(${captionX}px, ${captionY}px) rotate(${captionRotate.value}deg)`;
    }
  };

  const tick = (time: number) => {
    rafId = 0;
    const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.064) : 0.016;
    lastTime = time;

    rotateX.step(dt);
    rotateY.step(dt);
    scale.step(dt);
    captionOpacity.step(dt);
    captionRotate.step(dt);

    apply();

    const moving =
      hovering ||
      !rotateX.isSettled() ||
      !rotateY.isSettled() ||
      !scale.isSettled() ||
      !captionOpacity.isSettled() ||
      !captionRotate.isSettled();

    if (moving) {
      rafId = requestAnimationFrame(tick);
    }
  };

  const scheduleTick = () => {
    if (!rafId) rafId = requestAnimationFrame(tick);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const rect = figure.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);

    captionX = e.clientX - rect.left;
    captionY = e.clientY - rect.top;

    const velocityY = offsetY - lastOffsetY;
    captionRotate.set(-velocityY * 0.6);
    lastOffsetY = offsetY;

    scheduleTick();
  };

  const handleMouseEnter = () => {
    hovering = true;
    scale.set(scaleOnHover);
    captionOpacity.set(1);
    scheduleTick();
  };

  const handleMouseLeave = () => {
    hovering = false;
    lastOffsetY = 0;
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    captionOpacity.set(0);
    captionRotate.set(0);
    scheduleTick();
  };

  figure.addEventListener('mouseenter', handleMouseEnter);
  figure.addEventListener('mousemove', handleMouseMove);
  figure.addEventListener('mouseleave', handleMouseLeave);

  return {
    dispose: () => {
      if (rafId) cancelAnimationFrame(rafId);
      figure.removeEventListener('mouseenter', handleMouseEnter);
      figure.removeEventListener('mousemove', handleMouseMove);
      figure.removeEventListener('mouseleave', handleMouseLeave);
      inner.style.removeProperty('transform');
      if (caption) {
        caption.style.removeProperty('opacity');
        caption.style.removeProperty('transform');
      }
    },
  };
}

const activeHandles = new WeakMap<HTMLElement, TiltedCardHandle>();

export function initAllTiltedCards(): void {
  document.querySelectorAll<HTMLElement>('[data-tilted-card]').forEach((figure) => {
    activeHandles.get(figure)?.dispose();

    const handle = createTiltedCard(figure);
    if (!handle) {
      activeHandles.delete(figure);
      return;
    }

    activeHandles.set(figure, handle);
  });
}
