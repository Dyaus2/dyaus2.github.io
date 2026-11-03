import { PerformanceMonitor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { certs, projects } from "../content/data";
import { budgets, detectTier } from "../lib/device";
import { setUI } from "../lib/store";
import { Avatar } from "./Avatar";
import { CameraRig } from "./CameraRig";
import { Cluster } from "./Cluster";
import { Core, SkillSphere, TimelineSpine } from "./Landmarks";
import { Network, Starfield } from "./Network";
import { clusterPos } from "./world";

function useFontsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let done = false;
    const finish = () => { if (!done) { done = true; setReady(true); } };
    const timer = window.setTimeout(finish, 2500);
    if (document.fonts?.ready) {
      Promise.all([
        document.fonts.load('800 80px "Space Grotesk"'),
        document.fonts.load('700 80px "Space Grotesk"'),
        document.fonts.load('600 80px "Space Grotesk"'),
      ]).catch(() => undefined).then(() => document.fonts.ready).then(finish, finish);
    } else finish();
    return () => window.clearTimeout(timer);
  }, []);
  return ready;
}

export default function Scene() {
  const initialTier = useMemo(() => detectTier(), []);
  const [tier, setTier] = useState(initialTier);
  const b = budgets[tier];
  const [dpr, setDpr] = useState<number>(Math.min(window.devicePixelRatio || 1, b.dpr[1]));
  const fontsReady = useFontsReady();
  const certCount = certs.filter((c) => c.show).length;

  return (
    <Canvas
      className="webgl"
      dpr={dpr}
      gl={{ antialias: tier !== "low", powerPreference: "high-performance", alpha: false }}
      camera={{ fov: 55, near: 0.1, far: 600, position: [0, 0, 13] }}
      eventSource={document.getElementById("root")!}
      eventPrefix="client"
      onCreated={({ gl, scene }) => {
        gl.setClearColor("#03040b");
        scene.fog = new THREE.FogExp2("#03040b", 0.024);
        setUI({ sceneReady: true });
      }}
    >
      <PerformanceMonitor
        onDecline={() => {
          setDpr((d) => Math.max(1, d * 0.75));
          setTier((t) => (t === "high" ? "mid" : "low"));
        }}
        flipflops={3}
        onFallback={() => { setDpr(1); setTier("low"); }}
      />
      <CameraRig />
      <Starfield count={b.stars} />
      <Network count={b.nodes} pulses={b.pulses} />
      <Avatar count={b.avatar} fontsReady={fontsReady} />
      {projects.map((p, i) => (
        <Cluster key={p.id} project={p} index={i} position={clusterPos[i]} nodes={b.clusterNodes} fontsReady={fontsReady} />
      ))}
      <TimelineSpine />
      <SkillSphere fontsReady={fontsReady} certCount={certCount} />
      <Core nodes={Math.round(b.clusterNodes * 1.2)} />
      {b.bloom && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={1.15} luminanceThreshold={0.18} luminanceSmoothing={0.35} radius={0.75} />
          <Vignette offset={0.28} darkness={0.85} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
