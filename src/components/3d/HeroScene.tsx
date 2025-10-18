import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Only render on desktop/tablet
    if (window.innerWidth < 768) return;

    // Lazy initialization after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible || !mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    });
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2x for performance
    mountRef.current.appendChild(renderer.domElement);

    // Get theme colors from CSS variables
    const computedStyle = getComputedStyle(document.documentElement);
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    
    // Create multiple geometric shapes
    const geometries = [
      new THREE.IcosahedronGeometry(1.5, 0),
      new THREE.OctahedronGeometry(1.2, 0),
      new THREE.TetrahedronGeometry(0.8, 0),
    ];
    
    const meshes: THREE.Mesh[] = [];
    
    geometries.forEach((geometry, i) => {
      const material = new THREE.MeshBasicMaterial({
        color: theme === 'dark' ? 0x7aa99a : 0x1e3a34,
        wireframe: true,
        transparent: true,
        opacity: 0.15 - (i * 0.03),
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (i - 1) * 2,
        Math.sin(i) * 1.5,
        -i * 0.5
      );
      scene.add(mesh);
      meshes.push(mesh);
    });

    // Add enhanced particle system
    const particleCount = 100; // Doubled
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 15;
      positions[i + 1] = (Math.random() - 0.5) * 15;
      positions[i + 2] = (Math.random() - 0.5) * 15;
      sizes[i / 3] = Math.random() * 0.1 + 0.05;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: theme === 'dark' ? 0xff8547 : 0xf76c1b,
      size: 0.08,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Add connecting lines between nearby particles
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({
      color: theme === 'dark' ? 0x7aa99a : 0x1e3a34,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    camera.position.z = 5;

    // Animation
    let animationFrameId: number;
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse position to -1 to 1 range
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
      
      // Calculate target rotation based on cursor position (reduced for subtlety)
      targetRotationY = mouseX * 0.05; // Horizontal tilt (reduced from 0.15)
      targetRotationX = -mouseY * 0.05; // Vertical tilt (reduced from 0.15)
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth camera rotation (lerp for smooth interpolation)
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;

      camera.rotation.x = currentRotationX;
      camera.rotation.y = currentRotationY;
      camera.position.set(0, 0, 5); // Keep position fixed, only rotate

      // Rotate geometries with different speeds
      meshes.forEach((mesh, i) => {
        mesh.rotation.x += 0.002 * (1 + i * 0.2);
        mesh.rotation.y += 0.003 * (1 + i * 0.3);
      });

      // Animate particles
      particleSystem.rotation.y += 0.0008;
      particleSystem.rotation.x += 0.0003;

      // Update particle connections
      const particlePositions = particles.attributes.position.array as Float32Array;
      const linePositions: number[] = [];
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        for (let j = i + 1; j < particleCount; j++) {
          const j3 = j * 3;
          const dx = particlePositions[i3] - particlePositions[j3];
          const dy = particlePositions[i3 + 1] - particlePositions[j3 + 1];
          const dz = particlePositions[i3 + 2] - particlePositions[j3 + 2];
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (distance < 2) {
            linePositions.push(
              particlePositions[i3], particlePositions[i3 + 1], particlePositions[i3 + 2],
              particlePositions[j3], particlePositions[j3 + 1], particlePositions[j3 + 2]
            );
          }
        }
      }
      
      if (linePositions.length > 0) {
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Handle theme changes
    const handleThemeChange = () => {
      const newTheme = document.documentElement.getAttribute('data-theme') || 'light';
      meshes.forEach(mesh => {
        (mesh.material as THREE.MeshBasicMaterial).color.setHex(
          newTheme === 'dark' ? 0x7aa99a : 0x1e3a34
        );
      });
      particleMaterial.color.setHex(newTheme === 'dark' ? 0xff8547 : 0xf76c1b);
      lineMaterial.color.setHex(newTheme === 'dark' ? 0x7aa99a : 0x1e3a34);
    };

    // Observe theme changes
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      geometries.forEach(g => g.dispose());
      meshes.forEach(m => (m.material as THREE.Material).dispose());
      particles.dispose();
      particleMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={mountRef}
      className="pointer-events-none absolute inset-0"
      style={{
        opacity: 0.6,
        mixBlendMode: 'screen',
      }}
      aria-hidden="true"
    />
  );
}

