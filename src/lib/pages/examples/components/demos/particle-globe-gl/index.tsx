import { gsap } from 'gsap';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { Button } from '@/lib/components/ui/button';
import { useGLActive } from '@/lib/hooks/use-gl-active';
import { useIsPortrait } from '@/lib/hooks/use-is-portrait';
import { createParticleSystem } from '@/lib/pages/examples/components/demos/particle-globe-gl/create-particle-system';

export interface HomeGLRef {
  group?: THREE.Group;
}

export const ParticleGlobeGLDemo = forwardRef<HomeGLRef>((_props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [isActive, setIsActive] = useState(true);
  const isPortrait = useIsPortrait();
  const initRotation = {
    x: 2.62,
    y: -0.87,
    z: 2.79,
  };

  useImperativeHandle(
    ref,
    () => ({
      group: groupRef.current ?? undefined,
    }),
    [],
  );

  useGLActive(isActive, () => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const group = new THREE.Group();
    groupRef.current = group;
    let frameId: number;
    let autoRotating = false;
    const clock = new THREE.Clock();
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.add(group);

    const camera = new THREE.PerspectiveCamera(
      isPortrait ? 70 : 40,
      container.clientWidth / container.clientHeight,
      1,
      100,
    );
    camera.position.set(0, 0, 3.33);
    camera.lookAt(0, 0, 0);
    camera.layers.enable(1);
    scene.add(camera);

    // Setup OrbitControls for rotation, zoom, and pan
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smooth controls
    controls.dampingFactor = 0.05;
    controls.enableZoom = true; // Enable zoom
    controls.enableRotate = true; // Enable rotation
    controls.enablePan = false; // Disable panning to keep globe centered
    controls.minDistance = 1.5; // Minimum zoom distance
    controls.maxDistance = 8; // Maximum zoom distance
    controls.autoRotate = false; // We'll control this manually
    controls.autoRotateSpeed = 0.5; // Auto rotation speed when enabled

    const ambientLight = new THREE.AmbientLight(0xb7d4f9, 0.4);
    camera.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xf9e8cf, 1.3);
    directionalLight.position.set(0.5, 0, 0.866); // ~60º
    camera.add(directionalLight);

    // const axesHelper = new THREE.AxesHelper(10);
    // scene.add(axesHelper);
    // const gui = new GUI();
    // const folderRotation = gui.addFolder('group.rotation');
    // folderRotation.add(group.rotation, 'x').step(0.01);
    // folderRotation.add(group.rotation, 'y').step(0.01);
    // folderRotation.add(group.rotation, 'z').step(0.01);
    // const folderPosition = gui.addFolder('group.position');
    // folderPosition.add(group.position, 'x').step(0.01);
    // folderPosition.add(group.position, 'y').step(0.01);
    // folderPosition.add(group.position, 'z').step(0.01);
    // const folderScale = gui.addFolder('group.scale');
    // folderScale.add(group.scale, 'x').step(0.01);
    // folderScale.add(group.scale, 'y').step(0.01);
    // const folderScale = gui.addFolder('group.scale');
    // const folderParticle = gui.addFolder('particleConfig');
    // folderParticle.add(particleConfig, 'outerCount', 1500, 4000).step(10);
    // folderParticle.add(particleConfig, 'outerRadius', 0.3, 1).step(0.05);
    // folderParticle.add(particleConfig, 'innerCount', 500, 3000).step(10);
    // folderParticle.add(particleConfig, 'innerRadius', 0.5, 2).step(0.05);
    // gui.domElement.id = 'home-gl-gui';

    const { groupParticleGlobe, gu } = createParticleSystem();

    group.add(groupParticleGlobe);

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

    let t = 0;
    function render() {
      const delta = clock.getDelta();

      t += delta;
      gu.time.value = t;

      // Update controls
      controls.update();

      // Auto rotation when enabled and not being manually controlled
      if (autoRotating && !controls.autoRotate) {
        // Apply auto rotation to the group instead of using OrbitControls autoRotate
        // to maintain the original animation feel
        group.rotation.y =
          (group.rotation.y + ((2 * Math.PI) / 60 / 60) * delta * 30) %
          (2 * Math.PI);
      }

      renderer.render(scene, camera);
    }

    function animate() {
      frameId = requestAnimationFrame(animate);

      render();
    }

    return {
      onVisible: () => {
        const tl = gsap.timeline();
        tl.fromTo(
          group.scale,
          {
            x: 2,
            y: 2,
            z: 2,
          },
          {
            duration: 1,
            ease: 'power2.out',
            delay: -2,
            x: 1,
            y: 1,
            z: 1,
          },
        );
        tl.fromTo(
          [group.rotation],
          {
            x: initRotation.x + Math.PI * 0.5,
            y: initRotation.y,
            z: initRotation.z - Math.PI * 0.75,
          },
          {
            ...initRotation,
            duration: 2,
            delay: -2,
            ease: 'power2.out',
          },
        );
        animate();
        autoRotating = true;
        // OrbitControls handles all mouse and touch interactions automatically
        // document.body.appendChild(gui.domElement);
      },
      onHide: () => {
        // console.log('click!', groupRef?.current?.rotation);
        cancelAnimationFrame(frameId);
        autoRotating = false;
        // OrbitControls automatically cleans up its own event listeners

        // document.body.removeChild(gui.domElement);
      },
      onDestroy: () => {
        observer.disconnect();
        controls.dispose(); // Clean up OrbitControls
        container.removeChild(renderer.domElement);
      },
    };
  });

  return (
    <div className="flex w-full flex-col overflow-auto">
      <div className="flex items-center gap-4">
        <Button className="mt-4" onClick={() => setIsActive(!isActive)}>
          {isActive ? 'Stop' : 'Active'}
        </Button>
      </div>
      <div className="relative h-[70dvh] min-h-[600px] w-full">
        <div
          className="globe-gl absolute top-0 left-0 size-full"
          ref={containerRef}
        ></div>
      </div>
    </div>
  );
});
