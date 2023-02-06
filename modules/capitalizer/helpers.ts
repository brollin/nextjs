/**
 * Shuffles an array in place.
 */
export const shuffleArray = (a: any[]) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
};

export const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[\s'\-&]/g, "");

export const doesTextRoughlyMatch = (text1: string, text2: string) => normalizeText(text1) === normalizeText(text2);
