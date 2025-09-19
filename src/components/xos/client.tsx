

'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';

import XosDock from '@/components/xos/dock';
import XosWindow from '@/components/xos/window';
import DesktopIcons from './desktop-icons';

import { useWindowManager } from '@/hooks/use-window-manager';
import { useAppLauncher } from '@/hooks/use-app-launcher';
import XosThemeSelector from './theme-selector';

export default function XosClient() {
    const searchParams = useSearchParams();
    const isInitialLoad = useRef(true);

    const { 
        windows, 
        openWindow, 
        closeWindow, 
        bringToFront, 
        toggleMinimize, 
        updateWindowPosition, 
        updateWindowSize,
        setWindows,
        isBooting,
    } = useWindowManager();
    
    const { launchAppFromUrl } = useAppLauncher(openWindow);

    // Initial boot sequence
    useEffect(() => {
        if (isInitialLoad.current && !isBooting) {
            isInitialLoad.current = false; // Ensure this runs only once
            
            // 1. Check for URL-based app launch
            const appToOpen = searchParams.get('open');
            const resultId = searchParams.get('resultId');
            
            if (appToOpen) {
                launchAppFromUrl(appToOpen, resultId);
                return; // Prioritize URL launch over session restore
            }

            // 2. Restore from saved session
            try {
                const savedStateJSON = localStorage.getItem('xosSession');
                if (savedStateJSON) {
                    const savedWindows = JSON.parse(savedStateJSON);
                    if (Array.isArray(savedWindows) && savedWindows.length > 0) {
                        setWindows(savedWindows);
                        return; // Restore successful
                    }
                }
            } catch (error) {
                console.error("Failed to load XOS session:", error);
                localStorage.removeItem('xosSession'); // Clear corrupted session
            }

            // 3. Open default app if no session and no URL launch
            openWindow('chat');
        }
    }, [isBooting, searchParams, launchAppFromUrl, setWindows, openWindow]);


    return (
        <div className="absolute inset-0" >
            <DesktopIcons isBooting={isBooting} onOpenApp={openWindow} />

            <XosThemeSelector />
            
            <AnimatePresence>
                {windows.map(win => (
                    <XosWindow
                        key={win.id}
                        instance={win}
                        onClose={() => closeWindow(win.id)}
                        onFocus={() => bringToFront(win.id)}
                        onMinimize={() => toggleMinimize(win.id)}
                        onDragStop={(e, d) => updateWindowPosition(win.id, { x: d.x, y: d.y })}
                        onResizeStop={(e, dir, ref, delta, pos) => updateWindowSize(win.id, {
                            width: ref.style.width,
                            height: ref.style.height,
                            ...pos,
                        })}
                    >
                        {win.component}
                    </XosWindow>
                ))}
            </AnimatePresence>
            
            <XosDock windows={windows} onDockItemClick={toggleMinimize} />
        </div>
    );
}
