import { gsap } from 'gsap';
import type * as THREE from 'three';

export interface InitialRotation {
  x: number;
  y: number;
  z: number;
}

export interface AnimationConfig {
  group: THREE.Group;
  initRotation: InitialRotation;
  scaleDuration?: number;
  rotationDuration?: number;
  scaleDelay?: number;
  rotationDelay?: number;
  ease?: string;
}

export function createIntroAnimation(config: AnimationConfig) {
  const {
    group,
    initRotation,
    scaleDuration = 1,
    rotationDuration = 2,
    scaleDelay = -2,
    rotationDelay = -2,
    ease = 'power2.out',
  } = config;

  const timeline = gsap.timeline();

  // Scale animation
  timeline.fromTo(
    group.scale,
    {
      x: 2,
      y: 2,
      z: 2,
    },
    {
      duration: scaleDuration,
      ease,
      delay: scaleDelay,
      x: 1,
      y: 1,
      z: 1,
    },
  );

  // Rotation animation
  timeline.fromTo(
    group.rotation,
    {
      x: initRotation.x + Math.PI * 0.5,
      y: initRotation.y,
      z: initRotation.z - Math.PI * 0.75,
    },
    {
      ...initRotation,
      duration: rotationDuration,
      delay: rotationDelay,
      ease,
    },
  );

  return timeline;
}

export interface AutoRotationConfig {
  group: THREE.Group;
  speed?: number;
  axis?: 'x' | 'y' | 'z';
}

export function createAutoRotation(config: AutoRotationConfig) {
  const { group, speed = 30, axis = 'y' } = config;
  let isEnabled = false;

  return {
    enable: () => {
      isEnabled = true;
    },
    disable: () => {
      isEnabled = false;
    },
    update: (deltaTime: number) => {
      if (isEnabled) {
        const rotationSpeed = ((2 * Math.PI) / 60 / 60) * deltaTime * speed;
        group.rotation[axis] =
          (group.rotation[axis] + rotationSpeed) % (2 * Math.PI);
      }
    },
    isEnabled: () => isEnabled,
  };
}
