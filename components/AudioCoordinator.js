"use client";

import { useEffect } from "react";

export default function AudioCoordinator() {
  useEffect(() => {
    function stopOtherPlayers(event) {
      const activePlayer = event.target;

      if (!(activePlayer instanceof HTMLMediaElement)) {
        return;
      }

      document.querySelectorAll("audio, video").forEach((player) => {
        if (player !== activePlayer && !player.paused) {
          player.pause();
        }
      });
    }

    // "play" does not bubble normally, so capture it at document level.
    document.addEventListener("play", stopOtherPlayers, true);

    return () => {
      document.removeEventListener("play", stopOtherPlayers, true);
    };
  }, []);

  return null;
}
