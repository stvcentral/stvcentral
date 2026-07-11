"use client";

import { useEffect } from "react";

export default function AudioCoordinator() {
  useEffect(() => {
    function handlePlay(event) {
      const active = event.target;
      document.querySelectorAll("audio").forEach((audio) => {
        if (audio !== active && !audio.paused) {
          audio.pause();
        }
      });
    }

    const audios = Array.from(document.querySelectorAll("audio"));
    audios.forEach((audio) => audio.addEventListener("play", handlePlay));

    return () => {
      audios.forEach((audio) => audio.removeEventListener("play", handlePlay));
    };
  }, []);

  return null;
}
