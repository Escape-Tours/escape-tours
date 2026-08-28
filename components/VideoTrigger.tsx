'use client';
import { useState } from 'react';
import { Play } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export function VideoTrigger({ videoUrl }: { videoUrl: string }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-semibold hover:bg-amber-500 hover:text-black transition-all shadow-lg">
                <Play size={16} fill="currentColor" /> Watch Video
            </button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-5xl aspect-video p-0 overflow-hidden bg-black border-none rounded-xl">
                    <iframe src={videoUrl} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
                </DialogContent>
            </Dialog>
        </>
    );
}