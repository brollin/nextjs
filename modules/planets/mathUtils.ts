/**
 * Computes the angular size of an object
 *
 * @param {number} radius radius of object (stellar radii)
 * @param {number} distance distance of object from viewer (astronomical units)
 * @returns {number} angular size (degrees)
 */
export const angularSize = (radius: number, distance: number): number =>
  (2 * Math.atan((radius / distance) * 0.00465047) * 180) / Math.PI;

/**
 * Computes a linearly interpolated value
 *
 * @param {number} x
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
export const lerp = (x: number, x1: number, y1: number, x2: number, y2: number) => {
  return y1 + ((y2 - y1) / (x2 - x1)) * (x - x1);
};

/**
 * Computes a linearly interpolated value, bounded by x1 and x2
 *
 * @param {number} x
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
export const boundedLerp = (x: number, x1: number, y1: number, x2: number, y2: number) => {
  if (x < x1) return y1;
  if (x > x2) return y2;
  return lerp(x, x1, y1, x2, y2);
};
