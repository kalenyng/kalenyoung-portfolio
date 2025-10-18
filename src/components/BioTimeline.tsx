import { useState, useEffect } from 'react';
import { animate } from 'motion';
import { bioPeriods } from '@/data/bioPeriods';

export default function BioTimeline() {
  const [activePeriodId, setActivePeriodId] = useState(bioPeriods[0].id);

  const handlePeriodChange = (id: string) => {
    if (id === activePeriodId) return;

    const bioContent = document.getElementById('bio-dynamic-content');
    if (!bioContent) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setActivePeriodId(id);
    } else {
      // Fade out with slide
      animate(
        bioContent,
        { 
          opacity: 0, 
          transform: 'translateX(-20px)',
          filter: 'blur(4px)'
        },
        { duration: 0.25, easing: [0.22, 1, 0.36, 1] }
      ).finished.then(() => {
        setActivePeriodId(id);
        // Fade in with slide from opposite direction
        animate(
          bioContent,
          { 
            opacity: [0, 1], 
            transform: ['translateX(20px)', 'translateX(0)'],
            filter: ['blur(4px)', 'blur(0px)']
          },
          { duration: 0.4, easing: [0.22, 1, 0.36, 1] }
        );
      });
    }
  };

  const activePeriod = bioPeriods.find((p) => p.id === activePeriodId) || bioPeriods[0];

  // Mount dynamic content in the wrapper
  useEffect(() => {
    const wrapper = document.getElementById('bio-dynamic-wrapper');
    const content = document.getElementById('bio-dynamic-content');
    
    if (wrapper && content && !wrapper.contains(content)) {
      wrapper.appendChild(content);
    }
  }, []);

  return (
    <>
      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute top-0 bottom-0 w-0.5"
          style={{ backgroundColor: 'var(--border)', left: '16px' }}
        />

        {/* Timeline items */}
        <div className="space-y-8">
          {bioPeriods.map((period, index) => (
            <div
              key={period.id}
              className="relative pl-12"
            >
              {/* Interactive dot - centered on line and vertically in card */}
              <button
                onClick={() => handlePeriodChange(period.id)}
                className={`absolute z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2 ${
                  activePeriodId === period.id
                    ? 'scale-125 shadow-lg'
                    : 'hover:scale-110'
                }`}
                style={{
                  backgroundColor:
                    activePeriodId === period.id ? 'var(--ember)' : 'var(--bg-elevated)',
                  border:
                    activePeriodId === period.id ? 'none' : '2px solid var(--border)',
                  left: '16px',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                aria-label={`View ${period.title} details`}
                aria-pressed={activePeriodId === period.id}
              >
                {activePeriodId === period.id && (
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: 'white' }}
                  />
                )}
              </button>

              {/* Content card */}
              <button
                onClick={() => handlePeriodChange(period.id)}
                className={`w-full text-left transition-all duration-300 ${
                  activePeriodId === period.id ? 'opacity-100' : 'opacity-60 hover:opacity-80'
                }`}
              >
                <div
                  className={`card space-y-2 transition-all duration-300 ${
                    activePeriodId === period.id ? 'border-ember' : ''
                  }`}
                  style={{
                    borderColor:
                      activePeriodId === period.id ? 'var(--accent)' : undefined,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-bold"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        color: activePeriodId === period.id ? 'var(--ember)' : 'var(--text-muted)',
                      }}
                    >
                      {period.year}
                    </span>
                  </div>
                  <h3
                    className="font-heading text-xl font-bold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {period.title}
                  </h3>
                  {period.highlights && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {period.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="text-xs"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic bio content - will be portaled to right column */}
      {/* Seamlessly blends with static intro - no card styling */}
      <div
        id="bio-dynamic-content"
        className="space-y-6"
      >
        {activePeriod.description.map((paragraph, index) => (
          <p
            key={`${activePeriod.id}-${index}`}
            className="text-lg leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {paragraph}
          </p>
        ))}
        
        {activePeriod.highlights && (
          <div className="flex flex-wrap gap-2 pt-2">
            {activePeriod.highlights.map((highlight) => (
              <span
                key={highlight}
                className="rounded-lg px-3 py-1.5 text-xs font-medium opacity-60"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                {highlight}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

