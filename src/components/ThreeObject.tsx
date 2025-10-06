"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ModelViewerProps {
  modelPath: string;
}

interface ModelSceneProps {
  modelPath: string;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

// === Inner model + camera logic ===
const ModelScene = ({ modelPath, controlsRef }: ModelSceneProps) => {
  const { scene } = useGLTF(modelPath);
  const { camera } = useThree();

  // Centering and scaling the model
  // useEffect(() => {
  //   const box = new THREE.Box3().setFromObject(scene);
  //   const center = box.getCenter(new THREE.Vector3());
  //   const size = box.getSize(new THREE.Vector3());

  //   // Move model so it's centered
  //   scene.position.sub(center);

  //   // Uniformly scale the model
  //   const scaleFactor = 2 / Math.max(size.x, size.y, size.z);
  //   scene.scale.setScalar(scaleFactor);
  // }, [scene]);

  // GSAP animations
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    // === Camera Path ===
    const path = [
      { pos: { x: -0.319979, y: 0.131781, z: 0.741185 }, target: { x: -0.402811, y: 0.210506, z: -0.355563 }, }, // Bitch
      { pos: { x: 1.260190, y: 0.469882, z: 1.291159 }, target: { x: -0.009238, y: -0.555765, z: -0.385440 }, }, // Default
      { pos: { x: -0.857991, y: -0.606311, z: 0.459502 }, target: { x: 0.052497, y: -0.365189, z: -0.239550 }, }, // Feminist
      { pos: { x: 1.007686, y: -0.137042, z: 0.633024 }, target: { x: -0.063218, y: -0.429829, z: -0.767650 }, }, // Jewish
      { pos: { x: -0.135575, y: -0.855350, z: 0.854895 }, target: { x: 0.575856, y: -0.335994, z: -0.742531 }, }, // Arabic
    ];

    // === Initial camera setup ===
    gsap.set(camera.position, path[0].pos);
    const { x, y, z } = path[0].target;
    controls.target.set(x, y, z);
    controls.update();

    // === GSAP Scroll Animation ===
    const headings = gsap.utils.toArray<HTMLElement>(".heading-animate");

    headings.forEach((heading, i) => {
      if (!path[i + 1]) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heading,
          start: "top 70%",
          end: "bottom 60%",
          scrub: 1.2,
        },
      });

      tl.to(camera.position, {
        ...path[i + 1].pos,
        ease: "power2.inOut",
        duration: 1,
        onUpdate: () => controls.update(),
      });

      tl.to(
        controls.target,
        {
          ...path[i + 1].target,
          ease: "power2.inOut",
          duration: 1,
          onUpdate: () => controls.update(),
        },
        "<"
      );
    });

    // === Keyboard Controls (manual camera movement for testing) ===
    const handleKey = (e: KeyboardEvent) => {
      const step = 0.1;
      switch (e.key.toLowerCase()) {
        case "w":
          camera.position.z -= step;
          break;
        case "s":
          camera.position.z += step;
          break;
        case "a":
          camera.position.x -= step;
          break;
        case "d":
          camera.position.x += step;
          break;
        case "q":
          camera.position.y += step;
          break;
        case "e":
          camera.position.y -= step;
          break;
      }

      controls.update();

      // === Log current camera + target ===
      console.log(
        `{pos: { x: ${camera.position.x.toFixed(6)}, y: ${camera.position.y.toFixed(
          6
        )}, z: ${camera.position.z.toFixed(6)} }, target: { x: ${controls.target.x.toFixed(
          6
        )}, y: ${controls.target.y.toFixed(6)}, z: ${controls.target.z.toFixed(6)} },},`
      );
    };

    window.addEventListener("keydown", handleKey);

    // === Cleanup ===
    return () => {
      window.removeEventListener("keydown", handleKey);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [camera, controlsRef, modelPath]);

  return <primitive object={scene} position={[0, -1, 0]} scale={0.5} />;
};

// === Outer Canvas Container ===
const ModelViewer = ({ modelPath }: ModelViewerProps) => {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Canvas camera={{ position: [0, 0, 2], fov: 45 }} gl={{ powerPreference: "high-performance" }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls ref={controlsRef} enableDamping enableZoom />
        <ModelScene modelPath={modelPath} controlsRef={controlsRef} />
      </Canvas>
    </div >
  );
};

export default ModelViewer;
