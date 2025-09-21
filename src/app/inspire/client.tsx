

'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Pause, X, NotebookPen, Sparkles, ArrowLeft, MessageSquare, Palette, Image as ImageIcon } from "lucide-react";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";

const OriaAnimation = dynamic(() => import("@/components/ui/oria-animation"), { ssr: false });


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

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const newMessages: {type: 'user' | 'ai', text: string}[] = [...messages, { type: 'user', text: input }];
        setMessages(newMessages);
        const currentInput = input;
        setInput('');
        setIsLoading(true);
        try {
            const aiResponse = await getInspirationalMessage(currentInput, newMessages);
            setMessages(prev => [...prev, { type: 'ai', text: aiResponse }]);
        } catch (error) {
            setMessages(prev => [...prev, { type: 'ai', text: "Désolé, je suis un peu à court d'inspiration pour le moment." }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!mounted) return null;

    return (
        <div className="flex flex-col h-full space-y-4">
             <div ref={scrollAreaRef} className="flex-1 space-y-4 overflow-y-auto pr-2 -mr-2 no-scrollbar">
                {messages.length === 0 && !isLoading && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <OriaAnimation className="w-20 h-20 mb-4" />
                        <p className="text-white/80">Je suis Oria, votre muse.
                            <br />Que puis-je faire pour vous inspirer ?</p>
                    </div>
                )}
                {messages.map((msg, i) => (
                    <div key={i} className={cn("flex", msg.type === 'user' ? "justify-end" : "justify-start")}>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }} 
                            className={cn("max-w-[90%] rounded-xl px-4 py-2", msg.type === 'user' ? "bg-primary/80 text-white" : "bg-white/15")}
                        >
                            {msg.text}
                        </motion.div>
                    </div>
                ))}
                 {isLoading && <div className="text-center text-white/70">...</div>}
            </div>
            <div className="flex gap-2">
                <Textarea 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder="Discuter avec Oria..." 
                    rows={1} 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 flex-1 resize-none" 
                />
                <Button onClick={handleSend} disabled={isLoading} variant="secondary">Envoyer</Button>
            </div>
        </div>
    )
}

export default function XInspireEnvironment() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  
  const [ambience, setAmbience] = useState<AmbienceId>("forest");
  const [panelOpen, setPanelOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  const playerRef = useRef<any>(null);


  const cur = useMemo(() => AMBIENCES.find(a => a.id === ambience)!, [ambience]);

  useEffect(() => {
    function createPlayer() {
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
      document.head.appendChild(tag);
      (window as any).onYouTubeIframeAPIReady = () => {
        if (!playerRef.current) createPlayer();
      };
      return;
    }

    if (!playerRef.current) {
      createPlayer();
    } else {
      try {
        playerRef.current.loadPlaylist({ listType: 'playlist', playlist: [cur.videoId], index: 0 });
        if (hasInteracted && !isMuted) playerRef.current.unMute();
        else playerRef.current.mute();
        playerRef.current.playVideo();
      } catch {
        try { playerRef.current.destroy?.(); } catch {}
        playerRef.current = null;
        createPlayer();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur.videoId]);


  const handleFirstInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!hasInteracted) return handleFirstInteraction();
    setIsMuted(m => {
        const newMuted = !m;
        if (playerRef.current) {
            if (newMuted) playerRef.current.mute();
            else playerRef.current.unMute();
        }
        return newMuted;
    });
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
        <div id="youtube-player" className="absolute w-full h-full scale-[1.8] object-cover" style={{ pointerEvents: 'none' }} />
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
                    <TabsTrigger value="notes" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10"><NotebookPen className="mr-2 h-4 w-4"/>Notes</TabsTrigger>
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
                  <TabsContent value="oria" className="mt-4 min-h-[300px] md:h-80">
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
                </Tabs>
              </Glass>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
