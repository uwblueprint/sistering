export type EmojiInfo = {
  name: string;
  emoji: string;
  description: string;
  uses?: string[];
};

export const EMOJIS: EmojiInfo[] = [
  {
    name: "Smiley face",
    emoji: "ð",
    description: "The simplest smiley face emoji :).",
    uses: [
      "possible passive aggression",
      "said you're fine but actually dead inside",
      "customer service",
    ],
  },
  {
    name: "Scream",
    emoji: "ðą",
    description: "Emoji holding their face and screaming.",
    uses: ["AAAAAAAAAAAAA", "broke main", "exams"],
  },
  {
    name: "Skull",
    emoji: "ð",
    description: "Just a skull.",
    uses: ["aaaaaaa", "laughter(?)"],
  },
  {
    name: "Train station",
    emoji: "ð",
    description: "Train stationed at a train stop.",
    uses: ["we love public transit", "please stand clear of the doors"],
  },
  {
    name: "Clown",
    emoji: "ðĪĄ",
    description: "A clown face.",
    uses: ["oh no", "did something dumb", "broke main again"],
  },
  {
    name: "Zany",
    emoji: "ðĪŠ",
    description: "A silly face with wide eyes and tongue stuck out.",
    uses: ["git push main --force", "dynamic typing"],
  },
  {
    name: "Thinking",
    emoji: "ðĪ",
    description: "Emoji thinking hard, stroking chin with raised eyebrow.",
    uses: ["hmmmmmmmmmmmmmmm", "why my code not working"],
  },
  {
    name: "Blushing smiley face",
    emoji: "ð",
    description: "A blushing smiley face, with eyes closed.",
    uses: ["genuine happiness or something"],
  },
  {
    name: "ððð",
    emoji: "ððð",
    description: "A face. Two eyes and a mouth.",
    uses: ["it is what it is"],
  },
];
