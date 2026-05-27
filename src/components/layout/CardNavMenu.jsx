import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { GoArrowUpRight } from 'react-icons/go';
import './CardNav.css';

const CardNavMenu = ({
  logo,
  items,
  className = '',
  ease = 'power3.out',
  baseColor = '#fff',
  menuColor,
  buttonBgColor,
  buttonTextColor,
  ctaLabel = 'Get Started',
  ctaHref = '#',
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef(null);
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const contentEl = navEl.querySelector('.card-nav-content');
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = 'visible';
        contentEl.style.pointerEvents = 'auto';
        contentEl.style.position = 'static';
        contentEl.style.height = 'auto';

        contentEl.offsetHeight;

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: prefersReducedMotion ? 0 : 50, opacity: prefersReducedMotion ? 1 : 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: prefersReducedMotion ? 0 : 0.4,
      ease,
    });

    tl.to(
      cardsRef.current,
      {
        y: 0,
        opacity: 1,
        duration: prefersReducedMotion ? 0 : 0.4,
        ease,
        stagger: prefersReducedMotion ? 0 : 0.08,
      },
      '-=0.1',
    );

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  const closeMenu = (onComplete) => {
    const tl = tlRef.current;
    if (!tl || !isExpanded) {
      onComplete?.();
      return;
    }

    setIsHamburgerOpen(false);
    tl.eventCallback('onReverseComplete', () => {
      setIsExpanded(false);
      onComplete?.();
    });
    tl.reverse();
  };

  useEffect(() => {
    if (!isExpanded) return;

    const handlePointerDown = (event) => {
      if (containerRef.current?.contains(event.target)) return;
      closeMenu();
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeMenu();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const scrollToHash = (href) => {
    const hash = href.includes('#') ? href.slice(href.indexOf('#')) : '';
    if (!hash) return;

    const target = document.querySelector(hash);
    if (!target) return;

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNavLinkClick = (event, href) => {
    if (!isExpanded) return;

    const hashIndex = href.indexOf('#');
    if (hashIndex === -1) return;

    const hash = href.slice(hashIndex);
    const isHashLink = href.startsWith('#') || href.startsWith('/#');
    if (!isHashLink) return;

    const onHomePage = window.location.pathname === '/' || window.location.pathname === '';

    if (!onHomePage) {
      closeMenu();
      return;
    }

    const target = document.querySelector(hash);
    if (!target) {
      closeMenu();
      return;
    }

    event.preventDefault();
    closeMenu(() => scrollToHash(href));
  };

  const handleToggleMenu = () => {
    toggleMenu();
  };

  const setCardRef = (i) => (el) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div ref={containerRef} className={`card-nav-container ${className}`}>
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? 'open' : ''}`}
        style={{ backgroundColor: baseColor }}
        aria-label="Main navigation"
      >
        <div className="card-nav-top">
          <button
            type="button"
            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}
            onClick={handleToggleMenu}
            aria-label={isExpanded ? 'Close menu' : 'Open menu'}
            aria-expanded={isExpanded}
            aria-controls="card-nav-menu"
            style={{ color: menuColor || '#000' }}
          >
            <div className="hamburger-line" />
            <div className="hamburger-line" />
          </button>

          {logo}

          <a
            href={ctaHref}
            className="card-nav-cta-button"
            style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
          >
            {ctaLabel}
          </a>
        </div>

        <div
          id="card-nav-menu"
          className="card-nav-content"
          aria-hidden={!isExpanded}
          inert={!isExpanded ? '' : undefined}
        >
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label">{item.label}</div>
              <div className="nav-card-links">
                {item.links?.map((lnk, i) => (
                  <a
                    key={`${lnk.label}-${i}`}
                    className="nav-card-link"
                    href={lnk.href}
                    aria-label={lnk.ariaLabel}
                    target={lnk.external ? '_blank' : undefined}
                    rel={lnk.external ? 'noopener noreferrer' : undefined}
                    onClick={(event) => handleNavLinkClick(event, lnk.href)}
                  >
                    <GoArrowUpRight className="nav-card-link-icon" aria-hidden="true" />
                    {lnk.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNavMenu;
