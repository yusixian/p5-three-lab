import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export interface ThreeSetupConfig {
  container: HTMLElement;
  isPortrait?: boolean;
  enableShadows?: boolean;
  enableOrbitControls?: boolean;
  orbitControlsConfig?: {
    enableDamping?: boolean;
    dampingFactor?: number;
    enableZoom?: boolean;
    enableRotate?: boolean;
    enablePan?: boolean;
    minDistance?: number;
    maxDistance?: number;
    autoRotate?: boolean;
    autoRotateSpeed?: number;
  };
  cameraConfig?: {
    fov?: number;
    near?: number;
    far?: number;
    position?: THREE.Vector3;
  };
}

export interface ThreeSetup {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls?: OrbitControls;
  group: THREE.Group;
}

export function createThreeSetup(config: ThreeSetupConfig): ThreeSetup {
  const {
    container,
    isPortrait,
    enableShadows,
    enableOrbitControls,
    orbitControlsConfig,
    cameraConfig,
  } = config;

  // Create scene and group
  const scene = new THREE.Scene();
  const group = new THREE.Group();
  scene.add(group);

  // Create camera
  const fov = cameraConfig?.fov ?? (isPortrait ? 70 : 40);
  const camera = new THREE.PerspectiveCamera(
    fov,
    container.clientWidth / container.clientHeight,
    cameraConfig?.near ?? 1,
    cameraConfig?.far ?? 100,
  );

  if (cameraConfig?.position) {
    camera.position.copy(cameraConfig.position);
  } else {
    camera.position.set(0, 0, 3.33);
  }
  camera.lookAt(0, 0, 0);
  camera.layers.enable(1);
  scene.add(camera);

  // Create renderer
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });

  if (enableShadows) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Create orbit controls if enabled
  let controls: OrbitControls | undefined;
  if (enableOrbitControls) {
    controls = new OrbitControls(camera, renderer.domElement);

    if (orbitControlsConfig) {
      const {
        enableDamping = true,
        dampingFactor = 0.05,
        enableZoom = true,
        enableRotate = true,
        enablePan = false,
        minDistance = 1.5,
        maxDistance = 8,
        autoRotate = false,
        autoRotateSpeed = 0.5,
      } = orbitControlsConfig;

      controls.enableDamping = enableDamping;
      controls.dampingFactor = dampingFactor;
      controls.enableZoom = enableZoom;
      controls.enableRotate = enableRotate;
      controls.enablePan = enablePan;
      controls.minDistance = minDistance;
      controls.maxDistance = maxDistance;
      controls.autoRotate = autoRotate;
      controls.autoRotateSpeed = autoRotateSpeed;
    }
  }

  return {
    scene,
    camera,
    renderer,
    controls,
    group,
  };
}

export function createLighting(camera: THREE.PerspectiveCamera) {
  const ambientLight = new THREE.AmbientLight(0xb7d4f9, 0.4);
  camera.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xf9e8cf, 1.3);
  directionalLight.position.set(0.5, 0, 0.866); // ~60º
  camera.add(directionalLight);

  return { ambientLight, directionalLight };
}

export function createResizeHandler(
  container: HTMLElement,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
) {
  return function resize() {
    if (!container) {
      return;
    }
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
}

export interface AnimationLoopConfig {
  render: () => void;
  onFrame?: (deltaTime: number, elapsedTime: number) => void;
}

export function createAnimationLoop(config: AnimationLoopConfig) {
  const { render, onFrame } = config;
  const clock = new THREE.Clock();
  let frameId: number;
  let isRunning = false;

  function animate() {
    if (!isRunning) {
      return;
    }

    frameId = requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    onFrame?.(deltaTime, elapsedTime);
    render();
  }

  return {
    start: () => {
      if (!isRunning) {
        isRunning = true;
        clock.start();
        animate();
      }
    },
    stop: () => {
      if (isRunning) {
        isRunning = false;
        if (frameId) {
          cancelAnimationFrame(frameId);
        }
        clock.stop();
      }
    },
    isRunning: () => isRunning,
  };
}

export function cleanupThreeSetup(setup: ThreeSetup) {
  setup.controls?.dispose();
  if (setup.renderer.domElement.parentNode) {
    setup.renderer.domElement.parentNode.removeChild(setup.renderer.domElement);
  }
  setup.renderer.dispose();
}
