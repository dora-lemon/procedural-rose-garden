import React, { useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Stem } from './Stem';
import { PlantConfig } from '../types';
import * as THREE from 'three';

interface ExperienceProps {
  seed: number;
  petalCount: number;
  stemLength: number;
  leafSize: number;
  leafScaleNearFlower: number;
  leafAngleMin: number;
  leafAngleMax: number;
  branchAngleMin: number;
  branchAngleMax: number;
  curvature: number;
  selectedLeafId?: string;
  onLeafClick?: (leafId: string) => void;
  leafConfigs?: Record<string, any>;
}

const PlantController = ({
    seed,
    petalCount,
    stemLength,
    leafSize,
    leafScaleNearFlower,
    leafAngleMin,
    leafAngleMax,
    branchAngleMin,
    branchAngleMax,
    curvature,
    selectedLeafId,
    onLeafClick,
    leafConfigs
}: {
    seed: number,
    petalCount: number,
    stemLength: number,
    leafSize: number,
    leafScaleNearFlower: number,
    leafAngleMin: number,
    leafAngleMax: number,
    branchAngleMin: number,
    branchAngleMax: number,
    curvature: number,
    selectedLeafId?: string,
    onLeafClick?: (leafId: string) => void,
    leafConfigs?: Record<string, any>
}) => {
    const [growth, setGrowth] = useState(0);
    const [config, setConfig] = useState<PlantConfig | null>(null);

    useEffect(() => {
        setGrowth(0);
    }, [seed]);

    useEffect(() => {
        setConfig({
            id: `plant-${seed}`,
            seed: seed,
            height: stemLength,
            curvature: curvature,
            petalCount: petalCount,
            color: '#fffff0',
            petalGradientStart: '#ff69b4', // Default, will be overridden by random colors
            petalGradientEnd: '#ffffff',   // Default, will be overridden by random colors
            leafSize: leafSize,
            leafScaleNearFlower: leafScaleNearFlower,
            leafAngleMin: leafAngleMin,
            leafAngleMax: leafAngleMax,
            branchAngleMin: branchAngleMin,
            branchAngleMax: branchAngleMax,
        });

    }, [seed, petalCount, stemLength, leafSize, leafScaleNearFlower, leafAngleMin, leafAngleMax, branchAngleMin, branchAngleMax, curvature]);

    useFrame((state, delta) => {
        if (growth < 1) {
            setGrowth(g => Math.min(1, g + delta * 0.2));
        }
    });

    if (!config) return null;

    return (
        <group>
            <Stem
                config={config}
                growth={growth}
                selectedLeafId={selectedLeafId}
                onLeafClick={onLeafClick}
                leafConfigs={leafConfigs}
            />

            <group position={[0, -0.01, 0]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                    <circleGeometry args={[1.5, 32]} />
                    <meshBasicMaterial color="#558b2f" />
                </mesh>

                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
                    <circleGeometry args={[20, 64]} />
                    <meshBasicMaterial color="#8d6e63" />
                </mesh>
            </group>
        </group>
    );
};

export const Experience: React.FC<ExperienceProps> = (props) => {
  return (
    <div className="w-full h-full relative">
      <Canvas 
        dpr={[1, 2]} 
        gl={{ 
            antialias: true,
            toneMapping: THREE.NoToneMapping
        }}
        camera={{ position: [0, 3, 8], fov: 40 }}
      >
        <OrbitControls 
            enablePan={false} 
            maxPolarAngle={Math.PI / 2 - 0.05} 
            minDistance={2}
            maxDistance={12}
            makeDefault
        />
        
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 5]} intensity={1} />

        <Suspense fallback={null}>
            <PlantController {...props} />
        </Suspense>

      </Canvas>
    </div>
  );
};