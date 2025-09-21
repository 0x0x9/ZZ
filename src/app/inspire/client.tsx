'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimationControls, useCycle } from "framer-motion";
import { Music, Pause, X, NotebookPen, Sparkles, ArrowLeft, MessageSquare, Palette, Image as ImageIcon } from "lucide-react";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";

const OriaAnimation = dynamic(() => import("@/components/ui/oria-animation"), { ssr: false });


/**
 * OriaSiriOrbPro — Orbe VisionOS “future Siri”
 * Props:
 *  - size: px (default 120)
 *  - state: "idle" | "active" | "thinking" | "speaking"
 *  - className: tailwind extra
 *  - subtle: moins de glow si true
 *
 * Conseil UX:
 *  - state="active" quand l’input a du texte
 *  - state="thinking" pendant l’appel API
 *  - state="speaking" si tu fais du TTS
 */
export function OriaSiriOrbPro({
  size = 120,
  state = "idle",
  subtle = false,
  className
}: {
  size?: number;
  state?: "idle" | "active" | "thinking" | "speaking";
  subtle?: boolean;
  className?: string;
}) {
  const ring = useAnimationControls();
  const core = useAnimationControls();
  const wave = useAnimationControls();
  const [haloCycle, cycleHalo] = useCycle(
    { rotate: 0, scale: 1 },
    { rotate: 360, scale: 1.1 }
  );

  // Respecte prefers-reduced-motion
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) {
      ring.stop(); core.stop(); wave.stop();
    } else {
        cycleHalo();
    }
  }, [ring, core, wave, cycleHalo]);

  // Animations selon l’état
  useEffect(() => {
    const baseEase = "easeInOut";
    if (state === "idle") {
      ring.start({ opacity: [0.5, 0.9, 0.5], transition: { duration: 4, repeat: Infinity, ease: baseEase } });
      core.start({ scale: [1, 1.015, 1], transition: { duration: 3.2, repeat: Infinity, ease: baseEase } });
      wave.start({ rotate: [0, 360], transition: { duration: 16, repeat: Infinity, ease: "linear" } });
    }
    if (state === "active") {
      ring.start({ opacity: [0.6, 1, 0.6], transition: { duration: 3, repeat: Infinity, ease: baseEase } });
      core.start({ scale: [1, 1.03, 1], transition: { duration: 2.4, repeat: Infinity, ease: baseEase } });
      wave.start({ rotate: [0, 360], transition: { duration: 12, repeat: Infinity, ease: "linear" } });
    }
    if (state === "thinking") {
      ring.start({ opacity: [0.7, 1, 0.7], blur: ["10px","14px","10px"], transition: { duration: 2, repeat: Infinity, ease: baseEase } as any });
      core.start({ scale: [1, 1.06, 1], transition: { duration: 1.4, repeat: Infinity, ease: baseEase } });
      wave.start({ rotate: [0, 360], transition: { duration: 8, repeat: Infinity, ease: "linear" } });
    }
    if (state === "speaking") {
      ring.start({ opacity: [0.9, 1, 0.9], transition: { duration: 1.6, repeat: Infinity, ease: baseEase } });
      core.start({ scale: [1, 1.08, 1], transition: { duration: 1.1, repeat: Infinity, ease: baseEase } });
      wave.start({ rotate: [0, 360], transition: { duration: 6, repeat: Infinity, ease: "linear" } });
    }
  }, [state, ring, core, wave]);

  // Couleurs/halo adaptatifs
  const glowPink = subtle ? "rgba(244,114,182,0.25)" : "rgba(244,114,182,0.45)";
  const glowIndigo = subtle ? "rgba(129,140,248,0.2)" : "rgba(129,140,248,0.35)";

  return (
    <div
      className={cn("relative select-none", className)}
      style={{ width: size, height: size }}
      aria-label="Oria — état visuel"
    >
      {/* Aura externe multi-tons */}
      <motion.div
        animate={haloCycle}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full"
        style={{
          filter: "blur(22px)",
          background:
            `radial-gradient(closest-side, hsl(var(--primary)), transparent 80%),
             radial-gradient(closest-side, hsl(var(--accent)), transparent 85%),
             radial-gradient(closest-side, ${glowPink}, transparent 90%),
             radial-gradient(closest-side, ${glowIndigo}, transparent 100%)`
        }}
      />

      {/* Anneau verre */}
      <motion.div
        className="absolute inset-0 rounded-full border backdrop-blur-2xl"
        style={{
          borderColor: "rgba(255,255,255,0.28)",
          boxShadow: "0 18px 70px rgba(0,0,0,0.35), inset 0 0 1px rgba(255,255,255,0.3)"
        }}
      />

      {/* Reflets subtils */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "conic-gradient(from 180deg at 50% 50%, rgba(255,255,255,0.12), rgba(255,255,255,0.04), rgba(255,255,255,0.12))",
          maskImage:
            "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.9) 60%, rgba(0,0,0,0) 80%)"
        }}
      />

      {/* Noyau “liquide” */}
      <motion.div
        animate={core}
        className="absolute inset-2 rounded-full"
        style={{
          background: `radial-gradient(closest-side, rgba(255,255,255,0.24), rgba(255,255,255,0.06))`,
          boxShadow: "inset 0 10px 40px rgba(255,255,255,0.08)"
        }}
      />

      {/* Onde interne (rotation continue) */}
      <motion.div
        animate={wave}
        className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,255,255,0.36), rgba(255,255,255,0.0))",
          filter: "blur(10px)"
        }}
      />

      {/* Points scintillants */}
      <DotSpark x="20%" y="25%" delay={0.1} />
      <DotSpark x="78%" y="40%" delay={0.4} />
      <DotSpark x="38%" y="78%" delay={0.9} />
    </div>
  );
}

