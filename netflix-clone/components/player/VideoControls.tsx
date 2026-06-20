"use client";

import { useCallback } from "react";
import { usePlayer, useMedia, useContainer } from "@videojs/react";
import type { Video as VideoMedia } from "@videojs/core";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Thumbnail {
  url: string;
  startTime: number;
  endTime: number;
}

interface VideoControlsProps {
  title: string;
  thumbnails?: Thumbnail[];
}

export default function VideoControls({ title }: VideoControlsProps) {
  const media = useMedia() as VideoMedia | null;
  const container = useContainer();

  const paused = usePlayer((s) => s.paused as boolean | undefined) ?? true;
  const currentTime =
    usePlayer((s) => s.currentTime as number | undefined) ?? 0;
  const duration = usePlayer((s) => s.duration as number | undefined) ?? 0;
  const volumeLevel = usePlayer((s) => s.volume as number | undefined) ?? 1;
  const muted = usePlayer((s) => s.muted as boolean | undefined) ?? false;
  const fullscreen =
    usePlayer((s) => s.fullscreen as boolean | undefined) ?? false;

  const togglePlay = useCallback(() => {
    if (!media) return;
    if (paused) {
      media.play();
    } else {
      media.pause();
    }
  }, [media, paused]);

  const seekBy = useCallback(
    (seconds: number) => {
      if (!media) return;
      media.currentTime = Math.max(
        0,
        Math.min(media.currentTime + seconds, duration),
      );
    },
    [media, duration],
  );

  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!media) return;
      media.currentTime = Number(e.target.value);
    },
    [media],
  );

  const handleVolume = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!media) return;
      const val = Number(e.target.value);
      media.volume = val;
      if (val > 0 && media.muted) media.muted = false;
    },
    [media],
  );

  const toggleMute = useCallback(() => {
    if (!media) return;
    media.muted = !media.muted;
  }, [media]);

  const toggleFullscreen = useCallback(() => {
    if (!container) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  }, [container]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0)
      return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="absolute inset-0 flex flex-col justify-between opacity-0 transition-opacity hover:opacity-100">
      {/* Title overlay */}
      <div className="bg-gradient-to-b from-black/60 to-transparent p-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>

      {/* Bottom controls */}
      <div className="bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-10">
        {/* Progress bar */}
        <div className="group relative mb-3 flex items-center">
          <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/30 group-hover:h-1.5">
            <div
              className="absolute left-0 top-0 h-full bg-brand-primary"
              style={{ width: `${progress}%` }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label="Seek"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Play / Pause */}
            <button
              type="button"
              onClick={togglePlay}
              className="text-white hover:text-gray-300"
              aria-label={paused ? "Play" : "Pause"}
            >
              {paused ? (
                <Play className="h-6 w-6" />
              ) : (
                <Pause className="h-6 w-6" />
              )}
            </button>

            {/* Skip back 10s */}
            <button
              type="button"
              onClick={() => seekBy(-10)}
              className="text-white hover:text-gray-300"
              aria-label="Skip back 10 seconds"
            >
              <SkipBack className="h-5 w-5" />
            </button>

            {/* Skip forward 10s */}
            <button
              type="button"
              onClick={() => seekBy(10)}
              className="text-white hover:text-gray-300"
              aria-label="Skip forward 10 seconds"
            >
              <SkipForward className="h-5 w-5" />
            </button>

            {/* Volume */}
            <div className="group/vol flex items-center gap-1">
              <button
                type="button"
                onClick={toggleMute}
                className="text-white hover:text-gray-300"
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted || volumeLevel === 0 ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volumeLevel}
                onChange={handleVolume}
                className={cn(
                  "h-1 w-0 cursor-pointer appearance-none rounded-full bg-white/30 transition-all group-hover/vol:w-20",
                )}
                aria-label="Volume"
              />
            </div>

            {/* Time display */}
            <span className="text-xs text-gray-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Fullscreen */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="text-white hover:text-gray-300"
              aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {fullscreen ? (
                <Minimize className="h-5 w-5" />
              ) : (
                <Maximize className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
