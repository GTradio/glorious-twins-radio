const clamp = (min: number, input: number, max: number): number => {
  return Math.max(min, Math.min(input, max));
};

const mapRange = (
  inMin: number,
  inMax: number,
  input: number,
  outMin: number,
  outMax: number
): number => {
  return ((input - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

const lerp = (start: number, end: number, amt: number): number => {
  return (1 - amt) * start + amt * end;
};

const truncate = (value: number, decimals: number): number => {
  return parseFloat(value.toFixed(decimals));
};

const convertPxToRem = (px: number): string => {
  const rem = String(px / 16);

  return `${rem}rem`;
};

const scrollProgress = (scroll: number, limit: number): number => {
  return scroll / limit;
};

export { lerp, clamp, mapRange, truncate, convertPxToRem, scrollProgress };
