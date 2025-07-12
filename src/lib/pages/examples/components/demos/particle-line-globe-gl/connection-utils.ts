import type { ParticleData } from './particle-system';
import {
  addConnection,
  calculateDistance,
  updateParticlePosition,
} from './particle-system';

export interface ConnectionConfig {
  particleCount: number;
  minDistance: number;
  limitConnections: boolean;
  maxConnections: number;
  perturbationStrength: number;
  sphereRadius: number;
}

export interface ConnectionResult {
  success: boolean;
  vertexpos: number;
  colorpos: number;
}

function shouldSkipConnection(
  particleDataA: ParticleData,
  particleDataB: ParticleData,
  limitConnections: boolean,
  maxConnections: number,
): boolean {
  return (
    limitConnections &&
    (particleDataA.numConnections >= maxConnections ||
      particleDataB.numConnections >= maxConnections)
  );
}

function processSingleConnection(
  i: number,
  j: number,
  minDistance: number,
  vertexpos: number,
  colorpos: number,
  particlePositions: Float32Array,
  particlesData: Array<ParticleData>,
  positions: Float32Array,
  colors: Float32Array,
): ConnectionResult {
  const dist = calculateDistance(i, j, particlePositions);
  if (dist >= minDistance) {
    return { success: false, vertexpos, colorpos };
  }

  particlesData[i].numConnections++;
  particlesData[j].numConnections++;
  const alpha = 1.0 - dist / minDistance;

  addConnection(
    i,
    j,
    alpha,
    vertexpos,
    colorpos,
    particlePositions,
    positions,
    colors,
  );
  return {
    success: true,
    vertexpos: vertexpos + 6,
    colorpos: colorpos + 6,
  };
}

function hasReachedConnectionLimit(
  particleIndex: number,
  particlesData: Array<ParticleData>,
  limitConnections: boolean,
  maxConnections: number,
): boolean {
  return (
    limitConnections &&
    particlesData[particleIndex].numConnections >= maxConnections
  );
}

export function processParticleConnections(
  config: ConnectionConfig,
  particlePositions: Float32Array,
  particlesData: Array<ParticleData>,
  positions: Float32Array,
  colors: Float32Array,
): number {
  const {
    particleCount,
    minDistance,
    limitConnections,
    maxConnections,
    perturbationStrength,
    sphereRadius,
  } = config;

  let vertexpos = 0;
  let colorpos = 0;
  let totalConnected = 0;

  // Reset connection counts
  for (let i = 0; i < particleCount; i++) {
    particlesData[i].numConnections = 0;
  }

  // Update particles and process connections
  for (let i = 0; i < particleCount; i++) {
    updateParticlePosition(
      i,
      particlePositions,
      particlesData,
      sphereRadius,
      perturbationStrength,
    );

    if (
      hasReachedConnectionLimit(
        i,
        particlesData,
        limitConnections,
        maxConnections,
      )
    ) {
      continue;
    }

    for (let j = i + 1; j < particleCount; j++) {
      if (
        shouldSkipConnection(
          particlesData[i],
          particlesData[j],
          limitConnections,
          maxConnections,
        )
      ) {
        continue;
      }

      const result = processSingleConnection(
        i,
        j,
        minDistance,
        vertexpos,
        colorpos,
        particlePositions,
        particlesData,
        positions,
        colors,
      );

      if (result.success) {
        vertexpos = result.vertexpos;
        colorpos = result.colorpos;
        totalConnected++;
      }
    }
  }

  return totalConnected;
}