function DotSpark({ x, y, delay=0 }: { x: string; y: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0.2, scale: 0.8 }}
      animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.8, 1, 0.8] }}
      transition={{ duration: 2.6, repeat: Infinity, delay, ease: "easeInOut" }}
      className="absolute h-2 w-2 rounded-full"
      style={{
        left: x, top: y,
        background: "radial-gradient(closest-side, rgba(255,255,255,0.9), rgba(255,255,255,0))",
        filter: "blur(0.5px)"
      }}
    />
  );
}


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
    videoId: "u9vK5utTcxE",
    desc: "Horizon laiteux, brise légère, sons d'océan.",
  },
];

type AmbienceId = typeof AMBIENCES[number]["id"];

// Real AI Chatbot function
const getInspirationalMessage = async (prompt: string, history: {type: 'user' | 'ai', text: string}[]) => {
    const response = await fetch('/api/generateInspiration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, history }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "L'IA n'a pas pu répondre.");
    }
    const result = await response.json();
    return result.inspiration;
}

function Glass({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn(`rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg`, className)}>
      {children}
    </div>
  );
}

function Pill({ onClick, icon, children, className = "" }: { onClick?: () => void; icon?: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(`inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 bg-white/10 backdrop-blur hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30`, className)}
    >
      {icon}
      <span className="font-medium">{children}</span>
    </button>
  );
}

