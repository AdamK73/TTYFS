// /components/AvatarScene.tsx
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, useTexture, useGLTF } from '@react-three/drei';
import { Physics, useSphere } from '@react-three/cannon';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { userProfile, Aspect } from './dummy_info';
import * as THREE from 'three';
import { Heart, Briefcase, Star, Coins, BabyCarriage, TextAa } from '@phosphor-icons/react';

interface AvatarProps {
  blurAmount: number;
  userPicture: string;
}

const Avatar: React.FC<AvatarProps> = ({ blurAmount, userPicture }) => (
  <mesh position={[0, 0, 0]}>
    <circleGeometry args={[2, 32]} />
    <meshBasicMaterial transparent opacity={0}>
      <Html center>
        <div
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            overflow: 'hidden',
            filter: `blur(${blurAmount}px)`,
            border: '5px solid white',
          }}
        >
          <img
            src={userPicture}
            alt="Avatar"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </Html>
    </meshBasicMaterial>
  </mesh>
);

const iconMap = {
  Health: Heart,
  Career: Briefcase,
  Family: BabyCarriage,
  Finance: Coins,
  PersonalGrowth: Star,
  Education: TextAa,
};

interface AspectProps {
  aspect: Aspect;
  aspectSizeFactor: number;
  orbitSpeed: number;
}

const AspectMesh: React.FC<AspectProps> = ({ aspect, aspectSizeFactor, orbitSpeed }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: [Math.random() * 6 - 3, Math.random() * 6 - 3, 0],
    args: [0.3],
  }));

  useFrame(() => {
    if (meshRef.current) {
      const t = performance.now() * 0.001 * orbitSpeed;
      const radius = 3;
      const x = radius * Math.cos(t);
      const y = radius * Math.sin(t);
      api.position.set(x, y, 0);
    }
  });

  const aspectSize = 0.3 + aspect.importance * aspectSizeFactor;
  const Icon = iconMap[aspect.name as keyof typeof iconMap];

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setActive(!active)}
    >
      <sphereGeometry args={[aspectSize, 32, 32]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'black'} />
      <Html distanceFactor={10}>
        <div style={{ fontSize: aspectSize * 20, color: 'white' }}>
          <Icon />
        </div>
      </Html>
    </mesh>
  );
};

interface AvatarSceneProps {
  currentYear: number;
  aspectSizeFactor?: number;
  orbitSpeed?: number;
}

export const AvatarScene: React.FC<AvatarSceneProps> = ({ currentYear, aspectSizeFactor = 1, orbitSpeed = 0.01 }) => {
  const [aspects, setAspects] = useState<Aspect[]>([]);
  const [userPicture, setUserPicture] = useState<string>('');
  const [blurAmount, setBlurAmount] = useState(0);

  useEffect(() => {
    const age = currentYear - userProfile.birthYear;
    const currentLifeStage = userProfile.lifeStages.find(
      (stage) => age >= stage.startAge && age <= stage.endAge
    );
    setAspects(currentLifeStage?.aspects || []);

    if (age <= 20) setUserPicture(userProfile.pictures.young);
    else if (age <= 40) setUserPicture(userProfile.pictures.adult);
    else if (age <= 60) setUserPicture(userProfile.pictures.middleAged);
    else setUserPicture(userProfile.pictures.senior);

    const blurStart = userProfile.lifeExpectancy - 20;
    if (age > blurStart) {
      const maxBlur = 10;
      const blurRange = userProfile.lifeExpectancy - blurStart;
      const blurProgress = Math.min(age - blurStart, blurRange) / blurRange;
      setBlurAmount(blurProgress * maxBlur);
    } else {
      setBlurAmount(0);
    }
  }, [currentYear]);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        <Physics gravity={[0, 0, 0]}>
          <Avatar blurAmount={blurAmount} userPicture={userPicture} />
          {aspects.map((aspect, index) => (
            <AspectMesh
              key={aspect.id}
              aspect={aspect}
              aspectSizeFactor={aspectSizeFactor}
              orbitSpeed={orbitSpeed}
            />
          ))}
        </Physics>
        <EffectComposer>
          <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
