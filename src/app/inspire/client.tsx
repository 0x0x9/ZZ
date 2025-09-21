

'use client';

import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { Music, Pause, X, NotebookPen, Sparkles, ArrowLeft, MessageSquare, Palette, Image as ImageIconLucide } from "lucide-react";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


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
  {
    id: "rainy_apartment" as const,
    label: "Appartement Pluvieux",
    videoId: "-5_NiRTS2nE",
    desc: "Pluie contre la vitre, ambiance cosy et introspective.",
  },
];
type AmbienceId = typeof AMBIENCES[number]['id'];

function OriaSiriOrbPro({
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
  const blobControls = [useAnimationControls(), useAnimationControls(), useAnimationControls()];

  useEffect(() => {
    const commonOptions = { repeat: Infinity, ease: "easeInOut" };
    const animations = {
      idle: [
        { scale: [1, 1.05, 1], rotate: 360, transition: { ...commonOptions, duration: 8 } },
        { scale: [1, 0.95, 1], rotate: -360, transition: { ...commonOptions, duration: 11 } },
        { scale: [1, 1.02, 1], rotate: 360, transition: { ...commonOptions, duration: 13 } }
      ],
      active: [
        { scale: [1, 1.1, 1], rotate: 360, transition: { ...commonOptions, duration: 5 } },
        { scale: [1, 0.9, 1], rotate: -360, transition: { ...commonOptions, duration: 7 } },
        { scale: [1, 1.05, 1], rotate: 360, transition: { ...commonOptions, duration: 9 } }
      ],
      thinking: [
        { scale: [1, 1.15, 1], rotate: 360, transition: { ...commonOptions, duration: 3 } },
        { scale: [1, 0.85, 1], rotate: -360, transition: { ...commonOptions, duration: 4 } },
        { scale: [1, 1.1, 1], rotate: 360, transition: { ...commonOptions, duration: 5 } }
      ],
      speaking: [
        { scale: [1, 1.2, 1], rotate: 360, transition: { ...commonOptions, duration: 2 } },
        { scale: [1, 0.8, 1], rotate: -360, transition: { ...commonOptions, duration: 3 } },
        { scale: [1, 1.1, 1], rotate: 360, transition: { ...commonOptions, duration: 4 } }
      ]
    };

    animations[state].forEach((anim, i) => blobControls[i].start(anim));

  }, [state, blobControls]);
  
  return (
    <div
      className={cn("relative select-none", className)}
      style={{ width: size, height: size }}
      aria-label="Oria — état visuel"
    >
      <div className="absolute inset-0 rounded-full" style={{ filter: 'blur(20px)' }}>
        <motion.div
            className="absolute w-[70%] h-[70%] top-[15%] left-[15%] rounded-full opacity-70"
            style={{
                background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
                mixBlendMode: 'screen',
            }}
            animate={blobControls[0]}
        />
        <motion.div
            className="absolute w-[60%] h-[60%] top-[30%] left-[5%] rounded-full opacity-70"
            style={{
                background: "radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)",
                mixBlendMode: 'screen',
            }}
            animate={blobControls[1]}
        />
         <motion.div
            className="absolute w-[65%] h-[65%] top-[10%] left-[35%] rounded-full opacity-70"
            style={{
                background: "radial-gradient(circle, #E84F8E 0%, transparent 70%)",
                mixBlendMode: 'screen',
            }}
            animate={blobControls[2]}
        />
      </div>
      
       {/* Anneau verre */}
      <motion.div
        className="absolute inset-0 rounded-full border backdrop-blur-2xl"
        style={{
          borderColor: "rgba(255,255,255,0.28)",
          boxShadow: "0 18px 70px rgba(0,0,0,0.35), inset 0 0 1px rgba(255,255,255,0.3)"
        }}
      />
    </div>
  );
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


// Real AI Chatbot function
const getInspirationalMessage = async (prompt: string) => {
    const response = await fetch('/api/generateInspiration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "L'IA n'a pas pu répondre.");
    }
    const result = await response.json();
    return result.inspiration;
}

type Task = { id: string; title: string; done: boolean; eta: 15|30|60; createdAt: number };

function useLocalState<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(initial);
  useEffect(() => { try { const raw = localStorage.getItem(key); if (raw) setV(JSON.parse(raw)); } catch {} }, [key]);
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, setV] as const;
}

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

