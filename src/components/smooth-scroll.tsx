
'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pageHeight, setPageHeight] = useState(0);

  // Measure the height of the content
  useLayoutEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
        const updateHeight = () => {
             setPageHeight(scrollContainer.scrollHeight);
        };
        
        updateHeight();

        // Use ResizeObserver to handle dynamic content changes
        const resizeObserver = new ResizeObserver(updateHeight);
        resizeObserver.observe(scrollContainer);

        return () => resizeObserver.disconnect();
    }
  }, []);

  const { scrollY } = useScroll();
  const transform = useTransform(scrollY, [0, pageHeight], [0, -pageHeight]);
  const physics = { damping: 20, mass: 0.5, stiffness: 60 };
  const spring = useSpring(transform, physics);

  return (
    <>
      <motion.div
        ref={scrollRef}
        style={{ y: spring }}
        className="fixed top-0 left-0 w-full overflow-hidden will-change-transform"
      >
        {children}
      </motion.div>
      <div style={{ height: pageHeight }} />
    </>
  );
};

export default SmoothScroll;
