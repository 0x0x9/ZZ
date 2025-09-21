'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Maximize, Music, Edit3, Sun, Moon, Sparkles, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

type AmbienceId = "forest" | "loft" | "beach" | "neon";

interface Ambience {
  id: AmbienceId;
  name: string;
  bgVideoId: string;
  audioVideoId: string;
  icon: React.ElementType;
}

const AMBIENCES: Ambience[] = [
  { id: 'forest', name: 'Forêt Zen', bgVideoId: 'yFHe-PAc0s0', audioVideoId: 'vumr_nQ31p4', icon: Sun },
  { id: 'neon', name: 'Nuit Urbaine', bgVideoId: 'S_dfq9rFWAE', audioVideoId: 'A5n-s9g4g_4', icon: Moon },
  { id: 'beach', name: 'Plage Futuriste', bgVideoId: 'k39z12J3Xy0', audioVideoId: 'wE3A-2c0w8U', icon: Sparkles },
  { id: 'loft', name: 'Loft Créatif', bgVideoId: 'R9eKkH725pE', audioVideoId: 'y6Nf3aA7t5A', icon: Edit3 },
];

function YouTubePlayer({ videoId, isPlaying, volume, isMuted, onReady, onStateChange, isBackground }: {
    videoId: string;
    isPlaying: boolean;
    volume: number;
    isMuted: boolean;
    onReady: (event: any) => void;
    onStateChange: (event: any) => void;
    isBackground?: boolean;
}) {
    useEffect(() => {
        const player = (window as any).YT?.get(`player-${videoId}`);
        if (player) {
            if (isPlaying && player.getPlayerState() !== 1) {
                player.playVideo();
            } else if (!isPlaying && player.getPlayerState() === 1) {
                player.pauseVideo();
            }
            player.setVolume(isMuted ? 0 : volume * 100);
        }
    }, [isPlaying, volume, isMuted, videoId]);

    return (
        <div id={`player-${videoId}`} className={cn(isBackground ? "absolute inset-0 w-full h-full" : "w-1 h-1 opacity-0 absolute")}></div>
    );
}


export default function XInspireClient() {
  const [isPanelOpen, setPanelOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [ambience, setAmbience] = useState<Ambience>(() => {
    if (typeof window === 'undefined') return AMBIENCES[0];
    const savedId = localStorage.getItem('xinspire.ambience');
    return AMBIENCES.find(a => a.id === savedId) || AMBIENCES[0];
  });
  const [notes, setNotes] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('xinspire.notes') || '';
  });
  const [isMuted, setIsMuted] = useState(true);
  
  const bgPlayerRef = useRef<any>(null);
  const audioPlayerRef = useRef<any>(null);
  
  useEffect(() => {
    localStorage.setItem('xinspire.ambience', ambience.id);
  }, [ambience]);

  useEffect(() => {
    const timer = setTimeout(() => {
        localStorage.setItem('xinspire.notes', notes);
    }, 500);
    return () => clearTimeout(timer);
  }, [notes]);

  useEffect(() => {
    const onYouTubeIframeAPIReady = () => {
      bgPlayerRef.current = new (window as any).YT.Player(`player-${ambience.bgVideoId}`, {
        videoId: ambience.bgVideoId,
        playerVars: { autoplay: 1, controls: 0, loop: 1, playlist: ambience.bgVideoId, mute: 1, origin: window.location.origin },
        events: { 'onReady': (e: any) => e.target.playVideo() }
      });
      audioPlayerRef.current = new (window as any).YT.Player(`player-${ambience.audioVideoId}`, {
        videoId: ambience.audioVideoId,
        playerVars: { autoplay: 1, controls: 0, loop: 1, playlist: ambience.audioVideoId, origin: window.location.origin },
         events: { 'onReady': (e: any) => {
             e.target.setVolume(isMuted ? 0 : 50);
             if(hasInteracted) e.target.playVideo();
         } }
      });
    };

    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    } else {
        onYouTubeIframeAPIReady();
    }
    
    return () => {
        bgPlayerRef.current?.destroy();
        audioPlayerRef.current?.destroy();
    }
  }, [ambience.id, hasInteracted, isMuted]);

  const handleFirstInteraction = () => {
      if (!hasInteracted) {
          setHasInteracted(true);
          setIsMuted(false);
          audioPlayerRef.current?.playVideo();
      }
  };

  const handleToggleMute = () => {
    if (!hasInteracted) handleFirstInteraction();
    else setIsMuted(!isMuted);
  };

  return (
    <div className="w-full h-screen relative overflow-hidden bg-black text-white">
      {/* Background Video */}
      <motion.div 
        key={ambience.bgVideoId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0"
      >
        <YouTubePlayer 
            videoId={ambience.bgVideoId} 
            isPlaying={true} 
            volume={0} 
            isMuted={true}
            onReady={() => {}} 
            onStateChange={() => {}}
            isBackground={true}
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      </motion.div>
      <YouTubePlayer videoId={ambience.audioVideoId} isPlaying={hasInteracted} volume={0.5} isMuted={isMuted} onReady={() => {}} onStateChange={() => {}} />

       {/* First Interaction Overlay */}
      <AnimatePresence>
        {!hasInteracted && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-black/50 flex flex-col items-center justify-center text-center p-4"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Bienvenue dans (X)Inspire</h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-8">
              Cliquez pour activer l'audio et commencer votre expérience immersive.
            </p>
            <Button size="lg" onClick={handleFirstInteraction} className="rounded-full">
              Entrer dans l'Oasis
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main UI */}
      <div className="relative z-20 h-full w-full flex flex-col p-8">
        <header className="flex justify-between items-center">
             <Button variant="ghost" asChild>
                <a href="/xos" className="flex items-center gap-2"><ChevronLeft className="h-4 w-4" /> Retour à (X)OS</a>
             </Button>
        </header>

        <div className="flex-grow flex items-center justify-center">
            {/* Center Content could go here */}
        </div>

        {/* Bottom Control Panel Hotspot */}
        <footer className="flex-shrink-0 flex justify-center">
          <button onClick={() => setPanelOpen(true)} className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300">
             <Sparkles className="h-8 w-8"/>
          </button>
        </footer>
      </div>

       {/* Control Panel */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute bottom-0 left-0 right-0 z-40 p-4"
          >
            <div className="glass-card max-w-4xl mx-auto p-6 rounded-3xl">
              <div className="flex justify-between items-start">
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Ambience Picker */}
                      <div>
                          <h3 className="font-semibold text-lg mb-3">Ambiances</h3>
                          <div className="flex flex-col gap-2">
                              {AMBIENCES.map(a => (
                                  <Button key={a.id} variant={ambience.id === a.id ? "secondary" : "ghost"} onClick={() => setAmbience(a)} className="justify-start gap-3">
                                      <a.icon className="h-5 w-5" /> {a.name}
                                  </Button>
                              ))}
                          </div>
                      </div>
                      {/* Audio Controls */}
                      <div>
                         <h3 className="font-semibold text-lg mb-3">Audio</h3>
                         <Button onClick={handleToggleMute} variant="ghost" className="w-full justify-start gap-3">
                             {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                             {isMuted ? 'Son coupé' : 'Son actif'}
                         </Button>
                      </div>
                      {/* Notes */}
                      <div className="col-span-2">
                           <h3 className="font-semibold text-lg mb-3">Carnet d'inspiration</h3>
                           <Textarea
                                placeholder="Vos idées..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={5}
                                className="bg-background/50 border-white/30"
                           />
                      </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setPanelOpen(false)} className="ml-4">
                      <X className="h-6 w-6"/>
                  </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}