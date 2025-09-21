

'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Pause, Play, X, NotebookPen, Settings, Sparkles, ArrowLeft } from "lucide-react";
import Link from 'next/link';

/**
 * XInspire — Fullscreen Oasis Environment
 * --------------------------------------
 * VisionOS-like fullscreen ambience: background YouTube video with its own audio,
 * minimal chrome, hidden glass panel (notes + controls) revealed via hotspot or keyboard.
 *
 * Autoplay note: browsers block audio until user interaction. We start muted.
 * After the first click ("Activer l'expérience"), we unmute the video.
 */

// ---- Config ----
const AMBIENCES = [
  {
    id: "forest" as const,
    label: "Forêt Zen",
    videoId: "29XymHesxa0",
    desc: "Lumière douce, brume légère, respiration longue.",
  },
  {
    id: "neon" as const,
    label: "Néon Nocturne",
    videoId: "-Xh4BNbxpI8",
    desc: "Halos cyan/magenta, rythme lent, ville la nuit.",
  },
  {
    id: "loft" as const,
    label: "Loft Urbain",
    videoId: "ys50VgfL-u8",
    desc: "Verre & métal, contre-jour, minimalisme élégant.",
  },
  {
    id: "beach" as const,
    label: "Plage futuriste",
    videoId: "1ZYbU82GVz4",
    desc: "Horizon laiteux, brise légère, sons d'océan.",
  },
];

type AmbienceId = typeof AMBIENCES[number]["id"];

// Utility to build a YouTube embed src
function ytEmbedSrc(id: string, opts: { autoplay?: 0 | 1; mute?: 0 | 1; loop?: 0 | 1; controls?: 0 | 1; playsinline?: 0 | 1; start?: number; end?: number } = {}) {
  const p = new URLSearchParams({
    autoplay: String(opts.autoplay ?? 1),
    mute: String(opts.mute ?? 1),
    loop: String(opts.loop ?? 1),
    controls: String(opts.controls ?? 0),
    playsinline: String(opts.playsinline ?? 1),
    enablejsapi: "1",
    modestbranding: "1",
    rel: "0",
    iv_load_policy: "3",
    showinfo: "0",
    fs: "0",
  });
  // Loop needs playlist param set to the same ID
  if ((opts.loop ?? 1) === 1) p.set("playlist", id);
  if (opts.start) p.set("start", String(opts.start));
  if (opts.end) p.set("end", String(opts.end));
  return `https://www.youtube.com/embed/${id}?${p.toString()}`;
}

// Glass panel wrapper
function Glass({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] ${className}`}>{children}</div>
  );
}

// Small pill button
function Pill({ onClick, icon, children, className = "" }: { onClick?: () => void; icon?: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 bg-white/10 backdrop-blur hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 ${className}`}>
      {icon}
      <span className="font-medium">{children}</span>
    </button>
  );
}

