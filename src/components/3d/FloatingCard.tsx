import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FloatingCardProps {
  icon?: string;
  size?: number;
  speed?: number;
}

export default function FloatingCard({ icon = '💻', size = 80, speed = 1 }: FloatingCardProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    });
    
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Create card geometry
    const geometry = new THREE.BoxGeometry(1, 1, 0.1);
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0xf76c1b,
      transparent: true,
      opacity: 0.6
    });
    
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    scene.add(wireframe);

    camera.position.z = 2;

    let time = Math.random() * 100;

    const animate = () => {
      requestAnimationFrame(animate);
      
      time += 0.01 * speed;
      
      wireframe.rotation.x = Math.sin(time * 0.5) * 0.2;
      wireframe.rotation.y = time * 0.3;
      wireframe.position.y = Math.sin(time) * 0.1;
      
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      edges.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, [size, speed]);

  return (
    <div 
      ref={mountRef} 
      className="pointer-events-none"
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}

