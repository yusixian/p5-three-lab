import * as THREE from 'three';

import { noise, rotateAroundAxis } from './shaders';

// codepen Shyamatara
// https://codepen.io/prisoner849/pen/mdvjryN
export function createParticleSystem() {
  const groupParticleGlobe = new THREE.Group();

  const gu = {
    time: { value: 15 },
  };

  const v3 = new THREE.Vector3();
  const axes: Array<number> = [];
  const layers: Array<number> = [];
  const phases: Array<number> = [];
  const layersAmount = 3;
  const g = new THREE.BufferGeometry().setFromPoints(
    new Array(200000).fill(0).map(() => {
      layers.push(Math.floor(Math.random() ** 0.5 * layersAmount));
      phases.push(Math.random());
      const v = new THREE.Vector3();
      v.randomDirection();
      v3.randomDirection();
      v.cross(v3).normalize();
      axes.push(v.x, v.y, v.z);
      return v.randomDirection();
    }),
  );
  g.setAttribute('axes', new THREE.Float32BufferAttribute(axes, 3));
  g.setAttribute('layers', new THREE.Float32BufferAttribute(layers, 1));
  g.setAttribute('phases', new THREE.Float32BufferAttribute(phases, 1));

  const mu = {
    radius: { value: 3 },
  };
  const m = new THREE.PointsMaterial({
    size: 0.1,
    color: 0xffffff,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  m.onBeforeCompile = (shader) => {
    shader.uniforms.time = gu.time;
    shader.uniforms.radius = mu.radius;
    shader.vertexShader = `
    uniform float time;
    uniform float radius;
    
    attribute vec3 axes;
    attribute float layers;
    attribute float phases;
    
    varying float vIntensity;
    
    ${noise}
    ${rotateAroundAxis}
    
    float getNoise(vec3 p, float t){
      float n = snoise(vec4(p * 1., t * 2.));
      n = pow(abs(n), 0.5);
      return n;
    }
    
    vec3 getPos(vec3 p, float t){
      float n = getNoise(p, t + layers);
      float lstep = radius * 0.5 / ${layersAmount}.;
      float r = radius - layers * lstep;
      p *= (r + pow(n + 1., 2.) * 0.2);
      return p;
    }
    
    vec3 getNormal(vec3 p, float t){
      // https://stackoverflow.com/a/39296939/4045502
      float theta = .1; 
      vec3 vecTangent = normalize(cross(p, vec3(1.0, 0.0, 0.0)) + cross(p, vec3(0.0, 1.0, 0.0)));
      vec3 vecBitangent = normalize(cross(vecTangent, p));
      vec3 ptTangentSample = getPos(normalize(p + theta * normalize(vecTangent)), t);
      vec3 ptBitangentSample = getPos(normalize(p + theta * normalize(vecBitangent)), t);
      
      return normalize(cross(ptBitangentSample - p, ptTangentSample - p));
    }
    ${shader.vertexShader}
  `
      .replace(
        `#include <begin_vertex>`,
        `#include <begin_vertex>
      float t = time * 0.1;
      
      mat4 rot = rotationMatrix(axes, phases + t);
      vec3 pos = vec3(rot * vec4(position, 1.));
      pos = getPos(pos, t);
      vec3 nor = getNormal(pos, t);
      vIntensity = 1. - clamp(dot(nor, normalize(pos)), 0., 1.);
      
      transformed = pos; 
    `,
      )
      .replace(
        `gl_PointSize = size;`,
        `
        float sizeFactor = 1. - (1./ ${layersAmount}. * layers);
        gl_PointSize = size * pow(vIntensity, 0.5) * sizeFactor;`,
      );
    //console.log(shader.vertexShader)
    shader.fragmentShader = `
    varying float vIntensity;
    ${shader.fragmentShader}
  `.replace(
      `#include <color_fragment>`,
      `#include <color_fragment>
      
      vec2 uv = (gl_PointCoord.xy - 0.5) * 2.;
      if (length(uv) > 1.) discard;
      
      diffuseColor.rgb *= vIntensity;
      diffuseColor.rgb += 0.2 * vIntensity;
      
      diffuseColor.a = 0.5 + vIntensity * 0.5;
      
      float radialAlpha = smoothstep(1., 0.5, length(uv));
      diffuseColor.a *= radialAlpha;
    `,
    );
    //console.log(shader.fragmentShader)
  };

  const p = new THREE.Points(g, m);
  groupParticleGlobe.add(p);
  groupParticleGlobe.scale.set(0.28, 0.28, 0.28);

  return { groupParticleGlobe, gu };
}
