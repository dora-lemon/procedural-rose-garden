export interface PlantConfig {
  id: string;
  seed: number;
  height: number;
  curvature: number;
  petalCount: number;
  color: string;
  petalGradientStart: string;  // Color at petal base
  petalGradientEnd: string;    // Color at petal tip
  leafSize: number;
  leafScaleNearFlower: number;
  leafAngleMin: number;
  leafAngleMax: number;
  branchAngleMin: number;
  branchAngleMax: number;
}

export interface LeafConfig {
  id: string;                  // Unique identifier for the leaf
  branchIndex: number;         // Which branch this leaf belongs to
  leafIndex: number;           // Which leaf on the branch
  size: number;                // Individual size multiplier
  angle: number;               // Opening angle in radians
  color: string;               // Leaf color
}

// Flower color palettes for randomization
export const flowerColorPalettes = [
  { start: '#ff69b4', end: '#ffffff' },  // Hot pink to white
  { start: '#ff1493', end: '#ffb6c1' },  // Deep pink to light pink
  { start: '#ff4500', end: '#ffd700' },  // Orange red to gold
  { start: '#ff6347', end: '#ffe4b5' },  // Tomato to moccasin
  { start: '#dc143c', end: '#ff69b4' },  // Crimson to hot pink
  { start: '#9400d3', end: '#e6e6fa' },  // Dark violet to lavender
  { start: '#8a2be2', end: '#dda0dd' },  // Blue violet to plum
  { start: '#4169e1', end: '#87ceeb' },  // Royal blue to sky blue
  { start: '#ff00ff', end: '#ffffff' },  // Magenta to white
  { start: '#ffff00', end: '#fffacd' },  // Yellow to lemon chiffon
  { start: '#ffd700', end: '#ffffe0' },  // Gold to light yellow
  { start: '#c71585', end: '#ffb6c1' },  // Medium violet red to light pink
  { start: '#db7093', end: '#fff0f5' },  // Pale violet red to lavender blush
  { start: '#ff007f', end: '#ff69b4' },  // Bright pink to hot pink
  { start: '#e9967a', end: '#ffdab9' },  // Dark salmon to peach puff
];

// Helper function to get random flower colors
export function getRandomFlowerColors(seed: number) {
  const index = Math.floor(Math.abs(Math.sin(seed)) * flowerColorPalettes.length);
  return flowerColorPalettes[index];
}