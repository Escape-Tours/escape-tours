    "use client";
    import { Dialog, DialogContent } from "@/components/ui/dialog";

    interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoUrl: string; // E.g., "https://www.youtube.com/embed/YOUR_VIDEO_ID"
    }

    export function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl p-0 bg-black border-none overflow-hidden rounded-2xl aspect-video">
            <iframe
            className="w-full h-full"
            src={`${videoUrl}?autoplay=1`}
            title="Lodge Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            />
        </DialogContent>
        </Dialog>
    );
    }