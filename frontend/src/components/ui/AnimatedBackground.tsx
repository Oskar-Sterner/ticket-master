/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MathUtils, Color } from "three";

function WavyPlane() {
  const ref = useRef<any>(null);
  const [globalMouse, setGlobalMouse] = useState({ x: 0, y: 0 });

  const { uniforms, planeGeometryArgs, shaderMaterialWireframe } =
    useMemo(() => {
      const uniforms = {
        u_time: { value: 0 },
        u_mouse: { value: { x: 0, y: 0 } },
        u_color1: { value: new Color("#0398fc") },
        u_color2: { value: new Color("#5aaded") },
      };

      return {
        uniforms,
        planeGeometryArgs: [40, 40, 75, 75] as [number, number, number, number],
        shaderMaterialWireframe: true,
      };
    }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setGlobalMouse({ x, y });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    const { clock } = state;
    if (ref.current) {
      ref.current.material.uniforms.u_time.value = clock.getElapsedTime();
      ref.current.material.uniforms.u_mouse.value.x = MathUtils.lerp(
        ref.current.material.uniforms.u_mouse.value.x,
        globalMouse.x,
        0.05
      );
      ref.current.material.uniforms.u_mouse.value.y = MathUtils.lerp(
        ref.current.material.uniforms.u_mouse.value.y,
        globalMouse.y,
        0.05
      );
    }
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 1.3, 0, 0]}>
      <planeGeometry args={planeGeometryArgs} />
      <shaderMaterial
        wireframe={shaderMaterialWireframe}
        uniforms={uniforms}
        vertexShader={`
          uniform float u_time;
          uniform vec2 u_mouse;
          varying vec2 vUv;

          void main() {
            vUv = uv;
            vec3 pos = position;
            
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vec4 viewPos = viewMatrix * worldPos;
            vec4 projPos = projectionMatrix * viewPos;
            vec2 screenPos = projPos.xy / projPos.w;
            
            float dist = distance(screenPos, u_mouse);
            float strength = smoothstep(0.15, 0.0, dist) * 0.3;
            
            pos.z += sin(pos.x * 2.0 + u_time) * 0.1;
            pos.z += cos(pos.y * 2.0 + u_time) * 0.1;
            pos.z -= strength;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform float u_time;
          uniform vec3 u_color1;
          uniform vec3 u_color2;
          varying vec2 vUv;

          void main() {
            float brightness = sin(vUv.x * 2.0 + u_time * 0.2) * 0.1 + 0.15;
            brightness += cos(vUv.y * 2.0 + u_time * 0.2) * 0.1 + 0.15;
            
            float mixFactor = (sin(vUv.y * 4.0 + u_time * 0.4) + 1.0) / 2.0;
            vec3 finalColor = mix(u_color1, u_color2, mixFactor);

            gl_FragColor = vec4(finalColor * brightness, 0.15);
          }
        `}
      />
    </mesh>
  );
}

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 6.5, 5], fov: 75 }}
        style={{ pointerEvents: "none" }}
      >
        <WavyPlane />
      </Canvas>
    </div>
  );
}
