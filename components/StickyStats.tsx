"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Mountain, Clock, Map } from 'lucide-react';

interface StatsProps {
    duration: string;
    difficulty: string;
    altitude: string;
    bestTime: string;
}

export default function StickyStats({ duration, difficulty, altitude, bestTime }: StatsProps) {
    const [isVisible, setIsVisible] = useState(false);

    // Show bar only after scrolling past the hero section
    useEffect(() => {
        const handleScroll = () => setIsVisible(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const stats = [
        { icon: <Clock size={18} />, label: 'Duration', value: duration },
        { icon: <Mountain size={18} />, label: 'Difficulty', value: difficulty },
        { icon: <Map size={18} />, label: 'Max Altitude', value: altitude },
        { icon: <Calendar size={18} />, label: 'Best Time', value: bestTime },
    ];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    exit={{ y: -100 }}
                    className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-md py-4"
                >
                    <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                        <div className="font-bold text-lg hidden md:block">Trip Essentials</div>
                        <div className="flex gap-8">
                            {stats.map((stat, i) => (
                                <div key={i} className="flex items-center gap-2 text-gray-700">
                                    <div className="text-orange-500">{stat.icon}</div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">{stat.label}</p>
                                        <p className="text-sm font-bold">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}