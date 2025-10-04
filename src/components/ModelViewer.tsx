"use client"; // This is a client component

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { GLTFLoader } from 'three-stdlib';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ModelViewerProps {
  modelPath: string;
}

const ModelViewer = ({ modelPath }: ModelViewerProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = false; // turn off auto-rotation for testing
    controls.enableZoom = true;

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light, new THREE.AmbientLight(0xffffff, 0.5));

    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => scene.add(gltf.scene));

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // TEMP: keyboard controls for testing positions
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "w": camera.position.z -= 0.1; break;
        case "s": camera.position.z += 0.1; break;
        case "a": camera.position.x -= 0.1; break;
        case "d": camera.position.x += 0.1; break;
        case "q": camera.position.y += 0.1; break;
        case "e": camera.position.y -= 0.1; break;
      }
      console.log("Camera:", camera.position);
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      window.removeEventListener("keydown", handleKey);
    };
  }, [modelPath]);


  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default ModelViewer;