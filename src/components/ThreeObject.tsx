"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
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
  const { scene, animations } = useGLTF(modelPath);
  const { camera } = useThree();
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);

  // Centering and scaling the model
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // Move model so it's centered
    scene.position.sub(center);

    // Uniformly scale the model
    const scaleFactor = 2 / Math.max(size.x, size.y, size.z);
    scene.scale.setScalar(scaleFactor);

    // === Animation setup ===
    const mixer = new THREE.AnimationMixer(scene);
    const actions: Record<string, THREE.AnimationAction> = {};

    animations.forEach((clip) => {
      const action = mixer.clipAction(clip);
      actions[clip.name] = action;
    });

    // Play default animation initially (optional)
    actions["Free_Fall"]?.play();

    mixerRef.current = mixer;

    // ✅ Store for GSAP triggers later (type-safe)
    (window as unknown as { modelActions?: Record<string, THREE.AnimationAction> }).modelActions = actions;

    return () => {
      mixer.stopAllAction();
      mixerRef.current = null;
    };
  }, [scene, animations]);

  useFrame((_, delta) => {
    if (mixerRef.current) mixerRef.current.update(delta);
  });

  // GSAP animations
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    // === Camera Path ===
    const path = [
      { pos: { x: 0.005775, y: 1.276720, z: -3.310397 }, target: { x: 0.131217, y: 1.534274, z: 0.859131 }, },
      { pos: { x: 4.407232, y: 3.694332, z: 6.836674 }, target: { x: -0.185710, y: 0.720304, z: 2.246814 }, },
      { pos: { x: -5.648253, y: 1.031125, z: -4.984693 }, target: { x: 1.185256, y: -0.700784, z: 3.725735 }, },
      { pos: { x: 6.210263, y: 2.653112, z: 4.164157 }, target: { x: -0.391628, y: 0.191081, z: 1.395586 }, },
      { pos: { x: -3.949448, y: 1.526291, z: 6.318589 }, target: { x: 1.404053, y: 0.707201, z: 0.330522 }, },
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

    // === Playing animations ===
    const actions =
      (window as unknown as { modelActions?: Record<string, THREE.AnimationAction> })
        .modelActions ?? {};

    const animationNames = ["Look_Wave", "Free_Fall", "Sitting", "Look_Wave"]; // Adjust order to match headings

    headings.forEach((heading, i) => {
      if (!path[i + 1]) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heading,
          start: "top 70%",
          end: "bottom 60%",
          scrub: 1.2,
          onEnter: () => {
            // Stop all and play the one for this section
            Object.values(actions).forEach((a) => a.stop());
            const action = actions[animationNames[i]];
            if (action) action.reset().play();
          },
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

  return <primitive object={scene} position={[0, 0, 0]} scale={1} />;
};

// === Outer Canvas Container ===
const ModelViewer = ({ modelPath }: ModelViewerProps) => {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  return (
    <div className="border h-screen">
      <Canvas camera={{ position: [0, 0, 2], fov: 30 }} gl={{ powerPreference: "high-performance" }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls
          ref={controlsRef}
          // enableDamping={false}
          // enablePan={false}
          // enableZoom={false}
          // enableRotate={false}
        />
        <ModelScene modelPath={modelPath} controlsRef={controlsRef} />
      </Canvas>
    </div >
  );
};

export default ModelViewer;
