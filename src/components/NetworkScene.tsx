import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const languages = [
  // Top level (1 block)
  { name: 'Python', color: '#3776ab', position: [0, 1.2, 0] as [number, number, number] },
  // Second level (2 blocks)
  { name: 'Java', color: '#f89820', position: [-0.7, 0.4, 0] as [number, number, number] },
  { name: 'C++', color: '#00599c', position: [0.7, 0.4, 0] as [number, number, number] },
  // Third level (3 blocks)
  { name: 'JS', color: '#f7df1e', position: [-1.2, -0.4, 0] as [number, number, number] },
  { name: 'React', color: '#61dafb', position: [0, -0.4, 0] as [number, number, number] },
  { name: 'Flask', color: '#ffffff', position: [1.2, -0.4, 0] as [number, number, number] },
];

function LanguageBlock({ name, color, position }: { name: string; color: string; position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.1;
    }
  });

  return (
    <group position={position}>
      <RoundedBox ref={meshRef} args={[0.9, 0.6, 0.4]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </RoundedBox>
      <Text
        position={[0, 0, 0.25]}
        fontSize={0.18}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPw.woff"
      >
        {name}
      </Text>
    </group>
  );
}

function LanguagePyramid() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {languages.map((lang, index) => (
        <LanguageBlock key={index} {...lang} />
      ))}
    </group>
  );
}

function NetworkNodes() {
  const groupRef = useRef<THREE.Group>(null);
  
  const nodes = useMemo(() => {
    const positions: [number, number, number][] = [
      [2.5, 1.5, -1],
      [3, 0.5, -0.5],
      [-2.5, 1.2, -0.8],
      [2.8, -0.8, -0.5],
      [-2.8, -0.5, -1],
      [-3, 0.8, -0.5],
    ];
    return positions;
  }, []);

  const connections = useMemo(() => {
    const lines: [number, number][] = [
      [0, 1], [1, 3], [2, 5], [4, 5],
    ];
    return lines;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    connections.forEach(([start, end]) => {
      points.push(new THREE.Vector3(...nodes[start]));
      points.push(new THREE.Vector3(...nodes[end]));
    });
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [nodes, connections]);

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.2} />
      </lineSegments>
      
      {nodes.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color="#67e8f9" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -5, 5]} intensity={0.4} color="#22d3ee" />
      
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <LanguagePyramid />
      </Float>
      
      <NetworkNodes />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate={false}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 2.5}
      />
    </>
  );
}

export default function NetworkScene() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ background: 'transparent' }}
          dpr={[1, 2]}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