function OriaChatbot() {
    const [messages, setMessages] = useState<{type: 'user' | 'ai', text: string}[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    useEffect(() => { if (scrollAreaRef.current) scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight; }, [messages, isLoading]);
    if (!mounted) return null;
  
    const handleSend = async () => {
      if (!input.trim()) return;
      const newMessages = [...messages, { type: 'user' as const, text: input }];
      setMessages(newMessages);
      const currentInput = input;
      setInput('');
      setIsLoading(true);
      try {
        const aiResponse = await getInspirationalMessage(currentInput, newMessages);
        setMessages(prev => [...prev, { type: 'ai' as const, text: aiResponse }]);
      } catch {
        setMessages(prev => [...prev, { type: 'ai' as const, text: "Désolé, je suis un peu à court d'inspiration pour le moment." }]);
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="flex flex-col h-full space-y-4">
        {/* Header visionOS */}
        <Glass className={cn("p-4 flex items-center gap-4", isLoading && "ring-1 ring-white/20")}>
          <OriaSiriOrbPro
            size={112}
            state={isLoading ? "thinking" : (input ? "active" : "idle")}
          />
          <div className={cn("flex-1 transition-all duration-300", isLoading && "blur-[2px] opacity-70")}>
            <div className="text-sm uppercase tracking-wider text-white/70">Oria</div>
            <div className="text-base md:text-lg font-medium text-white/90">
              {isLoading ? "Je façonne une piste pour toi…" :
               input ? "On affine. Dis-moi ce que tu veux ressentir." :
               "Je suis là. Décris-moi une ambiance, un besoin, un rythme."}
            </div>
          </div>
        </Glass>
  
        {/* Messages */}
        <div ref={scrollAreaRef} className="flex-1 space-y-4 overflow-y-auto pr-2 -mr-2 no-scrollbar">
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-white/80">Je suis Oria, ta muse. Dis-moi ce que tu veux explorer ✨</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex", msg.type === 'user' ? "justify-end" : "justify-start")}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={cn("max-w-[90%] rounded-xl px-4 py-2", msg.type === 'user' ? "bg-primary/80 text-white" : "bg-white/15")}
              >
                {msg.text}
              </motion.div>
            </div>
          ))}
          {isLoading && (
              <div className="flex justify-start">
                  <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="max-w-[90%] rounded-xl px-4 py-2 bg-white/15"
                  >
                     <div className="flex gap-2 items-center">
                         <span className="h-2 w-2 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                         <span className="h-2 w-2 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                         <span className="h-2 w-2 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                     </div>
                  </motion.div>
              </div>
          )}
        </div>
  
        {/* Entrée */}
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Décris ton idée, le ressenti, la contrainte…"
            rows={1}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 flex-1 resize-none"
          />
          <Button onClick={handleSend} disabled={isLoading} variant="secondary">Envoyer</Button>
        </div>
      </div>
    );
  }

