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
  leafAngleMin: number;
  leafAngleMax: number;
  branchAngleMin: number;
  branchAngleMax: number;
}