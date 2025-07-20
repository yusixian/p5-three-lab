import { Leva, useControls } from 'leva';
import { useEffect, useRef } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { processParticleConnections } from './connection-utils';
import {
  createParticleLineSystem,
  type ParticleSystem,
} from './particle-system';

// Configuration constants
const MAX_PARTICLE_COUNT = 1000;
const SPHERE_RADIUS = 800;

export const ParticleLineGlobeGLDemo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particleSystemRef = useRef<ParticleSystem | null>(null);
  const threeObjectsRef = useRef<{
    camera?: THREE.PerspectiveCamera;
    scene?: THREE.Scene;
    renderer?: THREE.WebGLRenderer;
    controls?: OrbitControls;
    group?: THREE.Group;
  }>({});
  const animationId = useRef<number | undefined>(undefined);

  // Control parameters
  const controls = useControls('Particle Globe Controls', {
    showDots: true,
    showLines: true,
    minDistance: { value: 80, min: 10, max: 300 },
    limitConnections: false,
    maxConnections: { value: 20, min: 0, max: 30, step: 1 },
    particleCount: { value: 500, min: 0, max: MAX_PARTICLE_COUNT, step: 1 },
    perturbationStrength: { value: 0.05, min: 0, max: 0.1, step: 0.001 },
    particleSize: { value: 3, min: 1, max: 10 },
    particleColor: '#00ccff',
    lineColor: '#add8ff',
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      1,
      4000,
    );
    camera.position.z = 1050;

    // Create controls
    const orbitControls = new OrbitControls(camera, container);
    orbitControls.minDistance = 1000;
    orbitControls.maxDistance = 3000;

    // Create scene and group
    const scene = new THREE.Scene();
    const group = new THREE.Group();
    scene.add(group);

    // Create particle system
    const particleSystem = createParticleLineSystem({
      maxParticleCount: MAX_PARTICLE_COUNT,
      sphereRadius: SPHERE_RADIUS,
      particleColor: controls.particleColor,
      lineColor: controls.lineColor,
      particleSize: controls.particleSize,
    });

    // Set initial particle count
    particleSystem.particles.setDrawRange(0, controls.particleCount);

    // Add to group
    group.add(particleSystem.pointCloud);
    group.add(particleSystem.linesMesh);

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Store references
    particleSystemRef.current = particleSystem;
    threeObjectsRef.current = {
      camera,
      scene,
      renderer,
      controls: orbitControls,
      group,
    };

    // Create resize handler
    function resize() {
      if (!container) {
        return;
      }
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(container);

    // Animation loop
    function animate() {
      const {
        particleCount,
        minDistance,
        limitConnections,
        maxConnections,
        perturbationStrength,
      } = controls;

      if (particleSystemRef.current) {
        const totalConnected = processParticleConnections(
          {
            particleCount,
            minDistance,
            limitConnections,
            maxConnections,
            perturbationStrength,
            sphereRadius: SPHERE_RADIUS,
          },
          particleSystemRef.current.particlePositions,
          particleSystemRef.current.particlesData,
          particleSystemRef.current.positions,
          particleSystemRef.current.colors,
        );

        // Update render objects
        particleSystemRef.current.linesMesh.geometry.setDrawRange(
          0,
          totalConnected * 2,
        );
        particleSystemRef.current.linesMesh.geometry.attributes.position.needsUpdate = true;
        particleSystemRef.current.linesMesh.geometry.attributes.color.needsUpdate = true;
        particleSystemRef.current.pointCloud.geometry.attributes.position.needsUpdate = true;
      }

      animationId.current = requestAnimationFrame(animate);
      render();
    }

    function render() {
      const time = Date.now() * 0.001;
      group.rotation.y = time * 0.1;
      renderer.render(scene, camera);
    }

    animate();

    // Cleanup function
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
      observer.disconnect();
      orbitControls.dispose();

      if (particleSystemRef.current) {
        particleSystemRef.current.particles.dispose();
        particleSystemRef.current.pointCloud.geometry.dispose();
        (
          particleSystemRef.current.pointCloud.material as THREE.Material
        ).dispose();
        particleSystemRef.current.linesMesh.geometry.dispose();
        (
          particleSystemRef.current.linesMesh.material as THREE.Material
        ).dispose();
      }

      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [controls]);

  // Update material properties
  useEffect(() => {
    const particleSystem = particleSystemRef.current;
    if (particleSystem) {
      // Update point cloud
      particleSystem.pointCloud.visible = controls.showDots;
      if (particleSystem.pointCloud.material instanceof THREE.PointsMaterial) {
        particleSystem.pointCloud.material.size = controls.particleSize;
        particleSystem.pointCloud.material.color.set(controls.particleColor);
      }

      // Update lines
      particleSystem.linesMesh.visible = controls.showLines;
      if (
        particleSystem.linesMesh.material instanceof THREE.LineBasicMaterial
      ) {
        particleSystem.linesMesh.material.color.set(controls.lineColor);
      }
    }
  }, [
    controls.showDots,
    controls.showLines,
    controls.particleSize,
    controls.particleColor,
    controls.lineColor,
  ]);

  // Update particle draw range
  useEffect(() => {
    const particleSystem = particleSystemRef.current;
    if (particleSystem) {
      particleSystem.particles.setDrawRange(0, controls.particleCount);
    }
  }, [controls.particleCount]);

  return (
    <div className="flex w-full flex-col">
      <div className="relative flex h-[70dvh] min-h-[600px] w-full">
        <div
          className="globe-gl absolute top-0 left-0 size-full"
          ref={containerRef}
        ></div>
        <div className="absolute top-0 right-0">
          <Leva fill titleBar={false} oneLineLabels={false} />
        </div>
      </div>
    </div>
  );
};