function OriaChatbot() {
    const [messages, setMessages] = useLocalState<{type: 'user' | 'ai', text: string}[]>("xinspire.messages", []);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);
    useEffect(() => { if (scrollAreaRef.current) scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight; }, [messages, isLoading]);

    const inspirationalQuotes = [
        "La créativité, c'est l'intelligence qui s'amuse. - Albert Einstein",
        "Le seul moyen de faire du bon travail est d'aimer ce que vous faites. - Steve Jobs",
        "La logique vous mènera d'un point A à un point B. L'imagination vous mènera partout. - Albert Einstein",
        "Pour créer, il faut une grande solitude. - Pablo Picasso",
        "N'attendez pas l'inspiration. Poursuivez-la avec une massue. - Jack London"
    ];
    
    const randomQuote = useMemo(() => inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)], []);

    if (!mounted) return null;
  
    const handleSend = async () => {
      if (!input.trim()) return;
      const newMessages = [...messages, { type: 'user' as const, text: input }];
      setMessages(newMessages);
      setInput('');
      setIsLoading(true);
      try {
        const aiResponse = await getInspirationalMessage(input);
        setMessages(prev => [...prev, { type: 'ai' as const, text: aiResponse }]);
      } catch {
        setMessages(prev => [...prev, { type: 'ai' as const, text: "Désolé, je suis un peu à court d'inspiration pour le moment." }]);
      } finally {
        setIsLoading(false);
      }
    };
    
    const oriaState = isLoading ? "thinking" : (input ? "active" : "idle");
  
    return (
      <div className="flex flex-col h-full space-y-4">
        {/* Header */}
        <div className="p-4 flex flex-col items-center gap-4 transition-all duration-300">
            <OriaSiriOrbPro size={96} state={oriaState} />
            <div className="text-center">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={oriaState}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.2 }}
                        className="text-base text-white/80 min-h-[40px]"
                    >
                         {isLoading
                          ? "Je façonne une piste pour toi…"
                          : input
                          ? "On affine. Dis-moi ce que tu veux ressentir."
                          : messages.length === 0 
                          ? `"${randomQuote}"`
                          : "Je suis là. Décris-moi une ambiance, un besoin, un rythme."}
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>

        {/* Messages */}
        <div ref={scrollAreaRef} className="flex-1 space-y-4 overflow-y-auto px-4 no-scrollbar">
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
                      className="max-w-[90%] rounded-xl px-4 py-3 bg-white/15 backdrop-blur-xl"
                  >
                     <div className="flex gap-1 items-center">
                         <span className="h-2 w-2 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                         <span className="h-2 w-2 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                         <span className="h-2 w-2 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                     </div>
                  </motion.div>
              </div>
          )}
        </div>
  
        {/* Entrée */}
        <div className="relative p-4">
            <div className={cn(
                "absolute inset-x-2 -top-2 h-1/2 bg-gradient-to-t from-transparent transition-all duration-500",
                isLoading ? "to-primary/20 blur-xl" : "to-transparent blur-none"
            )} />
            <Textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Décrivez votre idée, le ressenti, la contrainte…"
                rows={1}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 flex-1 resize-none pr-12 text-base"
            />
             <Button 
                onClick={handleSend} disabled={isLoading} 
                className="absolute right-6 top-1/2 -translate-y-1/2" 
                size="icon" 
                variant="ghost"
            >
                <MessageSquare className="h-5 w-5" />
            </Button>
        </div>
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
  const [notes, setNotes] = useLocalState<string[]>("xinspire.notes", []);
  const playerRef = useRef<any>(null);
  const [activeTimer, setActiveTimer] = useState<number|null>(null);

  const cur = useMemo(() => AMBIENCES.find(a => a.id === ambience)!, [ambience]);

  const handleFirstInteraction = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setIsMuted(false);
      // Explicitly try to play the video if the player is ready
      if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
        playerRef.current.unMute();
        playerRef.current.playVideo();
      }
    }
  }, [hasInteracted]);
  
   const handleAmbienceChange = (newAmbienceId: AmbienceId) => {
        handleFirstInteraction();
        if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
            playerRef.current.loadVideoById(AMBIENCES.find(a => a.id === newAmbienceId)!.videoId);
        }
        setAmbience(newAmbienceId);
    };

  useEffect(() => {
    if (!mounted) return;

    const onPlayerReady = (event: any) => {
        if (!isMuted) {
            event.target.unMute();
            event.target.playVideo();
        } else {
            event.target.mute();
            // Still try to play, but it will be muted. Browsers are more lenient with muted autoplay.
            event.target.playVideo();
        }
    };
  
    const createPlayer = (videoId: string) => {
      if (!(window as any).YT) return;
       if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
      playerRef.current = new (window as any).YT.Player('youtube-player', {
        width: '100%',
        height: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          loop: 1,
          playlist: videoId,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
          playsinline: 1
        },
        events: {
          onReady: onPlayerReady,
        }
      });
    }

    if (typeof (window as any).YT === 'undefined' || typeof (window as any).YT.Player === 'undefined') {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        (window as any).onYouTubeIframeAPIReady = () => createPlayer(cur.videoId);
    } else {
        createPlayer(cur.videoId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur.videoId, mounted]);

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
      if (lastAmb && AMBIENCES.some(a => a.id === lastAmb)) {
        setAmbience(lastAmb as AmbienceId);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("xinspire.ambience", ambience);
    } catch {}
  }, [ambience]);

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
                  <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
                    <TabsTrigger value="ambience" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10"><Palette className="mr-2 h-4 w-4"/>Ambiance</TabsTrigger>
                    <TabsTrigger value="oria" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10"><MessageSquare className="mr-2 h-4 w-4"/>Inspiration</TabsTrigger>
                    <TabsTrigger value="work" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10">🛠 Travail</TabsTrigger>
                  </TabsList>
                  <TabsContent value="ambience" className="mt-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-white/80">Changer d'ambiance</div>
                        <Pill onClick={toggleMute} icon={isMuted ? <Music className="h-4 w-4" /> : <Pause className="h-4 w-4" />}>
                            {isMuted ? "Son coupé" : "Son actif"}
                        </Pill>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-5">
                      {AMBIENCES.map(a => (
                        <button
                          key={a.id}
                          onClick={() => handleAmbienceChange(a.id)}
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
       <WorkTimer minutes={activeTimer} onEnd={()=>setActiveTimer(null)} />
    </div>
  );
}
