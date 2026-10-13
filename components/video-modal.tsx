"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title?: string;
}

export function VideoModal({
  isOpen,
  onClose,
  videoUrl,
  title = "Watch the Vision",
}: VideoModalProps) {
  if (!isOpen) return null;

  // Extracts YouTube Video ID from any link format and formats as a clean embed URL
  const getEmbedUrl = (rawUrl: string) => {
    if (!rawUrl) return "";

    let videoId = "";

    try {
      if (rawUrl.includes("youtu.be/")) {
        videoId = rawUrl.split("youtu.be/")[1]?.split("?")[0]?.split("&")[0];
      } else if (rawUrl.includes("youtube.com/watch")) {
        const urlParams = new URLSearchParams(rawUrl.split("?")[1]);
        videoId = urlParams.get("v") || "";
      } else if (rawUrl.includes("youtube.com/embed/")) {
        videoId = rawUrl.split("youtube.com/embed/")[1]?.split("?")[0]?.split("&")[0];
      } else if (rawUrl.includes("youtube.com/shorts/")) {
        videoId = rawUrl.split("youtube.com/shorts/")[1]?.split("?")[0]?.split("&")[0];
      }

      if (videoId) {
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
      }
    } catch (e) {
      console.error("Error parsing YouTube URL:", e);
    }

    return rawUrl;
  };

  const embedUrl = getEmbedUrl(videoUrl);
  const isDirectVideo = videoUrl.endsWith(".mp4") || videoUrl.endsWith(".webm");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        title={title}
        className="max-w-4xl border-none bg-black p-0 overflow-hidden rounded-2xl shadow-2xl"
      >
        <div className="relative aspect-video w-full bg-black">
          {isDirectVideo ? (
            <video
              src={embedUrl}
              controls
              autoPlay
              className="h-full w-full object-cover"
            />
          ) : (
            <iframe
              src={embedUrl}
              title={title}
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}