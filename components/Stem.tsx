import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Flower } from './Flower';

interface StemProps {
  config: {
    height: number;
    curvature: number;
    color: string;
    petalCount: number;
    seed: number;
    leafSize: number;
    leafAngleMin: number;
    leafAngleMax: number;
    branchAngleMin: number;
    branchAngleMax: number;
  };
  growth: number;
}

const Leaf = ({ position, rotation, scale, growth, index }: any) => {
    const groupRef = useRef<THREE.Group>(null);
    // Leaves unfold as the plant grows
    const s = scale * Math.min(1, growth * 2);

    // Base rotation derived from props
    const baseEuler = useMemo(() =>
        new THREE.Euler(rotation[0], rotation[1], rotation[2], 'YXZ'),
    [rotation]);

    // Leaf shape geometry
    const leafShape = useMemo(() => {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.bezierCurveTo(0.1, 0.1, 0.2, 0.4, 0, 0.8);
        shape.bezierCurveTo(-0.2, 0.4, -0.1, 0.1, 0, 0);
        return shape;
    }, []);

    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.elapsedTime;

        // Wind Simulation
        // 1. High frequency flutter (leaf vibrate)
        const flutter = Math.sin(t * 10 + index) * 0.02 * Math.max(0, Math.sin(t));
        // 2. Low frequency swell (wind gust pushing the leaf)
        const swell = Math.sin(t * 2 + position[1]) * 0.05;

        // Apply to inclination (x) and twist (z)
        groupRef.current.rotation.x = baseEuler.x + flutter + swell;
        groupRef.current.rotation.z = baseEuler.z + flutter * 0.5;
    });

    if (s < 0.01) return null;

    return (
        <group ref={groupRef} position={position} rotation={baseEuler} scale={[s, s, s]}>
            {/* Leaf stem connecting to main branch - extends outward from branch surface */}
            <mesh position={[0, 0.1, 0]} rotation={[0,0,0]} scale={[0.02, 0.2, 0.02]}>
                 <cylinderGeometry args={[0.5, 1, 1, 8]} />
                 <meshBasicMaterial color="#2d6a27" />
            </mesh>
            {/* Offset leaf geometry so it starts at top of leaf stem */}
            <mesh position={[0, 0.2, 0]} rotation={[0.5, 0, 0]}>
                <shapeGeometry args={[leafShape]} />
                <meshBasicMaterial color="#2d5a27" side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
}

const Branch = ({ position, azimuth, inclination, length, growth, delay, index, leafSize, leafAngleMin, leafAngleMax, curvature }: any) => {
    const inclinationGroupRef = useRef<THREE.Group>(null);

    // Branch growth logic: starts after 'delay' (relative to main growth)
    // Grows faster than main stem to catch up or just animates out
    const branchGrowth = Math.max(0, (growth - delay) * 4); // Speed multiplier
    const finalScale = Math.min(1, branchGrowth);

    // Create curved path for the branch using gravity effect
    const curve = useMemo(() => {
        const points = [];
        const segments = 16; // Enough segments for smooth curve

        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            // Gravity effect: bend increases quadratically with distance
            const bendAmount = curvature * t * t * 0.3;

            points.push(new THREE.Vector3(
                0,                      // X stays
                t * length,             // Y extension along branch
                bendAmount              // Z bends downward (towards ground)
            ));
        }

        return new THREE.CatmullRomCurve3(points);
    }, [length, curvature]);

    // Create tube geometry from curve
    const branchGeometry = useMemo(() => {
        return new THREE.TubeGeometry(
            curve,
            8,      // tubularSegments
            0.02,   // radius (similar to original cylinder)
            6,      // radialSegments
            false   // not closed
        );
    }, [curve]);

    useFrame((state) => {
        if (!inclinationGroupRef.current) return;
        const t = state.clock.elapsedTime;

        // Wind effect on branch inclination
        // Branches wave up and down slightly
        const windForce = Math.sin(t * 1.5 + index) * 0.05 + Math.sin(t * 0.5) * 0.02;

        inclinationGroupRef.current.rotation.x = inclination + windForce;
    });

    // Leaves on this branch
    const leaves = useMemo(() => {
        const items = [];
        const count = 3; // Leaves per branch
        for(let i=0; i<count; i++) {
            const t = 0.3 + (i / count) * 0.6; // Position along branch (0-1)

            // Get position and tangent on the curved branch
            const point = curve.getPoint(t);
            const tangent = curve.getTangent(t);

            // Randomize leaf orientation around the branch
            const leafAzimuth = (i * Math.PI * 0.8) + (index * 1.5);

            // Calculate opening angle range in radians
            const minRad = THREE.MathUtils.degToRad(leafAngleMin);
            const maxRad = THREE.MathUtils.degToRad(leafAngleMax);

            // Handle case where min > max gracefully
            const startAngle = Math.min(minRad, maxRad);
            const rangeAngle = Math.abs(maxRad - minRad);

            // Randomize opening angle (tilt from branch)
            const openingAngle = startAngle + Math.random() * rangeAngle;

            // Calculate rotation based on tangent direction
            // Create a quaternion from the tangent to orient leaves properly
            const up = new THREE.Vector3(0, 1, 0);
            const quaternion = new THREE.Quaternion().setFromUnitVectors(up, tangent);
            const euler = new THREE.Euler().setFromQuaternion(quaternion);

            items.push({
                position: [point.x, point.y, point.z], // Position on the curved branch
                // Rotation: [Tilt (Opening Angle), Azimuth around branch, Twist]
                rotation: [openingAngle, leafAzimuth, euler.z],
                // Scale based on randomness AND leafSize
                scale: (0.2 + Math.random() * 0.15) * leafSize,
                index: i
            });
        }
        return items;
    }, [curve, length, index, leafSize, leafAngleMin, leafAngleMax]);

    if (finalScale <= 0.01) return null;

    return (
        // 1. Position on the main stem
        <group position={position}>
            {/* 2. Azimuth: Rotate around the main stem (Y-axis) to face a direction */}
            <group rotation={[0, azimuth, 0]}>
                {/* 3. Inclination: Rotate "out" from the stem. 
                    Animated via ref for wind effects.
                */}
                <group ref={inclinationGroupRef} rotation={[inclination, 0, 0]}>
                     {/* 4. Growth Scale & Geometry */}
                    <group scale={[finalScale, finalScale, finalScale]}>
                         {/* The Branch Stick - Now using curved tube geometry */}
                        <mesh geometry={branchGeometry}>
                            <meshBasicMaterial color="#8B5A2B" />
                        </mesh>

                        {/* Leaves on the branch */}
                        {leaves.map((leaf: any, i: number) => (
                            <Leaf
                                key={i}
                                index={i + index * 10} // Unique index for phase variance
                                position={leaf.position}
                                rotation={leaf.rotation}
                                scale={leaf.scale}
                                growth={finalScale}
                            />
                        ))}
                    </group>
                </group>
            </group>
        </group>
    );
};

