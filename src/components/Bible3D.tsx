
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, PresentationControls, Html, Text } from '@react-three/drei';
import { Mesh, Group } from 'three';

interface BibleModelProps {
  color?: string;
  scale?: number;
  position?: [number, number, number];
  interactive?: boolean;
}

const BibleModel: React.FC<BibleModelProps> = ({ 
  color = '#1D1D1F',
  scale = 2, 
  position = [0, 0, 0],
  interactive = true
}) => {
  const groupRef = useRef<Group>(null);
  const coverRef = useRef<Mesh>(null);
  const pagesRef = useRef<Mesh>(null);
  const spineRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (groupRef.current && interactive) {
      // Subtle breathing animation
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={[0.1, 0.2, 0]}>
      {/* Bible back cover - more refined material */}
      <mesh ref={coverRef} castShadow receiveShadow position={[0, 0, -0.12]}>
        <boxGeometry args={[1.2, 1.6, 0.05]} />
        <meshPhysicalMaterial 
          color={color} 
          roughness={0.5} 
          metalness={0.1}
          clearcoat={0.5}
          clearcoatRoughness={0.3}
          reflectivity={0.2}
        />
      </mesh>

      {/* Bible front cover - with consistent material */}
      <mesh castShadow receiveShadow position={[0, 0, 0.12]}>
        <boxGeometry args={[1.2, 1.6, 0.05]} />
        <meshPhysicalMaterial 
          color={color} 
          roughness={0.5} 
          metalness={0.1}
          clearcoat={0.5}
          clearcoatRoughness={0.3}
          reflectivity={0.2}
        />
      </mesh>
      
      {/* Pages - more refined white pages */}
      <mesh ref={pagesRef} position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.15, 1.55, 0.22]} />
        <meshStandardMaterial 
          color="#F5F5F7" 
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>

      {/* Spine - with consistent material */}
      <mesh ref={spineRef} position={[-0.6, 0, 0]} rotation={[0, Math.PI/2, 0]} castShadow>
        <boxGeometry args={[0.24, 1.6, 0.05]} />
        <meshPhysicalMaterial 
          color={color} 
          roughness={0.5} 
          metalness={0.1}
          clearcoat={0.5}
          clearcoatRoughness={0.3}
          reflectivity={0.2}
        />
      </mesh>
      
      {/* Title on front cover - more elegant typography */}
      <Text
        position={[0, 0.2, 0.151]}
        rotation={[0, 0, 0]}
        fontSize={0.08}
        color="#F5F5F7"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/sfprotext/v1/i7dPIFl3byGNHa3xM56-WkJUQUq7.woff"
        letterSpacing={0.05}
      >
        HOLY BIBLE
      </Text>

      {/* Title on spine - with matching typography */}
      <Text
        position={[-0.6, 0, 0.026]}
        rotation={[0, Math.PI/2, Math.PI/2]}
        fontSize={0.05}
        color="#F5F5F7"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/sfprotext/v1/i7dPIFl3byGNHa3xM56-WkJUQUq7.woff"
        letterSpacing={0.05}
      >
        HOLY BIBLE
      </Text>

      {/* Page edges detail - subtle texture */}
      <mesh position={[0.58, 0, 0]} castShadow>
        <boxGeometry args={[0.02, 1.55, 0.22]} />
        <meshStandardMaterial 
          color="#F5F5F7" 
          roughness={0.9}
        />
      </mesh>
    </group>
  );
};

interface Bible3DProps {
  size?: 'sm' | 'md' | 'lg';
  autoRotate?: boolean;
  interactive?: boolean;
  showControls?: boolean;
  className?: string;
}

const Bible3D: React.FC<Bible3DProps> = ({ 
  size = 'md',
  autoRotate = false,
  interactive = true,
  showControls = false,
  className = ''
}) => {
  const sizeScale = size === 'sm' ? 1.5 : size === 'lg' ? 3 : 2;
  const containerClasses = `relative ${className}`;
  
  return (
    <div className={containerClasses} style={{ height: `${sizeScale * 200}px` }}>
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 35 }} 
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <spotLight 
          position={[-5, 5, 5]} 
          intensity={0.8} 
          penumbra={1} 
          angle={0.6}
          castShadow
        />
        
        {interactive ? (
          <PresentationControls
            global
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
            config={{ mass: 1, tension: 170, friction: 26 }}
            snap={{ mass: 2, tension: 300 }}
          >
            <BibleModel interactive={true} scale={sizeScale} />
          </PresentationControls>
        ) : (
          <BibleModel interactive={false} scale={sizeScale} />
        )}
        
        {showControls && <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />}
      </Canvas>
    </div>
  );
};

export default Bible3D;
