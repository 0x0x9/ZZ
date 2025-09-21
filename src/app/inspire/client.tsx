'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Pause, X, NotebookPen, Sparkles, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { cn } from "@/lib/utils";


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

function Glass({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg ${className}`}>
      {children}
    </div>
  );
}

function Pill({ onClick, icon, children, className = "" }: { onClick?: () => void; icon?: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 bg-white/10 backdrop-blur hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 ${className}`}
    >
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

  const cur = useMemo(() => AMBIENCES.find(a => a.id === ambience)!, [ambience]);

  const videoSrc = useMemo(() => {
    const muteState = !hasInteracted || isMuted ? 1 : 0;
    return `https://www.youtube.com/embed/${cur.videoId}?autoplay=1&mute=${muteState}&controls=0&loop=1&playlist=${cur.videoId}&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3`;
  }, [cur, isMuted, hasInteracted]);


  const handleFirstInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!hasInteracted) return handleFirstInteraction();
    setIsMuted(m => !m);
  };

  // Notes localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("xinspire.notes");
      if (raw) setNotes(JSON.parse(raw));
      const lastAmb = localStorage.getItem("xinspire.ambience");
      if (lastAmb && ["forest", "neon", "loft", "beach"].includes(lastAmb)) setAmbience(lastAmb as AmbienceId);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("xinspire.notes", JSON.stringify(notes));
    } catch {}
  }, [notes]);
  useEffect(() => {
    try {
      localStorage.setItem("xinspire.ambience", ambience);
    } catch {}
  }, [ambience]);

  const addNote = () => {
    const t = note.trim();
    if (!t) return;
    setNotes(n => [t, ...n]);
    setNote("");
  };

  return (
    <div className="relative min-h-screen w-full text-white">
      {/* Background gradient glow */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-br from-cyan-300/20 via-fuchsia-400/10 to-indigo-500/10 blur-[2px]" />

      {/* Fullscreen YouTube */}
      <div className={cn(
          "absolute inset-0 -z-10 overflow-hidden transition-all duration-500",
          panelOpen ? "blur-md" : "blur-0"
      )}>
        <iframe
          key={videoSrc}
          src={videoSrc}
          className="absolute top-1/2 left-1/2 min-h-[177.77vh] min-w-[177.77vw] w-auto h-auto -translate-x-1/2 -translate-y-1/2 scale-[2.5]"
          allow="autoplay; fullscreen"
          style={{ pointerEvents: 'none' }}
        />
        <div className="pointer-events-none absolute inset-0 bg-black/20" />
      </div>

       {/* Ambience badge */}
       <div className="pointer-events-none fixed left-6 top-6 z-30 select-none">
        <Glass className="px-4 py-2">
          <div className="text-xs uppercase tracking-wider text-white/70">Ambiance</div>
          <div className="text-base font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> {cur.label}
          </div>
        </Glass>
      </div>

      {/* Overlay d’activation */}
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
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.2)" }}
                animate={{
                    scale: [1, 1.03, 1],
                    boxShadow: [
                    "0 0 10px rgba(255,255,255,0.1)",
                    "0 0 25px rgba(255,255,255,0.25)",
                    "0 0 10px rgba(255,255,255,0.1)"
                    ],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
              Activer l'expérience
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hotspot panneau */}
      <div
        onClick={() => setPanelOpen(true)}
        className="fixed bottom-4 left-1/2 z-30 -translate-x-1/2 h-10 w-10 cursor-pointer rounded-full border border-white/20 bg-white/10 backdrop-blur hover:border-white/40"
      />

      {/* Bouton retour */}
      <Link href="/" passHref>
        <Pill className="fixed bottom-4 right-4 z-30" icon={<ArrowLeft className="h-4 w-4" />}>Retour</Pill>
      </Link>

      {/* Panneau de contrôle */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
          >
            <div className="absolute inset-0 bg-black/20" onClick={() => setPanelOpen(false)} />
            <div className="absolute left-1/2 top-10 w-[92%] max-w-5xl -translate-x-1/2">
              <Glass className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/90">
                    <NotebookPen className="h-5 w-5" />
                    <div className="text-lg font-semibold">Panneau de contrôle</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Pill onClick={toggleMute} icon={isMuted ? <Music className="h-4 w-4" /> : <Pause className="h-4 w-4" />}>
                      {isMuted ? "Son coupé" : "Son actif"}
                    </Pill>
                    <Pill onClick={() => setPanelOpen(false)} icon={<X className="h-4 w-4" />}>Fermer</Pill>
                  </div>
                </div>

                {/* Choix ambiance */}
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
                      placeholder="Dépose ici une idée…"
                      className="mt-2 h-28 w-full resize-none rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <Pill onClick={addNote} icon={<NotebookPen className="h-4 w-4" />}>Sauvegarder</Pill>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-white/80 mb-2">Dernières idées</div>
                    <div className="space-y-2 max-h-40 overflow-auto pr-1">
                      {notes.length === 0 && <div className="text-white/60 text-sm">Aucune note.</div>}
                      {notes.map((n, i) => (
                        <div key={i} className="rounded-xl border border-white/15 bg-white/5 p-2 text-sm">{n}</div>
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
