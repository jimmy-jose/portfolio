export const randomFacts = [
  'I love badminton—enough that I built Rival (rival-chi.vercel.app), a sports-club platform with player stats and an AI coaching assistant.',
  'I am a hardcore non-vegetarian. If the menu has meat, the decision tree gets much shorter.',
  'Politically, I lean left.',
  'I am a jack of all trades and master of some: mobile, backend, cloud, full stack and AI.',
  'I made a Gemini Gem from the MITC documents for all my credit cards, so I can ask questions based on the cards I actually have.',
  'I am involved with the IsThisAScamIndia community—a space for helping people make sense of suspicious things online.',
  'I am from Kerala, India, and I have spent about ten years building production software.',
  'My career started in mobile and expanded through product engineering, cloud, backend systems and AI infrastructure.',
  'I like owning products end to end: architecture, development, deployment and production.',
  'LoanLog, my Kotlin Multiplatform app for tracking money lent and borrowed, has crossed 1,000 installs.',
  'I built GarageLog because vehicle documents and reminders deserve a better home than scattered folders and memory.',
  'I built Iinspect to recommend credit cards from the way someone actually spends money.',
  'Go, Kotlin and Next.js are all in my toolbox. Picking the right one is part of the fun.',
  'A surprising number of my side projects begin with: “This is annoying. I could build something better.”',
] as const;

export function pickRandomFact(random: () => number = Math.random): string {
  const index = Math.floor(random() * randomFacts.length);
  return randomFacts[index] ?? randomFacts[0];
}
