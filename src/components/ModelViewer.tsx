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
        requestAnimationFrame(() => setupScrollAnimations(camera, controls));
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
      } console.log("Camera:", camera.position); console.log("Target:", controls.target);
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
      { x: 1.1278363804432503, y: 0.062219999999999706, z: 1.7704968351071337, tx: -0.053409415490286695, ty: 0.013475638780949267, tz: -0.2485788186815239 },
      { x: -1.3070981104421284, y: -0.30090297764114604, z: 0.700006851823189, tx: -0.053409415490286695, ty: 0.013475638780949267, tz: -0.2485788186815239 },
      { x: 1.3038909263102063, y: 0.2032783325318378, z: 0.5438013442752397, tx: -0.053409415490286695, ty: 0.013475638780949267, tz: -0.2485788186815239 },
      { x: -0.9544020834553013, y: 0.2823273682859265, z: 0.5546091680722824, tx: -0.053409415490286695, ty: 0.013475638780949267, tz: -0.2485788186815239 },
      { x: -0.07356105104190391, y: -0.92883667199942, z: 1.1705511668472557, tx: -0.053409415490286695, ty: 0.013475638780949267, tz: -0.2485788186815239 },
    ];

    // No initial camera position needed — GSAP takes over fully
    gsap.set(camera.position, path[0]);
    gsap.set(controls.target, {
      x: path[0].tx,
      y: path[0].ty,
      z: path[0].tz,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: mountRef.current?.parentElement || mountRef.current,
        start: "top 80%",
        end: "bottom+=1300 top",
        scrub: 1,
        invalidateOnRefresh: true,
      },
      defaults: { ease: "power2.inOut", duration: 0.4 },
    });

    path.forEach((pos, i) => {
      tl.to(
        camera.position,
        { x: pos.x, y: pos.y, z: pos.z },
        i * 1.3 // smooth section timing
      ).to(
        controls.target,
        {
          x: pos.tx,
          y: pos.ty,
          z: pos.tz,
          onUpdate: () => controls.update(),
        },
        i * 1.3
      );
    });
  };

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
};

export default ModelViewer;