export const Stem: React.FC<StemProps> = ({ config, growth }) => {
  const height = config.height;
  const stemGroupRef = useRef<THREE.Group>(null);

  // Global wind sway for the main stem
  useFrame((state) => {
      if(!stemGroupRef.current) return;
      const t = state.clock.elapsedTime;
      
      // Combine two sine waves for a more natural, less monotonic sway
      // Sway primarily on Z (left/right) and slightly on X (forward/back)
      const windSwayZ = Math.sin(t * 0.8) * 0.03 + Math.sin(t * 0.3) * 0.02;
      const windSwayX = Math.cos(t * 0.7) * 0.015;

      stemGroupRef.current.rotation.z = windSwayZ;
      stemGroupRef.current.rotation.x = windSwayX;
  });

  // Generate branches along the main stem
  const branches = useMemo(() => {
    const branchItems = [];
    // Scale branch count with height
    const count = Math.max(5, Math.floor(height * 2)); 
    
    // Golden Angle for natural distribution
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~2.3999 rad

    for(let i=0; i<count; i++) {
        // Distribute branches along the height (from 15% to 60%)
        // Avoid top area to prevent clipping with flower
        const t = 0.15 + (i / count) * 0.45;

        // Use Golden Angle to distribute branches around the stem (0 to 2PI coverage)
        // Adding random noise to break perfect symmetry if needed, but golden angle is usually best for "all directions"
        const azimuth = (i * goldenAngle) + (config.seed % 10); 
        
        // Inclination (Branch Angle): 
        const minBranchRad = THREE.MathUtils.degToRad(config.branchAngleMin);
        const maxBranchRad = THREE.MathUtils.degToRad(config.branchAngleMax);
        const startBranchAngle = Math.min(minBranchRad, maxBranchRad);
        const rangeBranchAngle = Math.abs(maxBranchRad - minBranchRad);
        
        const inclination = startBranchAngle + (Math.random() * rangeBranchAngle);
        
        branchItems.push({
            relativeY: t,
            azimuth: azimuth,
            inclination: inclination,
            length: 0.5 + Math.random() * 0.6,
            index: i
        });
    }
    return branchItems;
  }, [height, config.seed, config.branchAngleMin, config.branchAngleMax]); 

  return (
    <group ref={stemGroupRef}>
        {/* Main Stem Cylinder */}
        <mesh
            position={[0, (height * growth) / 2, 0]}
            scale={[
                0.6 + 0.4 * growth, // Thickness grows
                growth,             // Height grows
                0.6 + 0.4 * growth
            ]}
        >
            <cylinderGeometry args={[0.04, 0.1, height, 16]} />
            <meshBasicMaterial color="#8B5A2B" />
        </mesh>

        {/* Branches attached to main stem */}
        {branches.map((b: any, i: number) => (
            <Branch
                key={i}
                position={[0, b.relativeY * height * growth, 0]}
                azimuth={b.azimuth}
                inclination={b.inclination}
                length={b.length}
                growth={growth}
                delay={b.relativeY * 0.7}
                index={b.index}
                leafSize={config.leafSize}
                leafAngleMin={config.leafAngleMin}
                leafAngleMax={config.leafAngleMax}
                curvature={config.curvature}
            />
        ))}

        {/* The Flower Head */}
        {/* Tilt the flower plane by rotating the container group */}
        <group position={[0, height * growth, 0]} rotation={[Math.PI / 5, 0, 0]}>
             <group scale={[Math.min(1, growth * 1.2), Math.min(1, growth * 1.2), Math.min(1, growth * 1.2)]}>
                <Flower
                    growth={growth}
                    color={config.color}
                    petalCount={config.petalCount}
                    gradientStart={config.petalGradientStart}
                    gradientEnd={config.petalGradientEnd}
                />
             </group>
        </group>
    </group>
  );
};