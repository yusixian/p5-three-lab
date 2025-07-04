import { Leva, useControls } from 'leva';
import { useEffect, useRef } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 粒子数据类型定义
interface ParticleData {
  velocity: THREE.Vector3;
  numConnections: number;
}

// Three.js 对象类型定义
interface ThreeObjects {
  camera?: THREE.PerspectiveCamera;
  scene?: THREE.Scene;
  renderer?: THREE.WebGLRenderer;
  controls?: OrbitControls;
  group?: THREE.Group;
  particles?: THREE.BufferGeometry;
  pointCloud?: THREE.Points;
  linesMesh?: THREE.LineSegments;
  geometry?: THREE.BufferGeometry;
  pMaterial?: THREE.PointsMaterial;
  material?: THREE.LineBasicMaterial;
}

// 粒子参数控制器
const maxParticleCount = 1000;
const r = 800;
const rHalf = r / 2;

export const ParticleLineGlobeGLDemo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const threeObjects = useRef<ThreeObjects>({});
  const animationId = useRef<number>(undefined);

  // 使用 leva 控制参数
  const controls = useControls('粒子球体控制', {
    showDots: true,
    showLines: true,
    minDistance: { value: 80, min: 10, max: 300 },
    limitConnections: false,
    maxConnections: { value: 20, min: 0, max: 30, step: 1 },
    particleCount: { value: 500, min: 0, max: maxParticleCount, step: 1 },
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

    // three.js 相关对象
    const particlesData: Array<ParticleData> = [];

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      1,
      4000,
    );
    camera.position.z = 1050;

    const orbitControls = new OrbitControls(camera, container);
    orbitControls.minDistance = 1000;
    orbitControls.maxDistance = 3000;

    const scene = new THREE.Scene();
    const group = new THREE.Group();
    scene.add(group);

    // 粒子数据
    const segments = maxParticleCount * maxParticleCount;
    const positions = new Float32Array(segments * 3);
    const colors = new Float32Array(segments * 3);

    const pMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(controls.particleColor),
      size: controls.particleSize,
      blending: THREE.AdditiveBlending,
      transparent: true,
      sizeAttenuation: false,
    });

    const particles = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(maxParticleCount * 3);

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

    particles.setDrawRange(0, controls.particleCount);
    particles.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3).setUsage(
        THREE.DynamicDrawUsage,
      ),
    );

    const pointCloud = new THREE.Points(particles, pMaterial);
    group.add(pointCloud);

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

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      color: new THREE.Color(controls.lineColor),
      blending: THREE.AdditiveBlending,
      transparent: true,
    });

    const linesMesh = new THREE.LineSegments(geometry, material);
    group.add(linesMesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0); // transparent
    container.appendChild(renderer.domElement);

    // 保存对象引用，便于清理
    threeObjects.current = {
      camera,
      scene,
      renderer,
      controls: orbitControls,
      group,
      particles,
      pointCloud,
      linesMesh,
      geometry,
      pMaterial,
      material,
    };

    // 监听容器尺寸变化
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

    // 更新粒子位置
    function updateParticlePosition(i: number, perturbationStrength: number) {
      const particleData = particlesData[i];
      // Update positions based on velocity
      particlePositions[i * 3] += particleData.velocity.x;
      particlePositions[i * 3 + 1] += particleData.velocity.y;
      particlePositions[i * 3 + 2] += particleData.velocity.z;

      // Project back onto the sphere
      const projected = new THREE.Vector3(
        particlePositions[i * 3],
        particlePositions[i * 3 + 1],
        particlePositions[i * 3 + 2],
      )
        .normalize()
        .multiplyScalar(rHalf);

      particlePositions[i * 3] = projected.x;
      particlePositions[i * 3 + 1] = projected.y;
      particlePositions[i * 3 + 2] = projected.z;

      // Introduce a small perturbation to the velocity
      particleData.velocity.x += (0.5 - Math.random()) * perturbationStrength;
      particleData.velocity.y += (0.5 - Math.random()) * perturbationStrength;
      particleData.velocity.z += (0.5 - Math.random()) * perturbationStrength;
      particleData.velocity.normalize();
    }

    // 计算粒子距离
    function calculateDistance(i: number, j: number) {
      const dx = particlePositions[i * 3] - particlePositions[j * 3];
      const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
      const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    // 添加连接线
    function addConnection(
      i: number,
      j: number,
      alpha: number,
      vertexIndex: number,
      colorIndex: number,
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

    // 检查连接限制
    function shouldSkipConnection(
      particleData: ParticleData,
      particleDataB: ParticleData,
      limitConnections: boolean,
      maxConnections: number,
    ) {
      return (
        limitConnections &&
        (particleData.numConnections >= maxConnections ||
          particleDataB.numConnections >= maxConnections)
      );
    }

    // 处理单个连接
    function processSingleConnection(
      i: number,
      j: number,
      minDistance: number,
      vertexpos: number,
      colorpos: number,
    ) {
      const dist = calculateDistance(i, j);
      if (dist >= minDistance) {
        return { success: false, vertexpos, colorpos };
      }

      particlesData[i].numConnections++;
      particlesData[j].numConnections++;
      const alpha = 1.0 - dist / minDistance;

      addConnection(i, j, alpha, vertexpos, colorpos);
      return {
        success: true,
        vertexpos: vertexpos + 6,
        colorpos: colorpos + 6,
      };
    }

    // 检查是否已达到连接限制
    function hasReachedConnectionLimit(
      particleIndex: number,
      limitConnections: boolean,
      maxConnections: number,
    ) {
      return (
        limitConnections &&
        particlesData[particleIndex].numConnections >= maxConnections
      );
    }

    // 处理单个粒子的所有连接
    function processSingleParticleConnections(
      i: number,
      particleCount: number,
      minDistance: number,
      limitConnections: boolean,
      maxConnections: number,
      startVertexPos: number,
      startColorPos: number,
    ) {
      let vertexpos = startVertexPos;
      let colorpos = startColorPos;
      let numConnected = 0;

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
        );
        if (result.success) {
          vertexpos = result.vertexpos;
          colorpos = result.colorpos;
          numConnected++;
        }
      }

      return { vertexpos, colorpos, numConnected };
    }

    // 处理粒子连接
    function processConnections(
      i: number,
      particleCount: number,
      minDistance: number,
      limitConnections: boolean,
      maxConnections: number,
      startVertexPos: number,
      startColorPos: number,
    ) {
      if (hasReachedConnectionLimit(i, limitConnections, maxConnections)) {
        return {
          vertexpos: startVertexPos,
          colorpos: startColorPos,
          numConnected: 0,
        };
      }

      return processSingleParticleConnections(
        i,
        particleCount,
        minDistance,
        limitConnections,
        maxConnections,
        startVertexPos,
        startColorPos,
      );
    }

    // 重置粒子连接数
    function resetParticleConnections(particleCount: number) {
      for (let i = 0; i < particleCount; i++) {
        particlesData[i].numConnections = 0;
      }
    }

    // 更新粒子和处理连接
    function updateParticlesAndConnections(
      particleCount: number,
      minDistance: number,
      limitConnections: boolean,
      maxConnections: number,
      perturbationStrength: number,
    ) {
      let vertexpos = 0;
      let colorpos = 0;
      let totalConnected = 0;

      for (let i = 0; i < particleCount; i++) {
        updateParticlePosition(i, perturbationStrength);
        const result = processConnections(
          i,
          particleCount,
          minDistance,
          limitConnections,
          maxConnections,
          vertexpos,
          colorpos,
        );
        vertexpos = result.vertexpos;
        colorpos = result.colorpos;
        totalConnected += result.numConnected;
      }

      return totalConnected;
    }

    // 更新渲染对象
    function updateRenderObjects(totalConnected: number) {
      linesMesh.geometry.setDrawRange(0, totalConnected * 2);
      linesMesh.geometry.attributes.position.needsUpdate = true;
      linesMesh.geometry.attributes.color.needsUpdate = true;
      pointCloud.geometry.attributes.position.needsUpdate = true;
    }

    // 动画循环
    function animate() {
      const {
        particleCount,
        minDistance,
        limitConnections,
        maxConnections,
        perturbationStrength,
      } = controls;

      resetParticleConnections(particleCount);

      const totalConnected = updateParticlesAndConnections(
        particleCount,
        minDistance,
        limitConnections,
        maxConnections,
        perturbationStrength,
      );

      updateRenderObjects(totalConnected);
      animationId.current = requestAnimationFrame(animate);
      render();
    }

    function render() {
      const time = Date.now() * 0.001;
      group.rotation.y = time * 0.1;
      renderer.render(scene, camera);
    }

    animate();

    // 清理函数
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
      observer.disconnect();
      threeObjects.current.controls?.dispose();
      threeObjects.current.particles?.dispose();
      threeObjects.current.pointCloud?.geometry.dispose();
      (threeObjects.current.pointCloud?.material as THREE.Material).dispose();
      threeObjects.current.linesMesh?.geometry.dispose();
      (threeObjects.current.linesMesh?.material as THREE.Material).dispose();
      threeObjects.current.renderer?.dispose();
      threeObjects.current.renderer?.domElement.parentNode?.removeChild(
        threeObjects.current.renderer?.domElement,
      );
    };
  }, [controls]);

  // 更新 Three.js 材质属性
  useEffect(() => {
    const { pointCloud, linesMesh } = threeObjects.current;
    if (pointCloud && pointCloud.material instanceof THREE.PointsMaterial) {
      pointCloud.visible = controls.showDots;
      pointCloud.material.size = controls.particleSize;
      pointCloud.material.color.set(controls.particleColor);
    }
    if (linesMesh) {
      linesMesh.visible = controls.showLines;
      (linesMesh.material as THREE.LineBasicMaterial).color.set(
        controls.lineColor,
      );
    }
  }, [
    controls.showDots,
    controls.showLines,
    controls.particleSize,
    controls.particleColor,
    controls.lineColor,
  ]);

  // 更新粒子绘制范围
  useEffect(() => {
    const { particles } = threeObjects.current;
    if (particles) {
      particles.setDrawRange(0, controls.particleCount);
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
