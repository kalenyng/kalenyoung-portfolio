import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function ScrollOrb() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrolled / maxScroll;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return;

    const size = 150;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    });
    
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Create orb with rings
    const orbGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const orbMaterial = new THREE.MeshBasicMaterial({
      color: 0xf76c1b,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    scene.add(orb);

    // Add rings
    const ringGeometry = new THREE.TorusGeometry(1.2, 0.02, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x7aa99a,
      transparent: true,
      opacity: 0.5
    });
    
    const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring1.rotation.x = Math.PI / 2;
    scene.add(ring1);
    
    const ring2 = new THREE.Mesh(ringGeometry, ringMaterial.clone());
    ring2.rotation.y = Math.PI / 2;
    scene.add(ring2);

    camera.position.z = 3;

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate based on scroll
      orb.rotation.y = scrollProgress * Math.PI * 4;
      orb.rotation.x = scrollProgress * Math.PI * 2;
      
      ring1.rotation.z += 0.01;
      ring2.rotation.z -= 0.01;
      
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      orbGeometry.dispose();
      orbMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      renderer.dispose();
    };
  }, [scrollProgress]);

  return (
    <div 
      className="fixed bottom-8 right-8 z-50 hidden md:block"
      aria-hidden="true"
    >
      <div 
        ref={mountRef}
        className="pointer-events-none"
        style={{
          filter: 'drop-shadow(0 0 20px rgba(247, 108, 27, 0.3))'
        }}
      />
    </div>
  );
}

