"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTheme } from "./ThemeContext";
import * as THREE from "three";

// --- CONFIGURATION ---
const COUNT_SOLO = 100; // Visible Dust
const COUNT_DUAL = 15; // Sparse, tiny hearts
const COUNT_FIRE = 150; // Dense Inferno (Locked)
const COUNT_MULTI = 80; // Warp Tunnel (Locked)

// --- COLORS ---
const COLORS = {
  gold: "#d4af37",
  pink: "#ff3399",
  fireRed: "#dc2626",
  fireOrange: "#ea580c",
  cyan: "#00f0ff",
  violet: "#7c3aed",
  white: "#ffffff",
  deepSpace: "#020010",
};

export default function ParticleFx({
  mode = "ambient",
  vector = "none",
  forceCinematic = null,
  forceTheme = null,
}) {
  const { theme: globalTheme, isCinematic: globalCinematic } = useTheme();

  const activeCinematic =
    forceCinematic !== null ? forceCinematic : globalCinematic;
  const activeTheme = forceTheme !== null ? forceTheme : globalTheme;

  const primaryColor = COLORS[activeTheme] || COLORS.gold;

  // 1. Secondary Color Logic
  let secondaryColor;
  if (activeCinematic) {
    secondaryColor = COLORS.violet;
  } else {
    if (vector === "duet") secondaryColor = COLORS.fireOrange;
    else if (vector === "dual") secondaryColor = COLORS.pink;
    else secondaryColor = COLORS.white;
  }

  if (vector === "duet" && activeCinematic) {
    secondaryColor = COLORS.violet;
  }

  // 2. Glow Logic (The "Shine")
  let backgroundStyle = {};

  if (vector === "solo") {
    if (activeCinematic) {
      // 🟢 SOLO DRAMA: Gold-Violet Burst
      backgroundStyle = {
        background: `radial-gradient(circle at center, ${primaryColor}60 0%, ${COLORS.violet}50 40%, transparent 80%)`,
        opacity: 0.85,
      };
    } else {
      // Standard Gold
      backgroundStyle = {
        background: `radial-gradient(circle at center, ${primaryColor}50 0%, transparent 70%)`,
        opacity: 0.8,
      };
    }
  } else if (vector === "dual") {
    if (activeCinematic) {
      // 🟢 DUAL DRAMA: Pink-Violet Rise
      backgroundStyle = {
        background: `linear-gradient(to top, ${COLORS.pink}80 0%, ${COLORS.violet}60 30%, transparent 90%)`,
        opacity: 0.9,
      };
    } else {
      // Standard Pink
      backgroundStyle = {
        background: `linear-gradient(to top, ${COLORS.pink}90 0%, ${COLORS.pink}20 50%, transparent 90%)`,
        opacity: 0.9,
      };
    }
  } else if (vector === "duet") {
    if (activeCinematic) {
      // 🟢 DUET DRAMA: Red-Violet Inferno
      backgroundStyle = {
        background: `linear-gradient(to top, ${COLORS.fireRed}90 0%, ${COLORS.violet}70 40%, transparent 95%)`,
        opacity: 0.95,
      };
    } else {
      // Standard Fire
      backgroundStyle = {
        background: `linear-gradient(to top, ${COLORS.fireRed}90 0%, ${COLORS.fireOrange}30 60%, transparent 95%)`,
        opacity: 0.95,
      };
    }
  } else if (vector === "multi") {
    // CYAN/SPACE (Unchanged)
    backgroundStyle = {
      background: `radial-gradient(circle at center, transparent 10%, ${COLORS.deepSpace} 90%)`,
      opacity: 0.9,
    };
  }

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 60 }}
          gl={{ alpha: true, antialias: true }}
          dpr={[1, 2]}
        >
          {vector === "multi" && (
            <fog attach="fog" args={[COLORS.deepSpace, 5, 30]} />
          )}
          <Scene
            vector={vector}
            col1={primaryColor}
            col2={secondaryColor}
            isCine={activeCinematic}
          />
        </Canvas>
      </div>

      <div
        className="absolute inset-0 z-10 transition-all duration-1000 ease-in-out"
        style={backgroundStyle}
      />
    </div>
  );
}

