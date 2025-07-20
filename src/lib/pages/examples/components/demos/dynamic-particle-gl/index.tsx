/** biome-ignore-all lint/nursery/useUniqueElementIds: React component with dynamic IDs that are guaranteed to be unique by React's reconciliation */

import { Leva, useControls } from 'leva';
import { ArrowLeft, ArrowRight, PauseIcon, PlayIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/lib/components/ui/button';
import { DynamicParticleGL } from '@/lib/pages/examples/components/demos/dynamic-particle-gl/dynamic-particle-gl';
import { cn } from '@/lib/utils';

// Image source configuration
const getSourceImgInfos = (isMobile: boolean) => [
  {
    url: '/img/gl/cosine-logo.png',
    scaleNum: isMobile ? 0.8 : 1.25,
    resize: [477, 288],
    loadPercentage: 0.006,
    resolution: isMobile ? 15 : 4,
  },
  {
    url: '/img/gl/cosine-gallery-logo.png',
    scaleNum: isMobile ? 0.8 : 1.25,
    resize: [478, 276],
    loadPercentage: 0.006,
    resolution: isMobile ? 15 : 4,
  },
  {
    url: '/img/gl/moe-copy-ai-favicon.png',
    scaleNum: isMobile ? 0.8 : 1.25,
    resize: [251, 274],
    loadPercentage: 0.006,
    resolution: isMobile ? 15 : 4,
  },
];

// Image names mapping
const imageNames = [
  'Cosine Logo',
  'Cosine Gallery Logo',
  'Moe Copy AI Favicon',
];

// Configuration display definitions
const imageConfigFields = [
  {
    key: 'imageSize',
    label: 'Image Size',
    getValue: (imageInfo: any) =>
      `${imageInfo.resize?.[0]} × ${imageInfo.resize?.[1]}`,
    description: 'Controls the visual size multiplier of the particle system',
  },
  {
    key: 'scaleFactor',
    label: 'Scale Factor',
    getValue: (imageInfo: any) => `${imageInfo.scaleNum}×`,
    description: 'Determines the density of pixel sampling from source image',
  },
  {
    key: 'loadPercentage',
    label: 'Load Percentage',
    getValue: (imageInfo: any) =>
      `${(imageInfo.loadPercentage * 100).toFixed(1)}%`,
    description: 'Lower values create finer particle details',
  },
  {
    key: 'resolutionLevel',
    label: 'Resolution Level',
    getValue: (imageInfo: any) => `${imageInfo.resolution}`,
    description: 'Controls the sampling resolution for particle generation',
  },
];

const particleConfigFields = [
  {
    key: 'particleSize',
    label: 'Particle Size',
    getValue: (config: any) => `${config.particleSize}px`,
    description: 'The render size of each particle point',
  },
  {
    key: 'movementSpeed',
    label: 'Movement Speed',
    getValue: (config: any) => `${config.speed}x`,
    description: 'Speed multiplier for particles moving to target positions',
  },
  {
    key: 'targetDistance',
    label: 'Target Distance',
    getValue: (config: any) => `${config.closeEnoughTarget}px`,
    description:
      'Distance at which particles start decelerating when approaching target',
  },
  {
    key: 'mouseInfluence',
    label: 'Mouse Influence',
    getValue: (config: any) => `${config.mouseSize}px`,
    description: 'Range of mouse influence on particles',
  },
  {
    key: 'maxSpeedRange',
    label: 'Max Speed Range',
    getValue: (config: any) =>
      `${config.maxSpeedRange[0]} - ${config.maxSpeedRange[1]}`,
    description: 'Random maximum movement speed range for each particle',
  },
  {
    key: 'maxForceRange',
    label: 'Max Force Range',
    getValue: (config: any) =>
      `${config.maxForceRange[0]} - ${config.maxForceRange[1]}`,
    description: 'Random maximum force limit range for each particle',
  },
  {
    key: 'colorBlendRate',
    label: 'Color Blend Rate',
    getValue: (config: any) =>
      `${config.colorBlendRate[0]} - ${config.colorBlendRate[1]}`,
    description: 'Rate at which particle colors transition to target colors',
  },
  {
    key: 'noiseScale',
    label: 'Noise Scale',
    getValue: (config: any) => `${config.noiseScale}`,
    description: 'Scaling factor for noise added to particle movement',
  },
  {
    key: 'noiseStrength',
    label: 'Noise Strength',
    getValue: (config: any) => `${config.noiseStrength}`,
    description: 'Strength of noise influence on particle movement',
  },
  {
    key: 'scaleRatio',
    label: 'Scale Ratio',
    getValue: (config: any) => `${config.scaleRatio}x`,
    description: 'Scale ratio for mouse coordinate mapping',
  },
];

const systemStatusFields = [
  {
    key: 'animationState',
    label: 'Animation State',
    getValue: (active: boolean) => (active ? 'Running' : 'Paused'),
    description: 'Current animation playback state',
  },
  {
    key: 'imageIndex',
    label: 'Image Index',
    getValue: (imageIdx: number, total: number) => `${imageIdx + 1} / ${total}`,
    description: 'Current active image in the sequence',
  },
  {
    key: 'deviceType',
    label: 'Device Type',
    getValue: (isMobile: boolean) => (isMobile ? 'Mobile' : 'Desktop'),
    description: 'Detected device type for optimized rendering',
  },
  {
    key: 'totalParticles',
    label: 'Total Particles',
    getValue: () => 'Dynamic',
    description: 'Number of particles generated based on image sampling',
  },
];

// Reusable configuration grid component
const ConfigGrid = ({
  title,
  fields,
  data,
  cols = 'lg:grid-cols-3',
}: {
  title: string;
  fields: Array<{
    key: string;
    label: string;
    getValue: (...args: Array<any>) => string;
    description?: string;
  }>;
  data: any;
  cols?: string;
}) => (
  <div className="mt-2">
    <h4 className="mb-2 text-center font-medium text-foreground text-sm">
      {title}
    </h4>
    <div
      className={`grid grid-cols-2 gap-2 rounded-lg border border-border/50 bg-muted/10 p-2 md:grid-cols-3 ${cols}`}
    >
      {fields.map((field) => (
        <div key={field.key} className="text-center">
          <div className="mb-0.5 font-medium text-muted-foreground text-xs">
            {field.label}
          </div>
          <div className="font-mono text-foreground text-xs">
            {Array.isArray(data)
              ? field.getValue(...data)
              : field.getValue(data)}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Interactive instructions configuration
const interactiveInstructions = [
  {
    id: 'mouse-hover',
    action: 'Mouse Hover',
    description:
      'Particles are repelled by the mouse cursor, creating dynamic effects',
  },
  {
    id: 'mouse-drag',
    action: 'Mouse Click & Drag',
    description: 'Particles are attracted to mouse position during drag',
  },
  {
    id: 'particle-behavior',
    action: 'Particle Behavior',
    description:
      'Each particle seeks its target position while being influenced by noise and mouse interaction',
  },
];

export const DynamicParticleGLDemo = () => {
  const [active, setActive] = useState(true);
  const [imageIdx, setImageIdx] = useState(0);
  const isMobile = false; // Simplified for demo, should use hook in real project

  // Leva controls for real-time particle configuration
  const particleControls = useControls('Particle System', {
    // Basic particle properties
    particleSize: { value: isMobile ? 4 : 5, min: 1, max: 20, step: 1 },
    speed: { value: 3, min: 0.1, max: 10, step: 0.1 },

    // Target and interaction
    closeEnoughTarget: { value: 100, min: 10, max: 500, step: 10 },
    mouseSize: { value: 50, min: 10, max: 200, step: 5 },

    // Force ranges
    maxSpeedMin: { value: 0.25, min: 0.1, max: 5, step: 0.05 },
    maxSpeedMax: { value: 2, min: 0.5, max: 10, step: 0.1 },
    maxForceMin: { value: 8, min: 1, max: 20, step: 0.5 },
    maxForceMax: { value: 15, min: 5, max: 50, step: 0.5 },

    // Color blending
    colorBlendMin: { value: 0.01, min: 0.001, max: 0.1, step: 0.001 },
    colorBlendMax: { value: 0.05, min: 0.01, max: 0.2, step: 0.001 },

    // Noise settings
    noiseScale: { value: 0.005, min: 0.001, max: 0.02, step: 0.001 },
    noiseStrength: { value: 0.6, min: 0, max: 2, step: 0.1 },

    scaleRatio: { value: 1, min: 0.1, max: 3, step: 0.1 },
  });

  // Convert Leva controls to particle config format
  const particleConfig = {
    closeEnoughTarget: particleControls.closeEnoughTarget,
    speed: particleControls.speed,
    particleSize: particleControls.particleSize,
    mouseSize: particleControls.mouseSize,
    scaleRatio: particleControls.scaleRatio,
    maxSpeedRange: [
      particleControls.maxSpeedMin,
      particleControls.maxSpeedMax,
    ] as [number, number],
    maxForceRange: [
      particleControls.maxForceMin,
      particleControls.maxForceMax,
    ] as [number, number],
    colorBlendRate: [
      particleControls.colorBlendMin,
      particleControls.colorBlendMax,
    ] as [number, number],
    noiseScale: particleControls.noiseScale,
    noiseStrength: particleControls.noiseStrength,
  };

  // Get current image info
  const currentImageInfo = getSourceImgInfos(isMobile)[imageIdx];
  const totalImages = getSourceImgInfos(isMobile).length;

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center gap-4">
        <Button onClick={() => setActive(!active)}>
          {active ? <PauseIcon /> : <PlayIcon />}
        </Button>
        <Button
          onClick={() => {
            if (imageIdx > 0) {
              setImageIdx(imageIdx - 1);
            } else {
              setImageIdx(2);
            }
          }}
        >
          <ArrowLeft />
        </Button>
        <span className="min-w-[80px] text-center font-medium">
          {imageIdx + 1} / {totalImages}
        </span>
        <Button
          onClick={() => {
            if (imageIdx < 2) {
              setImageIdx(imageIdx + 1);
            } else {
              setImageIdx(0);
            }
          }}
        >
          <ArrowRight />
        </Button>
      </div>
      <div className="relative">
        <DynamicParticleGL
          activeAnim={active}
          imageIdx={imageIdx}
          getSourceImgInfos={getSourceImgInfos}
          particleConfig={particleConfig}
        />
        <div id="particle-container">
          <div className={cn({ active })}></div>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-1">
        <div className="flex gap-4">
          <div>
            {/* Leva Control Panel */}
            <Leva
              fill
              titleBar={false}
              oneLineLabels={false}
              collapsed={false}
            />
          </div>
          <div className="relative overflow-hidden rounded-lg border border-border bg-muted/20 p-2">
            <img
              src={currentImageInfo.url}
              alt={imageNames[imageIdx]}
              className="max-h-60 w-auto object-contain"
            />
            <p className="text-center text-muted-foreground text-xs">
              {imageNames[imageIdx]}
            </p>
          </div>
        </div>

        {/* Configuration Grid - More Compact Layout */}
        <div className="w-full space-y-1">
          <div className="mt-3 flex flex-col items-center">
            <h3 className="font-semibold text-base text-foreground">
              Current Particle Source Image
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
            {/* Image Configuration */}
            <ConfigGrid
              title="Image Configuration"
              fields={imageConfigFields}
              data={currentImageInfo}
              cols="grid-cols-2"
            />

            {/* System Status */}
            <ConfigGrid
              title="System Status"
              fields={systemStatusFields}
              data={[active, imageIdx, totalImages, isMobile]}
              cols="grid-cols-2"
            />

            {/* Configuration Summary */}
            <div className="mt-2">
              <h4 className="mb-2 text-center font-medium text-foreground text-sm">
                Summary
              </h4>
              <div className="space-y-1 rounded-lg border border-border/50 bg-muted/10 p-2">
                <div className="grid grid-cols-1 gap-1">
                  <div className="rounded border border-border/30 bg-muted/5 p-1.5 text-center">
                    <p className="font-medium text-xs">Image Processing</p>
                    <p className="text-muted-foreground text-xs">
                      Resolution & Sampling
                    </p>
                  </div>
                  <div className="rounded border border-border/30 bg-muted/5 p-1.5 text-center">
                    <p className="font-medium text-xs">Particle Behavior</p>
                    <p className="text-muted-foreground text-xs">
                      Movement & Forces
                    </p>
                  </div>
                  <div className="rounded border border-border/30 bg-muted/5 p-1.5 text-center">
                    <p className="font-medium text-xs">Visual Effects</p>
                    <p className="text-muted-foreground text-xs">
                      Color & Noise
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Particle System Configuration - Full Width */}
          <ConfigGrid
            title="Particle System Configuration"
            fields={particleConfigFields}
            data={particleConfig}
            cols="lg:grid-cols-5 md:grid-cols-4 grid-cols-3"
          />
        </div>

        {/* Interactive Instructions */}
        <div className="mt-1 rounded-lg border border-blue-200 bg-blue-50 p-2 dark:border-blue-800 dark:bg-blue-950/30">
          <h5 className="mb-1 font-medium text-blue-900 text-sm dark:text-blue-100">
            🎮 Interactive Instructions
          </h5>
          <div className="space-y-0.5 text-blue-800 text-xs dark:text-blue-200">
            {interactiveInstructions.map((instruction) => (
              <p key={instruction.id}>
                <strong>{instruction.action}:</strong> {instruction.description}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