function useLocalState<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(initial);
  useEffect(() => { try { const raw = localStorage.getItem(key); if (raw) setV(JSON.parse(raw)); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, setV] as const;
}

type Task = { id: string; title: string; done: boolean; eta: 15|30|60; createdAt: number };

function WorkTasks({ onStartTimer }: { onStartTimer: (m: number)=>void }) {
  const [tasks, setTasks] = useLocalState<Task[]>("xinspire.tasks", []);
  const [input, setInput] = useState("");
  const add = (eta: 15|30|60) => {
    const t = input.trim(); if (!t) return;
    const id = (crypto?.randomUUID?.() ?? `t_${Date.now()}_${Math.random()}`);
    setTasks(ts => [{ id, title: t, done: false, eta, createdAt: Date.now() }, ...ts]);
    setInput(""); onStartTimer(eta);
  };
  const toggle = (id: string) => setTasks(ts => ts.map(t => t.id===id ? {...t, done: !t.done} : t));
  const remove = (id: string) => setTasks(ts => ts.filter(t => t.id!==id));

  return (
    <Glass className="p-4">
      <div className="font-semibold mb-2">Tâches rapides</div>
      <div className="flex gap-2">
        <Textarea rows={1} value={input} onChange={e=>setInput(e.target.value)}
          placeholder="Ajouter une tâche…" className="bg-white/10 border-white/20 text-white placeholder:text-white/50 flex-1 resize-none" />
        <Button onClick={()=>add(25)} variant="secondary">Ajouter</Button>
      </div>
      <div className="mt-3 flex gap-2">
        {[15,30,60].map(m=>(
          <button key={m} onClick={()=>add(m as 15|30|60)}
            className="px-3 py-1 rounded-full text-sm border bg-white/10 hover:bg-white/15 border-white/25">
            + {m} min
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-2 max-h-60 overflow-auto pr-1 no-scrollbar">
        {tasks.length===0 && <div className="text-white/60 text-sm">Aucune tâche.</div>}
        {tasks.map(t=>(
          <div key={t.id} className="rounded-xl border border-white/15 bg-white/5 p-2 flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={t.done} onChange={()=>toggle(t.id)} />
              <span className={t.done ? "line-through opacity-60" : ""}>{t.title}</span>
            </label>
            <div className="flex items-center gap-2">
              <button onClick={()=>onStartTimer(t.eta)} className="text-xs underline opacity-80 hover:opacity-100">
                Démarrer {t.eta} min
              </button>
              <button onClick={()=>remove(t.id)} className="text-xs opacity-70 hover:opacity-100">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </Glass>
  );
}

function WorkBrief() {
  const [title, setTitle] = useLocalState("xinspire.brief.title", "");
  const [why, setWhy] = useLocalState("xinspire.brief.why", "");
  const [how, setHow] = useLocalState("xinspire.brief.how", "");
  const [first, setFirst] = useLocalState("xinspire.brief.first", "");

  const fromInspiration = () => {
    const notes = localStorage.getItem("xinspire.notes") || "";
    if (!title) setTitle("Éclat intérieur");
    if (!why) setWhy("Ancrer une émotion simple et vraie.");
    if (!how) setHow("Une forme, une lumière, un silence.");
    if (!first) setFirst("Esquisse 3 variations en 120 secondes.");
    // ici tu peux appeler ton API LLM si tu veux un vrai brief depuis Oria + notes
  };
  const exportMd = () => {
    const md = `# Mini-brief
**Titre**: ${title}
**Pourquoi**: ${why}
**Comment**: ${how}
**Premier pas**: ${first}
`;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "brief.md"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Glass className="p-4">
      <div className="font-semibold mb-2">Mini-brief</div>
      <div className="grid gap-2">
        <Textarea rows={1} value={title} onChange={e=>setTitle(e.target.value)} placeholder="Titre…" className="bg-white/10 border-white/20" />
        <Textarea rows={2} value={why} onChange={e=>setWhy(e.target.value)} placeholder="Pourquoi…" className="bg-white/10 border-white/20" />
        <Textarea rows={3} value={how} onChange={e=>setHow(e.target.value)} placeholder="Comment…" className="bg-white/10 border-white/20" />
        <Textarea rows={2} value={first} onChange={e=>setFirst(e.target.value)} placeholder="Premier pas…" className="bg-white/10 border-white/20" />
      </div>
      <div className="mt-3 flex gap-2">
        <Button variant="secondary" onClick={fromInspiration}>Générer depuis l’inspiration</Button>
        <Button onClick={exportMd}>Exporter .md</Button>
      </div>
    </Glass>
  );
}

function WorkTimer({ minutes, onEnd }: { minutes: number|null; onEnd: ()=>void }) {
  const [remain, setRemain] = useState<number>(0);
  useEffect(()=> {
    if (!minutes) return;
    setRemain(minutes*60);
    const id = setInterval(()=> setRemain(s=> (s>0? s-1 : 0)), 1000);
    return ()=> clearInterval(id);
  }, [minutes]);
  useEffect(()=> { if (minutes && remain===0) onEnd(); }, [remain, minutes, onEnd]);
  if (!minutes) return null;
  const mm = String(Math.floor(remain/60)).padStart(2,'0');
  const ss = String(remain%60).padStart(2,'0');
  return (
    <div className="fixed top-4 right-4 z-30">
      <Glass className="px-4 py-2">
        <div className="text-xs uppercase tracking-wider text-white/70">Focus</div>
        <div className="text-base font-semibold">{mm}:{ss}</div>
      </Glass>
    </div>
  );
}

export default function XInspireEnvironment() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  
  const [ambience, setAmbience] = useState<AmbienceId>("forest");
  const [panelOpen, setPanelOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useLocalState<string[]>("xinspire.notes", []);
  const [activeTimer, setActiveTimer] = useState<number|null>(null);
  const playerRef = useRef<any>(null);


  const cur = useMemo(() => AMBIENCES.find(a => a.id === ambience)!, [ambience]);

  useEffect(() => {
    function createPlayer() {
      if (!(window as any).YT) return;
      playerRef.current = new (window as any).YT.Player('youtube-player', {
        width: '100%',
        height: '100%',
        videoId: cur.videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          loop: 1,
          playlist: cur.videoId,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
          playsinline: 1
        },
        events: {
          onReady: (e: any) => {
            if (hasInteracted && !isMuted) e.target.unMute();
            else e.target.mute();
            e.target.playVideo();
          }
        }
      });
    }
  
    if (!(window as any).YT || !(window as any).YT.Player) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      (window as any).onYouTubeIframeAPIReady = () => {
        if (!playerRef.current) createPlayer();
      };
    } else {
        if (!playerRef.current) {
            createPlayer();
        } else {
            try {
                playerRef.current.loadPlaylist({ listType: 'playlist', list: [cur.videoId], index: 0 });
                if (hasInteracted && !isMuted) playerRef.current.unMute();
                else playerRef.current.mute();
            } catch (e) {
                try { playerRef.current.destroy?.(); } catch {}
                createPlayer();
            }
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur.videoId]);


  const handleFirstInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setIsMuted(false);
       if (playerRef.current?.unMute) {
          playerRef.current.unMute();
          playerRef.current.playVideo();
      }
    }
  };

  const toggleMute = () => {
    if (!hasInteracted) {
        handleFirstInteraction();
        return;
    };
    setIsMuted(m => {
        const newMuted = !m;
        if (playerRef.current) {
            if (newMuted) playerRef.current.mute();
            else playerRef.current.unMute();
        }
        return newMuted;
    });
};

  useEffect(() => {
    try {
      const lastAmb = localStorage.getItem("xinspire.ambience");
      if (lastAmb && ["forest", "neon", "loft", "beach"].includes(lastAmb)) setAmbience(lastAmb as AmbienceId);
    } catch {}
  }, []);

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

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full text-white">
      {/* Background gradient glow */}
      <div className="pointer-events-none absolute inset-0 -z-20" />

      {/* Fullscreen YouTube */}
      <motion.div
        className={cn(
          "absolute inset-0 -z-10 overflow-hidden transition-all duration-500",
          panelOpen ? "blur-sm" : ""
        )}
      >
        <div id="youtube-player" className="absolute inset-0 w-full h-full object-cover scale-[1.5]" style={{ pointerEvents: 'none' }} />
        <div className="pointer-events-none absolute inset-0 bg-black/30" />
      </motion.div>

       {/* Ambience badge */}
       <div className="pointer-events-none fixed left-6 top-6 z-30 select-none">
        <Glass className="px-4 py-2">
          <div className="text-xs uppercase tracking-wider text-white/70">Ambiance</div>
          <div className="text-base font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> {cur.label}
          </div>
        </Glass>
      </div>
      <WorkTimer minutes={activeTimer} onEnd={()=>setActiveTimer(null)} />

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
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-white/90">
                    <Sparkles className="h-5 w-5" />
                    <div className="text-lg font-semibold">Studio d'Inspiration</div>
                  </div>
                  <Pill onClick={() => setPanelOpen(false)} icon={<X className="h-4 w-4" />}>Fermer</Pill>
                </div>

                <Tabs defaultValue="ambience" className="w-full mt-4">
                  <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10">
                    <TabsTrigger value="ambience" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10"><Palette className="mr-2 h-4 w-4"/>Ambiance</TabsTrigger>
                    <TabsTrigger value="oria" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10"><MessageSquare className="mr-2 h-4 w-4"/>Inspiration</TabsTrigger>
                    <TabsTrigger value="notes" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10"><NotebookPen className="mr-2 h-4 w-4"/>Notes</TabsTrigger>
                    <TabsTrigger value="work" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10">🛠 Travail</TabsTrigger>
                  </TabsList>
                  <TabsContent value="ambience" className="mt-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-white/80">Changer d'ambiance</div>
                        <Pill onClick={toggleMute} icon={isMuted ? <Music className="h-4 w-4" /> : <Pause className="h-4 w-4" />}>
                            {isMuted ? "Son coupé" : "Son actif"}
                        </Pill>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4">
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
                  </TabsContent>
                  <TabsContent value="oria" className="mt-4 min-h-[300px] md:h-[30rem] md:max-h-[70vh]">
                    <OriaChatbot />
                  </TabsContent>
                  <TabsContent value="notes" className="mt-4">
                     <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                            <div className="space-y-2 max-h-40 overflow-auto pr-1 no-scrollbar">
                            {notes.length === 0 && <div className="text-white/60 text-sm">Aucune note.</div>}
                            {notes.map((n, i) => (
                                <div key={i} className="rounded-xl border border-white/15 bg-white/5 p-2 text-sm">{n}</div>
                            ))}
                            </div>
                        </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="work" className="mt-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <WorkTasks onStartTimer={(m)=>setActiveTimer(m)} />
                        <WorkBrief />
                      </div>
                  </TabsContent>
                </Tabs>
              </Glass>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
