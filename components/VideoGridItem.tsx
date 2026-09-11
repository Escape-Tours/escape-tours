// components/VideoGridItem.tsx
'use client';
import { useState } from 'react';
import { Play } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export function VideoGridItem({ videoUrl, thumbnail }: { videoUrl: string, thumbnail: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div
                onClick={() => setIsOpen(true)}
                className="relative group cursor-pointer aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-200"
            >
                {/* Thumbnail Image */}
                <img src={thumbnail} alt="Hotel Video" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

                {/* Overlay Play Button */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play size={24} className="text-black ml-1" fill="currentColor" />
                    </div>
                </div>
            </div>

            {/* The Big Viewing Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-5xl aspect-video p-0 overflow-hidden bg-black border-none rounded-xl">
                    <iframe
                        src={videoUrl}
                        className="w-full h-full"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}