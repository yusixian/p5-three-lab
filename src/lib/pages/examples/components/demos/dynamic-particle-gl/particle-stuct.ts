import type { P5CanvasInstance } from '@p5-wrapper/react';
import P5 from 'p5';

import type { MySketchProps } from './dynamic-particle-gl';

export function generateRandomPos(
  x: number,
  y: number,
  mag: number,
  p5: P5CanvasInstance<MySketchProps>,
) {
  const pos = new P5.Vector(x, y);

  const randomDirection = new P5.Vector(
    p5.random(p5.width),
    p5.random(p5.height),
  );

  const vel = P5.Vector.sub(randomDirection, pos);
  vel.normalize();
  vel.mult(mag);
  pos.add(vel);

  return pos;
}

type ParticleConfig = {
  closeEnoughTarget: number;
  speed: number;
  mouseSize: number;
  scaleRatio: number;
  particleSize: number;
  maxSpeedRange?: [number, number];
  maxForceRange?: [number, number];
  colorBlendRate?: [number, number];
  noiseScale?: number;
  noiseStrength?: number;
};

/**
 * particle.js https://openprocessing.org/sketch/2097742
 * A particle that uses a seek behaviour to move to its target.
 * @param {number} x
 * @param {number} y
 */
export class Particle {
  p5: P5CanvasInstance<MySketchProps>;
  pos: P5.Vector;
  vel: P5.Vector;
  acc: P5.Vector;
  target: P5.Vector;
  isKilled: boolean;
  config: ParticleConfig;
  maxSpeed: number;
  maxForce: number;

  currentColor: P5.Color;
  endColor: P5.Color;
  colorBlendRate: number;

  currentSize: number;
  distToTarget: number;

  noiseOffsetX: number;
  noiseOffsetY: number;

  // Reusable vectors to reduce garbage collection
  private tempVec1: P5.Vector;
  private tempVec2: P5.Vector;
  private tempVec3: P5.Vector;

  constructor(
    x: number,
    y: number,
    p5: P5CanvasInstance<MySketchProps>,
    isMobile?: boolean,
    config?: ParticleConfig,
  ) {
    this.p5 = p5;
    this.config = config ?? {
      closeEnoughTarget: 100,
      speed: 3,
      particleSize: isMobile ? 4 : 8,
      mouseSize: 50,
      scaleRatio: 1,
    };
    this.pos = new P5.Vector(x, y);
    this.vel = new P5.Vector(0, 0);
    this.acc = new P5.Vector(0, 0);
    this.target = new P5.Vector(0, 0);
    this.isKilled = false;

    const maxSpeedRange = config?.maxSpeedRange ?? [0.25, 2];
    const maxForceRange = config?.maxForceRange ?? [8, 15];
    const colorBlendRateRange = config?.colorBlendRate ?? [0.01, 0.05];

    this.maxSpeed = p5.random(maxSpeedRange[0], maxSpeedRange[1]); // How fast it can move per frame.
    this.maxForce = p5.random(maxForceRange[0], maxForceRange[1]); // Its speed limit.

    this.currentColor = p5.color(0);
    this.endColor = p5.color(0);
    this.colorBlendRate = p5.random(
      colorBlendRateRange[0],
      colorBlendRateRange[1],
    );

    this.currentSize = 0;

    // Saving as class const so it doesn't need to calculate twice.
    this.distToTarget = 0;

    this.noiseOffsetX = p5.random(1000);
    this.noiseOffsetY = p5.random(1000);

    // Initialize reusable vectors
    this.tempVec1 = new P5.Vector();
    this.tempVec2 = new P5.Vector();
    this.tempVec3 = new P5.Vector();
  }

