
'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FolderOpen, X, MessageSquare, CheckSquare, BookOpen, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Input } from './ui/input';

type WindowType = 'chat' | 'brief' | 'tasks' | 'render';
type ProjectWindow = {
  id: string;
  type: WindowType;
  title: string;
  snapshot?: string;      // dataURL image / objectURL
  meta?: Record<string, any>;
  updatedAt: number;
};

type Project = {
  id: string;
  name: string;
  color?: string;
  windows: ProjectWindow[];
  createdAt: number;
  updatedAt: number;
};

function useLocalState<T>(key: string, initial: T) {
  const [v, setV] = React.useState<T>(initial);
  React.useEffect(() => { try { const raw = localStorage.getItem(key); if (raw) setV(JSON.parse(raw)); } catch {} }, [key]);
  React.useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, setV] as const;
}
const uid = () => (crypto?.randomUUID?.() ?? `id_${Date.now()}_${Math.random()}`);

export function ProjectDock({
  open,
  onOpenChange,
  onJump,            // (target: 'chat'|'work'|'brief'|'tasks'|'ambience', payload?: any)=>void
  currentAmbienceId, // pour snapshot auto
}: {
  open: boolean;
  onOpenChange: (v:boolean)=>void;
  onJump: (target: 'chat'|'work'|'brief'|'tasks'|'ambience', payload?: any)=>void;
  currentAmbienceId?: string;
}) {
  const [projects, setProjects] = useLocalState<Project[]>("xinspire.projects", []);
  const [filter, setFilter] = React.useState<'recent'|'alpha'>('recent');
  const [creating, setCreating] = React.useState(false);
  const [name, setName] = React.useState('');

  const sorted = React.useMemo(()=>{
    const arr = [...projects];
    if (filter==='alpha') arr.sort((a,b)=>a.name.localeCompare(b.name));
    else arr.sort((a,b)=>b.updatedAt - a.updatedAt);
    return arr;
  }, [projects, filter]);

  const createProject = () => {
    const n = name.trim() || "Nouveau projet";
    const p: Project = { id: uid(), name: n, color: '#87CEFA', windows: [], createdAt: Date.now(), updatedAt: Date.now() };
    setProjects(ps=>[p, ...ps]); setName(''); setCreating(false);
  };

  const addWindow = (pid: string, w: Omit<ProjectWindow,'id'|'updatedAt'>) => {
    setProjects(ps=>ps.map(p=>{
      if (p.id!==pid) return p;
      const nw = { ...w, id: uid(), updatedAt: Date.now() };
      return { ...p, windows: [nw, ...p.windows].slice(0, 30), updatedAt: Date.now() };
    }));
  };

  const removeWindow = (pid: string, wid: string) => {
    setProjects(ps=>ps.map(p=> p.id===pid ? { ...p, windows: p.windows.filter(w=>w.id!==wid), updatedAt: Date.now() } : p));
  };

  const quickCapture = (pid: string) => {
    // Petit snapshot logique des contenus existants (sans canvas capture) :
    addWindow(pid, {
      type: 'brief',
      title: 'Snapshot brief + ambiance',
      meta: {
        ambience: currentAmbienceId,
        brief: {
          title: localStorage.getItem("xinspire.brief.title"),
          why:   localStorage.getItem("xinspire.brief.why"),
          how:   localStorage.getItem("xinspire.brief.how"),
          first: localStorage.getItem("xinspire.brief.first"),
        }
      }
    });
  };

  const handleUpload = (pid: string, files: FileList | null) => {
    if (!files?.length) return;
    Array.from(files).slice(0,4).forEach(file=>{
      const url = URL.createObjectURL(file);
      addWindow(pid, { type:'render', title: file.name, snapshot: url });
    });
  };

  return (
    <>
      {/* Bouton flottant (ouvrir/fermer dock) */}
      <button
        onClick={()=>onOpenChange(!open)}
        className={cn(
          "fixed left-4 top-1/2 -translate-y-1/2 z-40 rounded-2xl border bg-white/10 border-white/20 backdrop-blur-xl shadow-lg",
          "px-3 py-2 hover:bg-white/15 transition-colors"
        )}
        aria-label="Ouvrir dock projets"
      >
        <FolderOpen className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -360, opacity: 0 }}
            transition={{ type:'spring', stiffness: 240, damping: 30 }}
            className="fixed left-0 top-0 h-full w-[340px] z-40"
          >
             <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl border-r border-white/15 shadow-2xl overflow-hidden">
                <div className="absolute -right-24 top-20 w-72 h-72 rounded-full blur-3xl opacity-30"
                    style={{ background: 'radial-gradient(circle at center, #7dd3fc 0%, transparent 70%)' }}/>
                <div className="absolute -right-16 top-72 w-56 h-56 rounded-full blur-3xl opacity-20"
                    style={{ background: 'radial-gradient(circle at center, #e879f9 0%, transparent 70%)' }}/>
            </div>
            
            <div className="relative h-full flex flex-col text-white">
              {/* Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{background: 'radial-gradient(closest-side, #8ED0FF, transparent)'}}/>
                  <span className="font-semibold text-lg">Projets</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={filter}
                    onChange={e=>setFilter(e.target.value as any)}
                    className="text-xs bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-white/50"
                  >
                    <option value="recent">Récent</option>
                    <option value="alpha">A-Z</option>
                  </select>
                  <Button onClick={()=>onOpenChange(false)} size="icon" variant="ghost" className="w-8 h-8 rounded-lg hover:bg-white/10"><X className="w-4 h-4"/></Button>
                </div>
              </div>

              {/* Create */}
              <div className="px-4 mb-2">
                {!creating ? (
                  <button
                    onClick={()=>setCreating(true)}
                    className="w-full flex items-center justify-center gap-2 text-sm rounded-xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 py-3 transition-colors"
                  >
                    <Plus className="w-4 h-4"/> Nouveau projet
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      autoFocus
                      className="flex-1 bg-white/10 border-white/20 rounded-xl px-3 py-2 text-sm outline-none h-auto"
                      placeholder="Nom du projet"
                      value={name}
                      onChange={e=>setName(e.target.value)}
                      onKeyDown={e=>e.key==='Enter' && createProject()}
                    />
                    <Button onClick={createProject} size="sm" variant="secondary">Créer</Button>
                    <Button onClick={()=>{setCreating(false); setName('');}} size="sm" variant="ghost">Annuler</Button>
                  </div>
                )}
              </div>

              {/* List */}
              <div className="flex-1 mt-2 overflow-y-auto no-scrollbar px-4 pb-6 space-y-3">
                {sorted.map(p=>(
                  <div key={p.id} className="group/project rounded-2xl border border-white/15 bg-white/5 p-1 transition-all duration-300 hover:border-white/30 hover:bg-white/10">
                    <div className="p-3 pb-2 flex items-center justify-between">
                      <div className="font-medium text-base">{p.name}</div>
                      <div className="flex items-center gap-2 opacity-0 group-hover/project:opacity-100 transition-opacity">
                        <button
                          onClick={()=>quickCapture(p.id)}
                          className="text-xs underline opacity-80 hover:opacity-100">
                          Snapshot
                        </button>
                        <label className="text-xs underline opacity-80 hover:opacity-100 cursor-pointer">
                          Ajouter
                          <input type="file" accept="image/*" multiple hidden onChange={e=>handleUpload(p.id, e.target.files)} />
                        </label>
                      </div>
                    </div>

                    <div className="px-3 pb-2 flex flex-wrap gap-2">
                      <DockLink icon={<MessageSquare className="w-3.5 h-3.5"/>} onClick={()=>onJump('chat')}>Oria</DockLink>
                      <DockLink icon={<CheckSquare className="w-3.5 h-3.5"/>} onClick={()=>onJump('tasks')}>Tâches</DockLink>
                      <DockLink icon={<BookOpen className="w-3.5 h-3.5"/>} onClick={()=>onJump('brief')}>Brief</DockLink>
                      <DockLink icon={<LinkIcon className="w-3.5 h-3.5"/>} onClick={()=>onJump('ambience', { id: currentAmbienceId })}>Ambiance</DockLink>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-2">
                      {p.windows.map(w=>(
                        <button
                          key={w.id}
                          onClick={()=>{
                            if (w.type==='chat') onJump('chat');
                            else if (w.type==='tasks') onJump('tasks');
                            else if (w.type==='brief') onJump('brief');
                          }}
                          className="group/window rounded-xl border border-white/15 bg-white/5 overflow-hidden text-left hover:border-white/30"
                          title={w.title}
                        >
                          <div className="relative aspect-video bg-black/30">
                            {w.snapshot ? (
                              <img src={w.snapshot} alt="" className="w-full h-full object-cover opacity-90 group-hover/window:opacity-100 transition-opacity"/>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/60">
                                {w.type==='render' ? <ImageIcon className="w-5 h-5"/> :
                                 w.type==='chat'   ? <MessageSquare className="w-5 h-5"/> :
                                 w.type==='tasks'  ? <CheckSquare className="w-5 h-5"/> :
                                                     <BookOpen className="w-5 h-5"/>}
                              </div>
                            )}
                            <button
                              onClick={(e)=>{ e.stopPropagation(); removeWindow(p.id, w.id); }}
                              className="absolute top-1 right-1 p-1 rounded-md bg-black/40 hover:bg-black/60 opacity-0 group-hover/window:opacity-100 transition-opacity">
                              <X className="w-3 h-3"/>
                            </button>
                          </div>
                          <div className="px-2 py-1 text-xs opacity-90 truncate">{w.title}</div>
                        </button>
                      ))}
                      {p.windows.length===0 && (
                        <div className="col-span-2 text-center text-xs text-white/60 py-3">
                          Aucune fenêtre/snapshot pour l’instant.
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {sorted.length===0 && (
                  <div className="text-center text-white/70 text-sm py-8">
                    Créez votre premier projet pour regrouper brief, tâches, Oria et rendus.
                  </div>
                )}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function DockLink({ children, icon, onClick }: { children: React.ReactNode; icon: React.ReactNode; onClick: ()=>void }) {
  return (
    <button
      onClick={onClick}
      className="text-xs rounded-full border border-white/20 bg-white/10 hover:bg-white/15 px-2 py-1 flex items-center gap-1.5"
    >
      {icon}{children}
    </button>
  );
}
