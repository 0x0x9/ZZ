
'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BarChart3 } from 'lucide-react';

type PerformanceData = {
    name: string;
    [key: string]: number | string;
};

interface PerformanceChartProps {
    data: PerformanceData[];
}

const colors = [
    'bg-primary',
    'bg-muted-foreground/50',
    'bg-muted-foreground/30',
];

export default function PerformanceChart({ data }: PerformanceChartProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    if (!data || data.length === 0) return null;

    const metrics = Object.keys(data[0]).filter(key => key !== 'name');
    const maxValue = Math.max(...data.flatMap(d => metrics.map(m => d[m] as number)));

    return (
        <Card className="glass-card w-full max-w-5xl mx-auto" ref={ref}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-6 w-6 text-primary" />
                    Comparatif de Performance
                </CardTitle>
                <CardDescription>Indice de performance (plus c'est élevé, mieux c'est). Base 100 = Mac Pro.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {metrics.map(metric => (
                        <div key={metric}>
                            <h3 className="font-semibold mb-3">{metric}</h3>
                            <div className="space-y-3">
                                {data.map((item, index) => {
                                    const value = item[metric] as number;
                                    const widthPercentage = (value / maxValue) * 100;
                                    return (
                                        <div key={item.name} className="flex items-center gap-4">
                                            <span className="w-48 text-sm text-muted-foreground text-right shrink-0">{item.name}</span>
                                            <div className="flex-1 bg-muted/30 rounded-full h-8 p-1">
                                                <motion.div
                                                    className={cn("h-full rounded-full flex items-center justify-end pr-3", colors[index % colors.length])}
                                                    initial={{ width: 0 }}
                                                    animate={isInView ? { width: `${widthPercentage}%` } : {}}
                                                    transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.2 * index }}
                                                >
                                                   <span className="font-bold text-sm text-white mix-blend-overlay">{value}</span>
                                                </motion.div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
