import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface FlowerProps {
  growth: number; // 0 to 1
  color: string;
  petalCount?: number;
  gradientStart: string;
  gradientEnd: string;
}

interface PetalProps {
  index: number;
  total: number;
  growth: number;
  color: string;
  gradientStart: string;
  gradientEnd: string;
}

// Helper function to create gradient texture using Canvas API
const createGradientTexture = (startColor: string, endColor: string): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Create linear gradient (bottom to top = base to tip)
    const gradient = ctx.createLinearGradient(0, 128, 0, 0);
    gradient.addColorStop(0, startColor);  // Base
    gradient.addColorStop(1, endColor);    // Tip

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    return new THREE.CanvasTexture(canvas);
};

const Petal: React.FC<PetalProps> = ({ index, total, growth, color, gradientStart, gradientEnd }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Radial distribution (Circle)
  const angle = (index / total) * Math.PI * 2;
  const radius = 0.2; 
  
  // Minimal Y offset to prevent Z-fighting, but essentially planar
  const y = index * 0.0005;

  // Memoize random values to prevent jitter (wind effect) on re-renders
  const { scaleBase, maxAngle } = useMemo(() => {
    return {
        scaleBase: 0.25 + Math.random() * 0.05,
        maxAngle: (Math.PI / 2.5) - (Math.random() * 0.15)  // ~72 degrees, more open
    };
  }, []);

  // Generate gradient texture
  const gradientTexture = useMemo(() =>
    createGradientTexture(gradientStart, gradientEnd),
    [gradientStart, gradientEnd]
  );
  
  useFrame(() => {
    if (groupRef.current) {
      // Bloom animation logic
      const activationThreshold = (index / total) * 0.2; 
      const unfolding = Math.min(1, Math.max(0, (growth - 0.2 - activationThreshold) * 2));
      
      const finalScale = scaleBase * Math.min(1, growth * 1.5);
      groupRef.current.scale.set(finalScale, finalScale, finalScale);
      
      // Rotate out as it blooms to form a flat flower.
      // 0 = Vertical (Bud)
      // Math.PI / 2 = Horizontal (Flat Bloom)
      groupRef.current.rotation.x = unfolding * maxAngle;
    }
  });

  return (
    // Position in a circle
    // Rotate Y so the petal points OUTWARDS from the center
    <group 
        rotation={[0, -angle + Math.PI / 2, 0]} 
        position={[Math.cos(angle) * radius, y, Math.sin(angle) * radius]}
    >
        {/* Pivot Group: The pivot point is (0,0,0) of this group. */}
        <group ref={groupRef}>
             {/* 
                CircleGeometry is in XY plane. 
                We shift it up by 1 (radius) so the pivot is at the bottom edge.
             */}
            <mesh position={[0, 1, 0]}>
                <circleGeometry args={[1, 32]} />
                <meshBasicMaterial
                    map={gradientTexture}
                    side={THREE.DoubleSide}
                    transparent
                    opacity={0.95}
                    depthWrite={false}
                />
            </mesh>
        </group>
    </group>
  );
};

export const Flower: React.FC<FlowerProps> = ({ growth, color, petalCount = 25, gradientStart, gradientEnd }) => {
  // Create an array of indices
  const petals = useMemo(() => Array.from({ length: petalCount }, (_, i) => i), [petalCount]);

  return (
    <group>
        {/* Center Bud / Stamen area - slightly larger for the ring style */}
        <mesh scale={[0.25 * growth, 0.15 * growth, 0.25 * growth]} position={[0, 0, 0]}>
            <sphereGeometry args={[1, 32, 16]} />
            <meshBasicMaterial color="#ffcc00" />
        </mesh>
        
        {/* Petals */}
        {petals.map((i) => (
            <Petal
                key={i}
                index={i}
                total={petalCount}
                growth={growth}
                color={color}
                gradientStart={gradientStart}
                gradientEnd={gradientEnd}
            />
        ))}
    </group>
  );
};