import Country from "@/modules/capitalizer/models/Country";

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

const MIN_FONT_SIZE = 0.15;
const MAX_FONT_SIZE = 0.8;
const FONT_SIZE_FACTOR = 0.08;
export const countryLabelFontSize = (country: Country) =>
  Math.min(Math.max(country.width * FONT_SIZE_FACTOR, MIN_FONT_SIZE), MAX_FONT_SIZE);

const MIN_CAPITAL_OFFSET_SIZE = 0.15;
const MAX_CAPITAL_OFFSET_SIZE = 0.8;
const CAPITAL_OFFSET_FACTOR = 0.03;
export const capitalLabelOffset = (country: Country) => {
  const { capitalCoordinates, centerCoordinates, width } = country;

  if (!capitalCoordinates) return MAX_CAPITAL_OFFSET_SIZE;

  const direction = centerCoordinates.lat > capitalCoordinates.lat ? -1.5 : 1;

  return (
    direction * Math.min(Math.max(width * CAPITAL_OFFSET_FACTOR, MIN_CAPITAL_OFFSET_SIZE), MAX_CAPITAL_OFFSET_SIZE)
  );
};

export const COUNTRY_BASE_Z = 0;
export const TEXT_BASE_Z = 0.225;
export const CAPITAL_BASE_Z = COUNTRY_BASE_Z + 0.01;