  public move() {
    const p5 = this.p5;
    const { closeEnoughTarget, speed, scaleRatio, mouseSize } = this.config;

    // add a little noise to the particle using reusable vector
    const noiseScale = this.config.noiseScale ?? 0.005; // noise scale
    const noiseStrength = this.config.noiseStrength ?? 0.6; // noise strength
    this.tempVec1.set(
      p5.noise(
        this.noiseOffsetX + this.pos.x * noiseScale,
        this.pos.y * noiseScale,
      ) *
        noiseStrength -
        noiseStrength / 2,
      p5.noise(
        this.noiseOffsetY + this.pos.y * noiseScale,
        this.pos.x * noiseScale,
      ) *
        noiseStrength -
        noiseStrength / 2,
    );
    this.acc.add(this.tempVec1);

    const dx = this.target.x - this.pos.x;
    const dy = this.target.y - this.pos.y;
    const distSq = dx * dx + dy * dy;
    this.distToTarget = Math.sqrt(distSq); // Only calculate when needed

    // If it's close enough to its target, the slower it'll get
    // so that it can settle.
    let proximityMult = 1;
    if (this.distToTarget < closeEnoughTarget) {
      proximityMult = this.distToTarget / closeEnoughTarget;
      this.vel.mult(0.9);
    } else {
      proximityMult = 1;
      this.vel.mult(0.95);
    }

    // Steer towards its target using reusable vector
    if (distSq > 1) {
      // Use squared distance for comparison
      this.tempVec2.set(this.target.x - this.pos.x, this.target.y - this.pos.y);
      this.tempVec2.normalize();
      this.tempVec2.mult(this.maxSpeed * proximityMult * speed);
      this.acc.add(this.tempVec2);
    }

    const scaledMouseX = p5.mouseX / scaleRatio;
    const scaledMouseY = p5.mouseY / scaleRatio;

    // Use squared distance for mouse interaction
    const mouseDx = scaledMouseX - this.pos.x;
    const mouseDy = scaledMouseY - this.pos.y;
    const mouseDistSq = mouseDx * mouseDx + mouseDy * mouseDy;
    const mouseSizeSq = mouseSize * mouseSize;

    if (mouseDistSq < mouseSizeSq) {
      const mouseDist = Math.sqrt(mouseDistSq); // Only calculate sqrt when needed

      if (p5.mouseIsPressed) {
        // Push towards mouse
        this.tempVec3.set(mouseDx, mouseDy);
      } else {
        // Push away from mouse
        this.tempVec3.set(-mouseDx, -mouseDy);
      }
      this.tempVec3.normalize();
      this.tempVec3.mult((mouseSize - mouseDist) * 0.05);
      this.acc.add(this.tempVec3);
    }

    // Move it.
    this.vel.add(this.acc);
    this.vel.limit(this.maxForce * speed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.noiseOffsetX += 0.01;
    this.noiseOffsetY += 0.01;
  }

  public draw() {
    const p5 = this.p5;
    const { closeEnoughTarget, particleSize } = this.config;
    this.currentColor = p5.lerpColor(
      this.currentColor,
      this.endColor,
      this.colorBlendRate,
    );
    p5.stroke(this.currentColor);

    let targetSize = 2;
    if (!this.isKilled) {
      // Size is bigger the closer it is to its target.
      targetSize = p5.map(
        p5.min(this.distToTarget, closeEnoughTarget),
        closeEnoughTarget,
        0,
        0,
        particleSize,
      );
    } else {
      targetSize = 2;
    }

    this.currentSize = p5.lerp(this.currentSize, targetSize, 0.1);
    p5.strokeWeight(this.currentSize);
    p5.point(this.pos.x, this.pos.y);
  }

  public kill() {
    const p5 = this.p5;
    if (!this.isKilled) {
      this.target = generateRandomPos(
        p5.width / 2,
        p5.height / 2,
        p5.max(p5.width, p5.height),
        p5,
      );
      this.endColor = p5.color(0);
      this.isKilled = true;
    }
  }

  public isOutOfBounds() {
    const p5 = this.p5;
    return (
      this.pos.x < 0 ||
      this.pos.x > p5.width ||
      this.pos.y < 0 ||
      this.pos.y > p5.height
    );
  }
}
