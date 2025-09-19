
'use client';

import OriaXOS from '@/components/oria-xos';
import type { WindowInstance } from '@/hooks/use-window-manager';

export default function OriaWindow({ openApp }: { openApp: (appId: string, props?: Record<string, any>) => void }) {
    return (
        <div className="h-full w-full bg-transparent overflow-y-auto no-scrollbar">
           <OriaXOS openApp={openApp} />
        </div>
    );
}
