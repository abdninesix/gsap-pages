"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls, GLTFLoader } from "three-stdlib";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ModelViewerProps {
  modelPath: string;
}

const ModelViewer = ({ modelPath }: ModelViewerProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // === SCENE ===
    const scene = new THREE.Scene();

    // === CAMERA ===
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );

    // Start from origin — GSAP will drive all motion
    camera.position.set(0, 0, 0);

    // === RENDERER ===
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // === CONTROLS ===
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = true;

    // === LIGHTING ===
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light, new THREE.AmbientLight(0xffffff, 0.6));

    // === RESPONSIVE HANDLER ===
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // === LOAD MODEL ===
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;

        // Center + scale model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        model.position.sub(center);
        model.scale.setScalar(2 / Math.max(size.x, size.y, size.z));

        scene.add(model);

        // Wait one frame to ensure everything is ready before GSAP setup
        requestAnimationFrame(() => {
          setupScrollAnimations(camera, controls);
          ScrollTrigger.refresh();
        });
      },
      undefined,
      (error) => console.error("Error loading model:", error)
    );

    // === RENDER LOOP ===
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // --- TEMP: Keyboard controls for manual camera testing --- AND REMOVE THIS ALSO
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "w": camera.position.z -= 0.1; break; case "s": camera.position.z += 0.1; break; case "a": camera.position.x -= 0.1; break; case "d": camera.position.x += 0.1; break; case "q": camera.position.y += 0.1; break; case "e": camera.position.y -= 0.1; break;
      }
      console.log(`{pos: { x: ${camera.position.x.toFixed(6)}, y: ${camera.position.y.toFixed(6)}, z: ${camera.position.z.toFixed(6)} },target: { x: ${controls.target.x.toFixed(6)}, y: ${controls.target.y.toFixed(6)}, z: ${controls.target.z.toFixed(6)} },},`);
    }; window.addEventListener("keydown", handleKey);

    // === CLEANUP ===
    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.globalTimeline.clear();
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
      window.removeEventListener("keydown", handleKey); // REMOVE THIS IN THE END
    };
  }, [modelPath]);

  // === GSAP SCROLL ANIMATIONS ===
  const setupScrollAnimations = (camera: THREE.PerspectiveCamera, controls: OrbitControls) => {
    // ✨ Define your custom camera & target waypoints
    const path = [
      { pos: { x: 1.260190, y: 0.469882, z: 1.291159 }, target: { x: -0.009238, y: -0.555765, z: -0.385440 }, },
      { pos: { x: -1.419211, y: -0.546049, z: 0.599485 }, target: { x: -0.115417, y: -0.200768, z: -0.401538 }, },
      { pos: { x: -0.319979, y: 0.131781, z: 0.741185 }, target: { x: -0.402811, y: 0.210506, z: -0.355563 }, },
      { pos: { x: 0.739051, y: -0.367500, z: 0.837658 }, target: { x: -0.439885, y: -0.096625, z: -0.527762 }, },
      { pos: { x: 1.196044, y: 0.140767, z: 0.602759 }, target: { x: 0.086448, y: 0.041419, z: -0.913315 }, },
    ];


    const headings = gsap.utils.toArray<HTMLElement>(".heading-animate");

    if (headings.length < path.length) {
      console.warn("Not enough headings for camera positions");
    }

    /// Initial camera + target
    gsap.set(camera.position, path[0].pos);
    gsap.set(controls.target, path[0].target);
    controls.update();

    // For each heading...
    headings.forEach((heading, i) => {
      if (!path[i + 1]) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heading,
          start: "top 80%",
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

      tl.to(controls.target, {
        ...path[i + 1].target,
        ease: "power2.inOut",
        duration: 1,
        onUpdate: () => controls.update(),
      }, "<");
    });
  };

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
};

export default ModelViewer;
