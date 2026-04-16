"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

const TechOrbs = () => {
  const count = 15;
  const groupRef = useRef<THREE.Group>(null);
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const positions = useMemo(() => {
    return Array.from({ length: count }, () => [
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 5,
    ] as [number, number, number]);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Smoothly interpolate the group position based on scroll
    const targetY = scroll * 0.005;
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1);
    
    // Subtle rotation based on mouse or time
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.mouse.y * 0.2, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.mouse.x * 0.2, 0.05);
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#d12c2c" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {positions.map((pos, i) => (
        <Float
          key={i}
          speed={1.2} 
          rotationIntensity={1} 
          floatIntensity={1.5} 
          position={pos}
        >
          <Sphere args={[0.08 + Math.random() * 0.15, 32, 32]}>
            <MeshDistortMaterial
              color={i % 4 === 0 ? "#d12c2c" : "#111014"}
              roughness={0.1}
              metalness={1}
              distort={0.4}
              speed={2}
            />
          </Sphere>
        </Float>
      ))}

      <ContactLines scroll={scroll} />
    </group>
  );
};

const ContactLines = ({ scroll }: { scroll: number }) => {
    const linesRef = useRef<THREE.Group>(null);
    
    useFrame((state) => {
        if (!linesRef.current) return;
        linesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        // The grid moves up faster to create parallax
        linesRef.current.position.z = THREE.MathUtils.lerp(linesRef.current.position.z, scroll * 0.002, 0.1);
    });

    return (
        <group ref={linesRef}>
            <gridHelper args={[30, 30, "#d12c2c", "#111014"]} rotation={[Math.PI / 2, 0, 0]} opacity={0.1} transparent />
        </group>
    );
}

const ThreeHero = () => {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <React.Suspense fallback={null}>
          <TechOrbs />
          <Environment preset="city" />
        </React.Suspense>
      </Canvas>
    </div>
  );
};

export default ThreeHero;
