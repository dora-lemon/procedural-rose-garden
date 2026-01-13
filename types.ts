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