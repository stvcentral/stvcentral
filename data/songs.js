export const songs = [
  {
    id: "STV-SNG-001",
    slug: "2voices1fire",
    title: "2 Voices, 1 Fire",
    suit: "Hearts",
    cardNumber: 3,
    bpm: 133,
    musicalKey: "G♯ minor",
    duration: "4:34",
    artwork: "/media/2voices1fire.webp",
    audio: "/media/2voices1fire.mp3",
    why:
      "A song about two singers who challenge each other without becoming enemies—competition transformed into growth, brotherhood, and a stronger shared performance.",
    lyrics: [
      {
        section: "Verse 1",
        lines: [
          "Started out in the bars, just a mic in my hand",
          "Testing my limits, doing more than I planned",
          "Every high note I hit, I could hear you respond",
          "Two singers collided, from challenge we bond"
        ]
      },
      {
        section: "Chorus 1",
        lines: [
          "When you sing, I rise with you",
          "Every shout (shout) (shout) cuts the silence through",
          "It’s not a fight, it’s how we grow",
          "Two voices, one fire, and we both know",
          "We’re better when we’re singin’ together"
        ]
      },
      {
        section: "Verse 2",
        lines: [
          "You’ve got the grit of a rocker, the strength in your tone",
          "Pushing the edge, never standing alone",
          "I throw it higher, you answer it strong",
          "We both keep on climbing, that’s where we belong"
        ]
      },
      {
        section: "Chorus 2",
        lines: [
          "When you sing, I rise with you",
          "Every shout cuts the silence through",
          "It’s not a fight, it’s how we grow",
          "Two voices, one fire, and we both know",
          "We are better when we’re singin’ together"
        ]
      },
      {
        section: "Verse 3",
        lines: [
          "Like rivals in training, we sharpen the steel",
          "The harder we push, the more real it feels",
          "Not enemies standing on opposite sides",
          "Brothers in music, and that’s where the pride lies"
        ]
      },
      {
        section: "Bridge",
        lines: [
          "No envy, no crown, just the will to improve",
          "Every challenge we throw keeps us locked in the groove",
          "It’s not about winning, it’s about what we bring",
          "The power’s in the moment, in the way that we sing"
        ]
      },
      {
        section: "Final Chorus",
        lines: [
          "When you sing, I rise with you",
          "Every shout (shout) (shout) cuts the silence through",
          "It’s not a fight, it’s how we grow",
          "Two voices, one fire, and we both know",
          "We’re better when we’re singin’ together",
          "Yeah, better when we’re singin’ together"
        ]
      }
    ]
  }
];

export function getSong(slug) {
  return songs.find((song) => song.slug === slug);
}