function Scene({ vector, col1, col2, isCine }) {
  if (vector === "solo")
    return <SoloSwarm col1={col1} col2={col2} isCine={isCine} />;
  if (vector === "dual") return <DualHearts col1={col1} col2={col2} />;
  if (vector === "duet")
    return <DuetInferno col1={col1} col2={col2} isCine={isCine} />;
  if (vector === "multi")
    return <MultiWarp col1={col1} col2={col2} isCine={isCine} />;
  return null;
}

// ------------------------------------------------------------------
// 1. SOLO: Visible Dust
// ------------------------------------------------------------------
function SoloSwarm({ col1, col2, isCine }) {
  const particles = useMemo(() => {
    return new Array(COUNT_SOLO).fill().map(() => ({
      factor: Math.random() * 100,
      speed: Math.random() * 0.1 + 0.05,
      xFactor: Math.random() * 8 - 4,
      yFactor: Math.random() * 4 - 2,
      zFactor: Math.random() * 4 - 2,
      scale: Math.random() * 0.03 + 0.01,
      color: isCine ? (Math.random() > 0.5 ? col1 : col2) : col1,
    }));
  }, [col1, col2, isCine]);

  return particles.map((data, i) => <Floater key={i} data={data} />);
}

function Floater({ data }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.position.x =
      data.xFactor + Math.sin(t * data.speed + data.factor) * 0.5;
    ref.current.position.y =
      data.yFactor + Math.cos(t * data.speed + data.factor) * 0.5;
    ref.current.rotation.z += 0.002;
    ref.current.rotation.x += 0.002;
  });
  return (
    <mesh ref={ref} position={[data.xFactor, data.yFactor, 0]}>
      <icosahedronGeometry args={[data.scale, 0]} />
      <meshBasicMaterial color={data.color} transparent opacity={0.8} />
    </mesh>
  );
}

// ------------------------------------------------------------------
// 2. DUAL: Floating Hearts
// ------------------------------------------------------------------
function DualHearts({ col1, col2 }) {
  const heartShape = useMemo(() => {
    const x = 0,
      y = 0;
    const shape = new THREE.Shape();
    shape.moveTo(x + 0.25, y + 0.25);
    shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    shape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
    shape.bezierCurveTo(
      x - 0.3,
      y + 0.55,
      x - 0.1,
      y + 0.77,
      x + 0.25,
      y + 0.95
    );
    shape.bezierCurveTo(
      x + 0.6,
      y + 0.77,
      x + 0.8,
      y + 0.55,
      x + 0.8,
      y + 0.35
    );
    shape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
    shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);
    return shape;
  }, []);

  const particles = useMemo(() => {
    return new Array(COUNT_DUAL).fill().map(() => ({
      x: (Math.random() - 0.5) * 16,
      y: -7 - Math.random() * 6,
      z: -5 - Math.random() * 10,
      speed: Math.random() * 0.02 + 0.015,
      color: Math.random() > 0.6 ? col2 : col1,
      scale: Math.random() * 0.04 + 0.02,
      rotZ: Math.random() * 0.5 - 0.25,
    }));
  }, [col1, col2]);

  return particles.map((data, i) => (
    <HeartMesh key={i} data={data} shape={heartShape} />
  ));
}

