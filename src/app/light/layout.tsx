
'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// We are creating a self-contained immersive layout here, similar to the original 'inspire' page.

function VideoTransitionOverlay({ active }: { active: boolean; }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="quote-overlay"
          className="pointer-events-none absolute inset-0 z-20 bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }}
          exit={{ opacity: 0, transition: { duration: 2.5, ease: 'easeIn', delay: 1 } }}
        />
      )}
    </AnimatePresence>
  );
}


export default function LightLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const [isSwitching, setIsSwitching] = useState(false);
    
    // In a real implementation, this would handle video logic.
    // For now, it just provides the structure for the background.

  return (
    <div className="relative min-h-screen w-full text-white">
      {/* Background Video */}
      <motion.div
        className="fixed inset-0 -z-10 overflow-hidden"
      >
        <div id="youtube-player" className="absolute inset-0 w-full h-full object-cover scale-[1.5]" style={{ pointerEvents: 'none', transition: 'opacity 0.5s ease-in-out', opacity: isSwitching ? 0 : 1 }}>
            <iframe
                src="https://www.youtube.com/embed/YUEb23FQVhA?autoplay=1&mute=1&loop=1&playlist=YUEb23FQVhA&controls=0&showinfo=0&autohide=1&wmode=transparent"
                title="Background Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
            ></iframe>
        </div>
        <VideoTransitionOverlay active={isSwitching} />
        <div className="pointer-events-none absolute inset-0 bg-black/60" />
      </motion.div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
