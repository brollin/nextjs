// Returns the angular size of an object of a given radius at a certain distance away in degrees
// radius - stellar radii
// distance - astronomical units
export const angularSize = (radius: number, distance: number) =>
  (2 * Math.atan((radius / distance) * 0.00465047) * 180) / Math.PI;
