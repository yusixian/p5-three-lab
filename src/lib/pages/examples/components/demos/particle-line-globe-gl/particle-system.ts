import * as THREE from 'three';

export interface ParticleData {
  velocity: THREE.Vector3;
  numConnections: number;
}

export interface ParticleSystemConfig {
  maxParticleCount: number;
  sphereRadius: number;
  particleColor: string;
  lineColor: string;
  particleSize: number;
}

export interface ParticleSystem {
  particles: THREE.BufferGeometry;
  pointCloud: THREE.Points;
  linesMesh: THREE.LineSegments;
  particlePositions: Float32Array;
  particlesData: Array<ParticleData>;
  positions: Float32Array;
  colors: Float32Array;
}

export function createParticleLineSystem(
  config: ParticleSystemConfig,
): ParticleSystem {
  const {
    maxParticleCount,
    sphereRadius,
    particleColor,
    lineColor,
    particleSize,
  } = config;
  const rHalf = sphereRadius / 2;

  // Initialize arrays
  const particlesData: Array<ParticleData> = [];
  const segments = maxParticleCount * maxParticleCount;
  const positions = new Float32Array(segments * 3);
  const colors = new Float32Array(segments * 3);

  // Create particle material
  const pMaterial = new THREE.PointsMaterial({
    color: new THREE.Color(particleColor),
    size: particleSize,
    blending: THREE.AdditiveBlending,
    transparent: true,
    sizeAttenuation: false,
  });

  // Create particle geometry
  const particles = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(maxParticleCount * 3);

  // Initialize particle positions on sphere
  for (let i = 0; i < maxParticleCount; i++) {
    const phi = Math.acos(-1 + (2 * i) / maxParticleCount);
    const theta = Math.sqrt(maxParticleCount * Math.PI) * phi;

    particlePositions[i * 3] = rHalf * Math.cos(theta) * Math.sin(phi);
    particlePositions[i * 3 + 1] = rHalf * Math.sin(theta) * Math.sin(phi);
    particlePositions[i * 3 + 2] = rHalf * Math.cos(phi);

    particlesData.push({
      velocity: new THREE.Vector3(
        -0.5 + Math.random(),
        -0.5 + Math.random(),
        -0.5 + Math.random(),
      ).normalize(),
      numConnections: 0,
    });
  }

  particles.setAttribute(
    'position',
    new THREE.BufferAttribute(particlePositions, 3).setUsage(
      THREE.DynamicDrawUsage,
    ),
  );

  const pointCloud = new THREE.Points(particles, pMaterial);

  // Create line geometry
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage),
  );
  geometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage),
  );
  geometry.computeBoundingSphere();
  geometry.setDrawRange(0, 0);

  // Create line material
  const material = new THREE.LineBasicMaterial({
    vertexColors: true,
    color: new THREE.Color(lineColor),
    blending: THREE.AdditiveBlending,
    transparent: true,
  });

  const linesMesh = new THREE.LineSegments(geometry, material);

  return {
    particles,
    pointCloud,
    linesMesh,
    particlePositions,
    particlesData,
    positions,
    colors,
  };
}

export function updateParticlePosition(
  index: number,
  particlePositions: Float32Array,
  particlesData: Array<ParticleData>,
  sphereRadius: number,
  perturbationStrength: number,
) {
  const rHalf = sphereRadius / 2;
  const particleData = particlesData[index];

  // Update positions based on velocity
  particlePositions[index * 3] += particleData.velocity.x;
  particlePositions[index * 3 + 1] += particleData.velocity.y;
  particlePositions[index * 3 + 2] += particleData.velocity.z;

  // Project back onto the sphere
  const projected = new THREE.Vector3(
    particlePositions[index * 3],
    particlePositions[index * 3 + 1],
    particlePositions[index * 3 + 2],
  )
    .normalize()
    .multiplyScalar(rHalf);

  particlePositions[index * 3] = projected.x;
  particlePositions[index * 3 + 1] = projected.y;
  particlePositions[index * 3 + 2] = projected.z;

  // Add small perturbation to velocity
  particleData.velocity.x += (0.5 - Math.random()) * perturbationStrength;
  particleData.velocity.y += (0.5 - Math.random()) * perturbationStrength;
  particleData.velocity.z += (0.5 - Math.random()) * perturbationStrength;
  particleData.velocity.normalize();
}

export function calculateDistance(
  i: number,
  j: number,
  particlePositions: Float32Array,
): number {
  const dx = particlePositions[i * 3] - particlePositions[j * 3];
  const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
  const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function addConnection(
  i: number,
  j: number,
  alpha: number,
  vertexIndex: number,
  colorIndex: number,
  particlePositions: Float32Array,
  positions: Float32Array,
  colors: Float32Array,
) {
  positions[vertexIndex] = particlePositions[i * 3];
  positions[vertexIndex + 1] = particlePositions[i * 3 + 1];
  positions[vertexIndex + 2] = particlePositions[i * 3 + 2];
  positions[vertexIndex + 3] = particlePositions[j * 3];
  positions[vertexIndex + 4] = particlePositions[j * 3 + 1];
  positions[vertexIndex + 5] = particlePositions[j * 3 + 2];

  for (let k = 0; k < 6; k++) {
    colors[colorIndex + k] = alpha;
  }
}
