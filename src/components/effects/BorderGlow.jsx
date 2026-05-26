import { useRef, useCallback, useEffect } from 'react';
import './BorderGlow.css';

const DESKTOP_MQ = '(min-width: 768px)';

class Spring {
  constructor(initial, stiffness, damping, mass) {
    this.value = initial;
    this.target = initial;
    this.velocity = 0;
    this.stiffness = stiffness;
    this.damping = damping;
    this.mass = mass;
  }

  set(next) {
    this.target = next;
  }

  step(dt) {
    const force = -this.stiffness * (this.value - this.target) - this.damping * this.velocity;
    this.velocity += (force / this.mass) * dt;
    this.value += this.velocity * dt;
  }

  isSettled(epsilon = 0.001) {
    return Math.abs(this.value - this.target) < epsilon && Math.abs(this.velocity) < epsilon;
  }
}

const tiltSpringDefaults = { stiffness: 120, damping: 32, mass: 2 };

function parseHSL(hslStr) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildGlowVars(glowColor, intensity) {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10'];
  const vars = {};
  for (let i = 0; i < opacities.length; i++) {
    vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
  }
  return vars;
}

const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
const GRADIENT_KEYS = ['--gradient-one', '--gradient-two', '--gradient-three', '--gradient-four', '--gradient-five', '--gradient-six', '--gradient-seven'];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildGradientVars(colors) {
  const vars = {};
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`;
  }
  vars['--gradient-base'] = `linear-gradient(${colors[0]} 0 100%)`;
  return vars;
}

function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
function easeInCubic(x) { return x * x * x; }

function animateValue({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }) {
  const t0 = performance.now() + delay;
  function tick() {
    const elapsed = performance.now() - t0;
    const t = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(t));
    if (t < 1) requestAnimationFrame(tick);
    else if (onEnd) onEnd();
  }
  setTimeout(() => requestAnimationFrame(tick), delay);
}

const BorderGlow = ({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '40 80 80',
  backgroundColor = '#120F17',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = false,
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
  fillOpacity = 0.5,
  tilt = true,
  rotateAmplitude = 2.5,
  scaleOnHover = 1.008,
}) => {
  const cardRef = useRef(null);
  const tiltEnabledRef = useRef(false);
  const hoveringRef = useRef(false);
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);
  const springsRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const desktop = window.matchMedia(DESKTOP_MQ).matches;
    tiltEnabledRef.current = tilt && !reduced && desktop;

    if (!tiltEnabledRef.current) return;

    springsRef.current = {
      rotateX: new Spring(0, tiltSpringDefaults.stiffness, tiltSpringDefaults.damping, tiltSpringDefaults.mass),
      rotateY: new Spring(0, tiltSpringDefaults.stiffness, tiltSpringDefaults.damping, tiltSpringDefaults.mass),
      scale: new Spring(1, tiltSpringDefaults.stiffness, tiltSpringDefaults.damping, tiltSpringDefaults.mass),
    };
  }, [tilt]);

  const applyTilt = useCallback(() => {
    const card = cardRef.current;
    const springs = springsRef.current;
    if (!card || !springs) return;

    card.style.transform = `translate3d(0, 0, 0.01px) rotateX(${springs.rotateX.value}deg) rotateY(${springs.rotateY.value}deg) scale(${springs.scale.value})`;
  }, []);

  const tickTilt = useCallback((time) => {
    rafRef.current = 0;
    const springs = springsRef.current;
    if (!springs) return;

    const dt = lastTimeRef.current ? Math.min((time - lastTimeRef.current) / 1000, 0.064) : 0.016;
    lastTimeRef.current = time;

    springs.rotateX.step(dt);
    springs.rotateY.step(dt);
    springs.scale.step(dt);
    applyTilt();

    const moving =
      hoveringRef.current ||
      !springs.rotateX.isSettled() ||
      !springs.rotateY.isSettled() ||
      !springs.scale.isSettled();

    if (moving) {
      rafRef.current = requestAnimationFrame(tickTilt);
    }
  }, [applyTilt]);

  const scheduleTilt = useCallback(() => {
    if (!tiltEnabledRef.current || rafRef.current) return;
    rafRef.current = requestAnimationFrame(tickTilt);
  }, [tickTilt]);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const getCenterOfElement = useCallback((el) => {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2];
  }, []);

  const getEdgeProximity = useCallback((el, x, y) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }, [getCenterOfElement]);

  const getCursorAngle = useCallback((el, x, y) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }, [getCenterOfElement]);

  const handlePointerMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const edge = getEdgeProximity(card, x, y);
    const angle = getCursorAngle(card, x, y);

    card.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(3)}`);
    card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);

    const springs = springsRef.current;
    if (tiltEnabledRef.current && springs) {
      const offsetX = x - rect.width / 2;
      const offsetY = y - rect.height / 2;
      springs.rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
      springs.rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);
      scheduleTilt();
    }
  }, [getEdgeProximity, getCursorAngle, rotateAmplitude, scheduleTilt]);

  const handlePointerEnter = useCallback(() => {
    hoveringRef.current = true;
    const springs = springsRef.current;
    if (tiltEnabledRef.current && springs) {
      springs.scale.set(scaleOnHover);
      scheduleTilt();
    }
  }, [scaleOnHover, scheduleTilt]);

  const handlePointerLeave = useCallback(() => {
    hoveringRef.current = false;
    const card = cardRef.current;
    if (card) {
      card.style.setProperty('--edge-proximity', '0');
    }

    const springs = springsRef.current;
    if (tiltEnabledRef.current && springs) {
      springs.rotateX.set(0);
      springs.rotateY.set(0);
      springs.scale.set(1);
      scheduleTilt();
    }
  }, [scheduleTilt]);

  useEffect(() => {
    if (!animated || !cardRef.current) return;
    const card = cardRef.current;
    const angleStart = 110;
    const angleEnd = 465;
    card.classList.add('sweep-active');
    card.style.setProperty('--cursor-angle', `${angleStart}deg`);

    animateValue({ duration: 500, onUpdate: v => card.style.setProperty('--edge-proximity', v) });
    animateValue({ ease: easeInCubic, duration: 1500, end: 50, onUpdate: v => {
      card.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`);
    }});
    animateValue({ ease: easeOutCubic, delay: 1500, duration: 2250, start: 50, end: 100, onUpdate: v => {
      card.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`);
    }});
    animateValue({ ease: easeInCubic, delay: 2500, duration: 1500, start: 100, end: 0,
      onUpdate: v => card.style.setProperty('--edge-proximity', v),
      onEnd: () => card.classList.remove('sweep-active'),
    });
  }, [animated]);

  const glowVars = buildGlowVars(glowColor, glowIntensity);

  return (
    <div className={`border-glow-scene ${className}`}>
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        className="border-glow-card"
        style={{
          '--card-bg': backgroundColor,
          '--edge-sensitivity': edgeSensitivity,
          '--border-radius': `${borderRadius}px`,
          '--glow-padding': `${glowRadius}px`,
          '--cone-spread': coneSpread,
          '--fill-opacity': fillOpacity,
          ...glowVars,
          ...buildGradientVars(colors),
        }}
      >
        <span className="edge-light" />
        <div className="border-glow-inner">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BorderGlow;
