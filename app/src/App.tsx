import { useEffect } from 'react';
import './index.css';

// Components
import { Navigation } from '@/components/Navigation';

// Sections
import { HeroSection } from '@/sections/HeroSection';
import { FeatureHighlightSection } from '@/sections/FeatureHighlightSection';
import { ThreeUpFeatures } from '@/sections/ThreeUpFeatures';
import { DeepFeatureSection } from '@/sections/DeepFeatureSection';
import { WorkflowSection } from '@/sections/WorkflowSection';
import { GalleryMosaicSection } from '@/sections/GalleryMosaicSection';
import { DarkFeatureSection } from '@/sections/DarkFeatureSection';
import { TestimonialsSection } from '@/sections/TestimonialsSection';
import { FooterSection } from '@/sections/FooterSection';

// Type for ScrollTrigger instance
interface ScrollTriggerInstance {
  start: number;
  end?: number;
  vars: {
    pin?: boolean;
  };
  trigger?: unknown;
  kill: () => void;
}

// Type for pinned range
interface PinnedRange {
  start: number;
  end: number;
  center: number;
}

function App() {
  useEffect(() => {
    // Wait for all sections to mount and register their ScrollTriggers
    const timer = setTimeout(() => {
      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;

      if (!gsap || !ScrollTrigger) return;

      // Get all pinned ScrollTriggers
      const allTriggers = ScrollTrigger.getAll() as ScrollTriggerInstance[];
      const pinned = allTriggers
        .filter((st: ScrollTriggerInstance) => st.vars.pin)
        .sort((a: ScrollTriggerInstance, b: ScrollTriggerInstance) => a.start - b.start);

      const maxScroll = ScrollTrigger.maxScroll(window);

      if (!maxScroll || pinned.length === 0) return;

      // Build ranges and snap targets from actual pinned sections
      const pinnedRanges: PinnedRange[] = pinned.map((st: ScrollTriggerInstance) => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      // Create global snap
      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            // Check if within any pinned range (with small buffer)
            const inPinned = pinnedRanges.some(
              (r: PinnedRange) => value >= r.start - 0.02 && value <= r.end + 0.02
            );

            // If not in a pinned section, allow free scroll
            if (!inPinned) return value;

            // Find nearest pinned center
            const target = pinnedRanges.reduce((closest: number, r: PinnedRange) =>
              Math.abs(r.center - value) < Math.abs(closest - value)
                ? r.center
                : closest,
              pinnedRanges[0]?.center ?? 0
            );

            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        }
      });

      // Refresh to ensure all pin-spacers and positions are correct
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative">
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="relative">
        {/* Section 1: Hero - pin: true */}
        <HeroSection />

        {/* Section 2: Feature Highlight - pin: true */}
        <FeatureHighlightSection />

        {/* Section 3: Three-Up Features - pin: false */}
        <ThreeUpFeatures />

        {/* Section 4: Deep Feature - pin: true */}
        <DeepFeatureSection />

        {/* Section 5: Workflow - pin: true */}
        <WorkflowSection />

        {/* Section 6: Gallery Mosaic - pin: true */}
        <GalleryMosaicSection />

        {/* Section 7: Dark Feature - pin: true */}
        <DarkFeatureSection />

        {/* Section 8: Testimonials - pin: true */}
        <TestimonialsSection />

        {/* Section 9: Footer - pin: false */}
        <FooterSection />
      </main>
    </div>
  );
}

export default App;
