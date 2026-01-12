# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a procedural flower garden visualization built with React, Three.js, and React Three Fiber. The application generates unique 3D botanical structures using Fibonacci spiral algorithms and flat-shaded illustrative rendering. Users can customize various plant parameters and regenerate flowers with different seeds.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Setup

The application uses a `.env.local` file for environment variables. The only required variable is:
- `GEMINI_API_KEY` - Used for potential AI integration (currently referenced but may not be actively used)

Environment variables are injected via Vite's define mechanism in `vite.config.ts`.

## Architecture

### Component Hierarchy

```
App.tsx (Main UI + State Management)
├── Experience.tsx (3D Canvas Setup)
    └── PlantController (Animation State)
        └── Stem.tsx (Main Stem + Branches)
            ├── Branch (Recursive Branch Component)
            │   └── Leaf (Individual Leaf with Wind)
            └── Flower.tsx (Flower Head)
                └── Petal (Individual Petal Components)
```

### Key Design Patterns

**Procedural Generation**
- Uses Fibonacci spiral (`Math.PI * (3 - Math.sqrt(5))`) for natural distribution of branches around the stem
- Random values are memoized to prevent re-render jitter
- Seed-based generation: changing the seed parameter creates completely different plants

**Animation System**
- Growth animation: All components accept a `growth` parameter (0-1) that scales geometry
- Sequential activation: Lower branches grow before upper ones via delay mechanisms
- Wind simulation: `useFrame` hooks animate rotations with combined sine waves for natural movement

**Geometry Composition**
- Main stem: Single cylinder with variable thickness (tapered: 0.04 at top, 0.1 at base)
- Branches: Distributed along 15%-85% of stem height using golden angle spacing
- Leaves: Created with `THREE.Shape` and bezier curves for organic form
- Flower: Radial petal arrangement with individual pivot points for blooming animation

### Coordinate System & Transformations

Important: The codebase uses a specific transformation hierarchy:
1. **Main Stem**: Grows upward on Y-axis, wind sway applied at root
2. **Branches**: Three-level transformation hierarchy:
   - Position along stem Y
   - Azimuth rotation (around stem Y-axis)
   - Inclination rotation (angle from stem)
3. **Leaves**: Attached to branches with customizable angles
4. **Flower**: Positioned at stem tip, tilted `Math.PI / 5` for aesthetic angle

### Material & Rendering

- All meshes use `meshBasicMaterial` for flat, illustrative style (no lighting calculations)
- `THREE.NoToneMapping` for consistent colors
- Flowers use `DoubleSide` rendering and `depthWrite: false` for petal layering
- Background is CSS color `#87CEEB` (sky blue)

## Configuration Parameters (App.tsx State)

- `seed`: Timestamp for procedural generation (changed via "Regenerate" button)
- `petalCount`: 5-100, number of petals in flower head
- `stemLength`: 2-8, main stem height
- `leafSize`: 0.1-3, multiplier for leaf scale
- `leafAngleMin`/`leafAngleMax`: 0-90°, leaf opening angle range from branches
- `branchAngleMin`/`branchAngleMax`: 10-120°, branch inclination range from stem

## TypeScript Configuration

- Path alias: `@/*` maps to project root
- `experimentalDecorators: true` for compatibility
- `useDefineForClassFields: false` for React Three Fiber compatibility
- JSX: `react-jsx` (automatic runtime)

## Important Constraints

**Memoization is Critical**: Random values used in procedural generation must be memoized with `useMemo`. Failing to do this causes geometry to jitter on every frame when wind animations run.

**Growth-Dependent Rendering**: Many components conditionally render (`return null`) when scale/growth is below 0.01 to prevent rendering invisible objects.

**Angle Ranges**: When working with angle ranges, the code handles cases where min > max gracefully by using `Math.min()` and `Math.abs()` for range calculations.

## Styling

- UI uses Tailwind CSS utility classes
- Glass-morphism panels with `backdrop-blur` and semi-transparent backgrounds
- Font: `Times New Roman, serif` for headings to match botanical theme
- Emerald green color palette for UI controls
