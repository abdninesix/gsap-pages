"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls, GLTFLoader } from "three-stdlib";

interface ModelViewerProps {
  modelPath: string;
}

const ModelViewer = ({ modelPath }: ModelViewerProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(1, 0, 2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.autoRotate = false;

    controls.target.set(0, 0, 0);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light, new THREE.AmbientLight(0xffffff, 0.6));

    // Load model
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;

        // --- FIX PIVOT / CENTERING ---
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Shift the model so its center is at the world origin
        model.position.sub(center);

        // Optional: Auto scale model to fit nicely in view
        const maxAxis = Math.max(size.x, size.y, size.z);
        model.scale.setScalar(2 / maxAxis);

        // Add model to scene
        scene.add(model);

        // Adjust orbit target to match model center
        controls.target.copy(new THREE.Vector3(0, 0, 0));
        controls.update();
      },
      undefined,
      (error) => console.error("Error loading model:", error)
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // --- TEMP: Keyboard controls for manual camera testing ---
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "w":
          camera.position.z -= 0.1;
          break;
        case "s":
          camera.position.z += 0.1;
          break;
        case "a":
          camera.position.x -= 0.1;
          break;
        case "d":
          camera.position.x += 0.1;
          break;
        case "q":
          camera.position.y += 0.1;
          break;
        case "e":
          camera.position.y -= 0.1;
          break;
      }
      console.log("Camera:", camera.position);
      console.log("Target:", controls.target);
    };
    window.addEventListener("keydown", handleKey);

    // Cleanup
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      window.removeEventListener("keydown", handleKey);
    };
  }, [modelPath]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
};

export default ModelViewer;
