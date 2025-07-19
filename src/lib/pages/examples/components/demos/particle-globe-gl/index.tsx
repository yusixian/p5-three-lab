import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import type * as THREE from 'three';

import { Button } from '@/lib/components/ui/button';
import { useGLActive } from '@/lib/hooks/use-gl-active';
import { useIsPortrait } from '@/lib/hooks/use-is-portrait';

import { createAutoRotation, createIntroAnimation } from './animation-utils';
import { createParticleSystem } from './create-particle-system';
import {
  cleanupThreeSetup,
  createAnimationLoop,
  createLighting,
  createResizeHandler,
  createThreeSetup,
} from './three-utils';

export interface HomeGLRef {
  group?: THREE.Group;
}

export const ParticleGlobeGLDemo = forwardRef<HomeGLRef>((_props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<THREE.Group | null>(null);
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

    // Create Three.js setup
    const threeSetup = createThreeSetup({
      container,
      isPortrait,
      enableOrbitControls: true,
      orbitControlsConfig: {
        enableDamping: true,
        dampingFactor: 0.05,
        enableZoom: true,
        enableRotate: true,
        enablePan: false,
        minDistance: 1.5,
        maxDistance: 8,
        autoRotate: false,
        autoRotateSpeed: 0.5,
      },
    });

    const { scene, camera, renderer, controls, group } = threeSetup;
    groupRef.current = group;

    // Create lighting
    createLighting(camera);

    // Create particle system
    const { groupParticleGlobe, gu } = createParticleSystem();
    group.add(groupParticleGlobe);

    // Create auto rotation
    const autoRotation = createAutoRotation({ group });

    // Create resize handler
    const resizeHandler = createResizeHandler(container, camera, renderer);
    const observer = new ResizeObserver(resizeHandler);
    observer.observe(container);

    // Create animation loop
    const animationLoop = createAnimationLoop({
      render: () => {
        controls?.update();
        renderer.render(scene, camera);
      },
      onFrame: (deltaTime) => {
        gu.time.value += deltaTime;
        autoRotation.update(deltaTime);
      },
    });

    return {
      onVisible: () => {
        // Create intro animation
        createIntroAnimation({
          group,
          initRotation,
        });

        animationLoop.start();
        autoRotation.enable();
      },
      onHide: () => {
        animationLoop.stop();
        autoRotation.disable();
      },
      onDestroy: () => {
        observer.disconnect();
        cleanupThreeSetup(threeSetup);
      },
    };
  });

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center gap-4">
        <Button className="mt-4" onClick={() => setIsActive(!isActive)}>
          {isActive ? 'Stop' : 'Active'}
        </Button>
      </div>
      <div className="relative h-[60dvh] min-h-[600px] w-full">
        <div
          className="globe-gl absolute top-0 left-0 size-full"
          ref={containerRef}
        ></div>
      </div>
    </div>
  );
});
