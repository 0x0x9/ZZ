
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Product } from '@/lib/products';

// Helper function to safely access localStorage
const getFromLocalStorage = (key: string, defaultValue: any) => {
    if (typeof window === 'undefined') {
        return defaultValue;
    }
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

const setToLocalStorage = (key: string, value: any) => {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
    }
};

type ProductHeaderState = {
    product: Product | null;
    price: number | null;
    onAddToCart: (() => void) | null;
}

interface UIStateContextType {
    isBannerVisible: boolean;
    setBannerVisible: (isVisible: boolean) => void;
    isAnimatedBg: boolean;
    setAnimatedBg: (isAnimated: boolean) => void;
    accentColor: string;
    setAccentColor: (color: string) => void;
    productHeaderState: ProductHeaderState;
    setProductHeaderState: (state: Partial<ProductHeaderState> | null) => void;
}

const UIStateContext = createContext<UIStateContextType | undefined>(undefined);

export function UIStateProvider({ children }: { children: ReactNode }) {
    const [isBannerVisible, setBannerVisible] = useState(
        () => getFromLocalStorage('isBannerVisible', true)
    );
    const [isAnimatedBg, setAnimatedBg] = useState(
        () => getFromLocalStorage('isAnimatedBg', true)
    );
     const [accentColor, setAccentColor] = useState(
        () => getFromLocalStorage('accentColor', '217 91% 60%')
    );
    const [productHeaderState, setProductHeaderStateInternal] = useState<ProductHeaderState>({
        product: null,
        price: null,
        onAddToCart: null,
    });

    const setProductHeaderState = (newState: Partial<ProductHeaderState> | null) => {
        if (newState === null) {
             setProductHeaderStateInternal({ product: null, price: null, onAddToCart: null });
        } else {
            setProductHeaderStateInternal(prevState => ({...prevState, ...newState}));
        }
    }


    useEffect(() => {
        setToLocalStorage('isBannerVisible', isBannerVisible);
    }, [isBannerVisible]);
    
    useEffect(() => {
        setToLocalStorage('isAnimatedBg', isAnimatedBg);
    }, [isAnimatedBg]);

    useEffect(() => {
        setToLocalStorage('accentColor', accentColor);
    }, [accentColor]);


    return (
        <UIStateContext.Provider value={{ isBannerVisible, setBannerVisible, isAnimatedBg, setAnimatedBg, accentColor, setAccentColor, productHeaderState, setProductHeaderState }}>
            {children}
        </UIStateContext.Provider>
    );
}

export function useUIState() {
    const context = useContext(UIStateContext);
    if (context === undefined) {
        throw new Error('useUIState must be used within a UIStateProvider');
    }
    return context;
}
