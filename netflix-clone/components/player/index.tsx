"use client";

import { createPlayer, Container } from "@videojs/react";
import { Video, videoFeatures } from "@videojs/react/video";
import VideoControls from "@/components/player/VideoControls";

interface Thumbnail {
  url: string;
  startTime: number;
  endTime: number;
}

interface MyPlayerProps {
  src: string;
  title: string;
  thumbnails?: Thumbnail[];
}

const Player = createPlayer({ features: videoFeatures });

export default function MyPlayer({ src, title, thumbnails }: MyPlayerProps) {
  return (
    <Player.Provider>
      <Container className="relative h-screen w-full bg-black">
        <Video
          src={src}
          autoPlay
          muted
          className="h-full w-full object-contain"
        />
        <VideoControls title={title} thumbnails={thumbnails} />
      </Container>
    </Player.Provider>
  );
}