function HeartMesh({ data, shape }) {
  const ref = useRef();
  const initialY = -7;
  const limitY = 5;

  useFrame(() => {
    ref.current.position.y += data.speed;
    ref.current.position.x += Math.sin(ref.current.position.y) * 0.005;
    const progress = (ref.current.position.y - initialY) / (limitY - initialY);
    let opacity = Math.sin(progress * Math.PI);
    if (opacity < 0) opacity = 0;
    ref.current.material.opacity = opacity * 0.8;

    if (ref.current.position.y > limitY) {
      ref.current.position.y = initialY;
    }
  });

  return (
    <mesh
      ref={ref}
      position={[data.x, data.y, data.z]}
      rotation={[0, 0, Math.PI + data.rotZ]}
    >
      <shapeGeometry args={[shape]} />
      <meshBasicMaterial
        color={data.color}
        transparent
        opacity={0}
        side={THREE.DoubleSide}
      />
      <group scale={[data.scale, data.scale, 1]} />
    </mesh>
  );
}

// ------------------------------------------------------------------
// 3. DUET: Inferno
// ------------------------------------------------------------------
function DuetInferno({ col1, col2, isCine }) {
  const particles = useMemo(() => {
    return new Array(COUNT_FIRE).fill().map(() => {
      let color;
      if (isCine) {
        color = Math.random() > 0.2 ? COLORS.fireRed : col2;
      } else {
        color = Math.random() > 0.5 ? COLORS.fireRed : col2;
      }
      return {
        x: (Math.random() - 0.5) * 14,
        y: -6 - Math.random() * 4,
        z: (Math.random() - 0.5) * 4,
        speed: Math.random() * 0.08 + 0.03,
        scale: Math.random() * 0.08 + 0.02,
        offset: Math.random() * 100,
        color: color,
      };
    });
  }, [col1, col2, isCine]);

  return particles.map((data, i) => <Ember key={i} data={data} />);
}

function Ember({ data }) {
  const ref = useRef();
  const initialY = data.y;
  const initialX = data.x;
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.position.y += data.speed;
    ref.current.position.x = initialX + Math.sin(t * 5 + data.offset) * 0.15;
    ref.current.rotation.z += 0.05;
    ref.current.rotation.x += 0.05;
    let life = 1 - ref.current.position.y / 3;
    if (life < 0) life = 0;
    ref.current.scale.setScalar(data.scale * life);
    if (ref.current.position.y > 3 || life <= 0) {
      ref.current.position.y = initialY;
      ref.current.scale.setScalar(data.scale);
    }
  });
  return (
    <mesh ref={ref} position={[data.x, data.y, data.z]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={data.color} transparent opacity={0.9} />
    </mesh>
  );
}

// ------------------------------------------------------------------
// 4. MULTI: Warp Tunnel
// ------------------------------------------------------------------
function MultiWarp({ col1, col2, isCine }) {
  const particles = useMemo(() => {
    return new Array(COUNT_MULTI).fill().map(() => ({
      x: (Math.random() - 0.5) * 25,
      y: (Math.random() - 0.5) * 15,
      z: -40 + Math.random() * 50,
      speed: Math.random() * 0.5 + 0.2,
      len: Math.random() * 5 + 2,
      color: Math.random() > 0.5 ? col1 : col2,
    }));
  }, [col1, col2]);

  const groupRef = useRef();
  useFrame((state) => {
    if (isCine && groupRef.current) {
      groupRef.current.rotation.z += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((data, i) => (
        <WarpStreak key={i} data={data} isCine={isCine} />
      ))}
    </group>
  );
}

function WarpStreak({ data, isCine }) {
  const ref = useRef();
  const initialZ = -40;
  const cameraZ = 12;
  useFrame(() => {
    const speedMult = isCine ? 2.5 : 1;
    ref.current.position.z += data.speed * speedMult;
    if (ref.current.position.z > cameraZ) {
      ref.current.position.z = initialZ;
    }
  });
  return (
    <mesh ref={ref} position={[data.x, data.y, data.z]}>
      <boxGeometry args={[0.04, 0.04, data.len]} />
      <meshBasicMaterial color={data.color} transparent opacity={0.7} />
    </mesh>
  );
}
