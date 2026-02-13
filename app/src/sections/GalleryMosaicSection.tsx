import { useRef, useLayoutEffect } from 'react';
import { Tile } from '@/components/Tile';
import { Rule } from '@/components/Rule';
import { ArrowRight } from 'lucide-react';

const galleryItems = [
  {
    type: 'gif' as const,
    src: '/images/gif_layouts.gif',
    alt: 'Create multiple layouts in one document'
  },
  {
    type: 'image' as const,
    src: '/images/broco_screen.png',
    alt: 'BROCO application interface'
  },
  {
    type: 'gif' as const,
    src: '/images/gif_aspect_ratio.gif',
    alt: 'Change aspect ratio easily'
  },
  {
    type: 'gif' as const,
    src: '/images/gif_import.gif',
    alt: 'Import files fast'
  },
];

export const GalleryMosaicSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const mosaicRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const mosaic = mosaicRef.current;
    const rule = ruleRef.current;
    const tileItems = tilesRef.current.filter(Boolean);

    if (!section || !title || !mosaic || !rule || tileItems.length === 0) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.3,
        }
      });

      // ── ENTRANCE  (0 → 0.3) ──────────────────────────────
      scrollTl
        .fromTo(title,
          { x: isMobile ? 0 : '-18vw', y: isMobile ? '-6vh' : 0, opacity: 0 },
          { x: 0, y: 0, opacity: 1, ease: 'none' },
          0
        );

      if (!isMobile) {
        scrollTl.fromTo(rule,
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', transformOrigin: 'top' },
          0
        );
      }

      // Mosaic tiles fly in — smaller distances on mobile
      const tileDirections = isMobile
        ? [
          { x: '-10vw', y: '-8vh' },
          { x: '10vw', y: '-8vh' },
          { x: '-10vw', y: '8vh' },
          { x: '10vw', y: '8vh' },
        ]
        : [
          { x: '-20vw', y: '-16vh' },
          { x: '20vw', y: '-16vh' },
          { x: '-20vw', y: '16vh' },
          { x: '20vw', y: '16vh' },
        ];

      tileItems.forEach((tile, i) => {
        scrollTl.fromTo(tile,
          { x: tileDirections[i].x, y: tileDirections[i].y, opacity: 0, scale: 0.96 },
          { x: 0, y: 0, opacity: 1, scale: 1, ease: 'none' },
          i * 0.02
        );
      });

      // ── HOLD  (0.3 → 0.7) ────────────────────────────────
      scrollTl.to({}, {}, 0.3);

      // ── EXIT  (0.7 → 1.0) ────────────────────────────────
      scrollTl
        .fromTo(title,
          { x: 0, opacity: 1 },
          { x: isMobile ? '-6vw' : '-10vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(mosaic,
          { x: 0, y: 0, opacity: 1 },
          isMobile
            ? { y: '10vh', opacity: 0, ease: 'power2.in' }
            : { x: '18vw', opacity: 0, ease: 'power2.in' },
          0.7
        );

      if (!isMobile) {
        scrollTl.fromTo(rule,
          { scaleY: 1, opacity: 1 },
          { scaleY: 0.2, opacity: 0, ease: 'power2.in' },
          0.7
        );
      }

      scrollTl
        // Fade the entire section out at the tail end
        .fromTo(section,
          { opacity: 1 },
          { opacity: 0, ease: 'power1.in' },
          0.88
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      data-scroll-reveal="0.5"
      className="section-pinned bg-broco-bg flex items-center justify-center md:flex-row flex-col md:pt-0 pt-[10vh]"
    >
      {/* Vertical Rule - hidden on mobile */}
      <Rule
        ref={ruleRef}
        orientation="vertical"
        className="absolute left-[42vw] top-[10vh] h-[80vh] z-[1] hidden md:block"
      />

      {/* Left Title */}
      <div
        ref={titleRef}
        className="md:absolute md:left-[6vw] md:top-[26vh] md:w-[30vw] w-[88vw] z-[3] will-change-transform md:text-left text-center mb-6 md:mb-0"
      >
        <h2 className="headline-lg font-display font-bold text-broco-text mb-6">
          One canvas.<br />Many layouts.
        </h2>
        <a
          href="https://s-poony.github.io/BROCO/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-display font-medium text-sm flex items-center gap-1.5 link-animated text-broco-accent md:justify-start justify-center"
        >
          Try the demo
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* 2x2 Mosaic */}
      <div
        ref={mosaicRef}
        className="md:absolute md:left-[44vw] md:top-[14vh] md:w-[50vw] md:h-[72vh] w-[92vw] h-auto z-[2] will-change-transform"
      >
        <div className="grid grid-cols-2 grid-rows-2 gap-[clamp(8px,1.2vw,18px)] h-full">
          {galleryItems.map((item, index) => (
            <div
              key={item.src}
              ref={(el) => { tilesRef.current[index] = el; }}
              className="will-change-transform aspect-[4/3] md:aspect-auto"
            >
              <Tile className="w-full h-full overflow-hidden" noHover>
                {item.type === 'gif' ? (
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="broco-img"
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="broco-img object-contain bg-broco-bg"
                  />
                )}
              </Tile>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryMosaicSection;