export default function XInspireEnvironment() {
  const [ambience, setAmbience] = useState<AmbienceId>("forest");
  const [panelOpen, setPanelOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  
  const bgPlayerRef = useRef<any>(null);

  const cur = useMemo(() => AMBIENCES.find(a => a.id === ambience)!, [ambience]);

  // Load YouTube IFrame API
  useEffect(() => {
    const tag = document.createElement('script');
    if (!window.YT) {
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
    }
  }, []);

  // Player creation and management
  useEffect(() => {
    function createPlayer() {
        if (bgPlayerRef.current) {
            bgPlayerRef.current.destroy();
        }
        bgPlayerRef.current = new (window as any).YT.Player('player-bg', {
            videoId: cur.videoId,
            playerVars: {
                autoplay: 1,
                controls: 0,
                loop: 1,
                playlist: cur.videoId,
                modestbranding: 1,
                rel: 0,
                fs: 0,
                playsinline: 1,
                mute: 1, // Always start muted
            },
            events: {
                onReady: (e: any) => {
                    e.target.playVideo();
                    if (!isMuted && hasInteracted) {
                        e.target.unMute();
                    }
                },
            },
        });
    }

    if (typeof (window as any).YT === 'undefined' || typeof (window as any).YT.Player === 'undefined') {
        (window as any).onYouTubeIframeAPIReady = createPlayer;
    } else {
        createPlayer();
    }
    
    return () => {
        if (bgPlayerRef.current?.destroy) {
            bgPlayerRef.current.destroy();
        }
    };
  }, [cur.videoId, isMuted, hasInteracted]);
  
  
  const handleFirstInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setIsMuted(false);
      try { bgPlayerRef.current?.unMute(); } catch {}
    }
  };
  
  const toggleMute = () => {
      if (!hasInteracted) return handleFirstInteraction();
      setIsMuted((m) => {
          const next = !m;
          try {
              next ? bgPlayerRef.current?.mute() : bgPlayerRef.current?.unMute();
          } catch {}
          return next;
      });
  };

  // Keyboard shortcut to toggle panel (Cmd/Ctrl+K)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPanelOpen(v => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Save notes locally
  useEffect(() => {
    try {
      const raw = localStorage.getItem("xinspire.notes");
      if (raw) setNotes(JSON.parse(raw));
      const lastAmb = localStorage.getItem("xinspire.ambience");
      if (lastAmb && ["forest","neon","loft","beach"].includes(lastAmb)) setAmbience(lastAmb as AmbienceId);
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("xinspire.notes", JSON.stringify(notes)); } catch {}
  }, [notes]);
  useEffect(() => {
    try { localStorage.setItem("xinspire.ambience", ambience); } catch {}
  }, [ambience]);

  const addNote = () => {
    const t = note.trim();
    if (!t) return;
    setNotes(n => [t, ...n]);
    setNote("");
  };

  const ambienceBadge = (
    <div className="pointer-events-none fixed left-6 top-6 z-30 select-none">
      <Glass className="px-4 py-2">
        <div className="text-xs uppercase tracking-wider text-white/70">Ambiance</div>
        <div className="text-base font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4" /> {cur.label}
        </div>
      </Glass>
    </div>
  );

  const hotspot = (
    <div
      aria-label="Ouvrir le panneau"
      title="Ouvrir le panneau (⌘/Ctrl+K)"
      onClick={() => setPanelOpen(true)}
      className="fixed bottom-4 left-1/2 z-30 -translate-x-1/2 h-10 w-10 cursor-pointer rounded-full border border-white/20 bg-white/10 backdrop-blur hover:border-white/40"
    />
  );
  
  const backButton = (
      <Link href="/" passHref>
          <Pill className="fixed bottom-4 right-4 z-30" icon={<ArrowLeft className="h-4 w-4"/>}>Retour</Pill>
      </Link>
  );

  return (
    <div className="relative min-h-screen w-full text-white bg-black">
      {/* Background gradient glow */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-br from-cyan-300/20 via-fuchsia-400/10 to-indigo-500/10 blur-[2px]" />

      {/* Fullscreen background YouTube video */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div id="player-bg" className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 scale-[1.5]" />
        <div className="pointer-events-none absolute inset-0 bg-black/20 backdrop-blur-sm" />
      </div>


      {/* Minimal top hint */}
      <div className="fixed top-4 right-4 z-30 text-sm text-white/70">Appuie sur ⌘/Ctrl+K pour le panneau</div>

      {/* Ambience badge */}
      {ambienceBadge}

      {/* Center CTA overlay to unlock audio */}
      <AnimatePresence>
        {!hasInteracted && (
          <motion.div
            className="fixed inset-0 z-20 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              onClick={handleFirstInteraction}
              className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-white/40"
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(255, 255, 255, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              Activer l'expérience
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden hotspot to open the panel */}
      {hotspot}
      {backButton}

      {/* Control Panel */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
          >
            {/* Click-away backdrop */}
            <div className="absolute inset-0 bg-black/20" onClick={() => setPanelOpen(false)} />
            <div className="absolute left-1/2 top-10 w-[92%] max-w-5xl -translate-x-1/2">
              <Glass className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/90">
                    <NotebookPen className="h-5 w-5" />
                    <div className="text-lg font-semibold">Panneau de contrôle</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Pill onClick={toggleMute} icon={isMuted ? <Music className="h-4 w-4" /> : <Pause className="h-4 w-4" />}>{isMuted ? "Son coupé" : "Son actif"}</Pill>
                    <Pill onClick={() => setPanelOpen(false)} icon={<X className="h-4 w-4" />}>Fermer</Pill>
                  </div>
                </div>

                {/* Ambience selector */}
                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {AMBIENCES.map(a => (
                    <button
                      key={a.id}
                      onClick={() => setAmbience(a.id)}
                      className={`rounded-xl border px-3 py-3 text-left transition-all backdrop-blur ${
                        ambience === a.id ? "border-white/50 bg-white/15" : "border-white/20 bg-white/5 hover:border-white/35"
                      }`}
                    >
                      <div className="text-sm font-semibold">{a.label}</div>
                      <div className="text-xs text-white/70">{a.desc}</div>
                    </button>
                  ))}
                </div>

                {/* Notes */}
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="md:col-span-2">
                    <label className="text-sm text-white/80">Note rapide</label>
                    <textarea
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      placeholder="Dépose ici une idée, un mot, une image mentale…"
                      className="mt-2 h-28 w-full resize-none rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <Pill onClick={addNote} icon={<NotebookPen className="h-4 w-4" />}>Sauvegarder</Pill>
                      <span className="text-xs text-white/60">Astuce: ⌘/Ctrl+K pour ouvrir/fermer le panneau</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-white/80 mb-2">Dernières idées</div>
                    <div className="space-y-2 max-h-40 overflow-auto pr-1">
                      {notes.length === 0 && <div className="text-white/60 text-sm">Aucune note pour l’instant.</div>}
                      {notes.map((n, i) => (
                        <div key={i} className="rounded-xl border border-white/15 bg-white/5 p-2 text-sm">
                          {n}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Glass>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
