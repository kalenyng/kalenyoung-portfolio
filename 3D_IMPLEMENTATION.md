# 3D Implementation — Enhanced Depth & Polish ✨

## 🎯 Philosophy

**Enhance, don't distract.** 3D elements add depth, texture, and modern polish without compromising performance or becoming gimmicky. Now with even more visual interest!

---

## 🧊 Components

### 1. Enhanced Hero Scene (Three.js)
**Location**: `/src/components/3d/HeroScene.tsx`

**What it does**:
- Renders **3 geometric shapes** (icosahedron, octahedron, tetrahedron) at different depths
- **100 floating particles** with size variation and additive blending
- **Dynamic particle connections** - lines appear between nearby particles
- Follows mouse cursor with smooth parallax
- Adapts colors to light/dark theme
- Lazy loads with `client:idle` directive

**Performance**:
- ✅ Only renders on desktop/tablet (≥768px)
- ✅ Caps pixel ratio at 2x
- ✅ Uses `powerPreference: 'high-performance'`
- ✅ Automatically disabled for `prefers-reduced-motion`
- ✅ Lazy initialization after mount
- ✅ Proper cleanup on unmount
- ✅ Efficient particle connection algorithm

**Visual specs**:
```typescript
Geometries: 3 shapes at different scales and positions
Material: Wireframe, 15%-9% opacity gradient, alpine color
Particles: 100 points, size variation 0.05-0.15, ember color
Connections: Dynamic lines between particles within 2 units
Animation: Variable rotation speeds, mouse parallax (0.3x)
Blend mode: Additive blending for particles, screen for scene
```

---

### 2. Background Particle Field
**Location**: `/src/components/3d/ParticleField.tsx`

**What it does**:
- Full-screen ambient particle system
- 150-200 particles with physics-based movement
- Boundary detection and velocity reversal
- Responds to mouse movement
- Additive blending for ethereal effect

**Performance**:
- ✅ Fixed position, no layout reflow
- ✅ Caps pixel ratio at 1.5x for performance
- ✅ Desktop/tablet only
- ✅ Mix-blend-mode: screen at 40% opacity
- ✅ Z-index: 0 (behind content)

---

### 3. Scroll Progress Orb
**Location**: `/src/components/3d/ScrollOrb.tsx`

**What it does**:
- Floating orb in bottom-right corner
- Rotates based on scroll progress
- Two orbital rings rotating in opposite directions
- Visual indicator of page progress
- Glowing drop shadow effect

**Specs**:
```typescript
Size: 150x150px
Position: Fixed bottom-8 right-8
Geometry: Sphere (0.8 radius) + 2 torus rings
Animation: Rotation linked to scroll progress
Glow: Drop-shadow with ember color
```

---

### 4. Floating Skill Icons
**Location**: `/src/components/3d/FloatingCard.tsx`

**What it does**:
- Miniature 3D wireframe boxes
- Float above skill category cards
- Each rotates at different speed
- Adds playful depth to skills section

**Usage**:
```tsx
<FloatingCard 
  icon="💻"      // Emoji icon
  size={60}      // Canvas size in px
  speed={1.0}    // Animation speed multiplier
/>
```

---

### 5. Card Tilt (CSS 3D)
**Location**: `/src/utils/3d-transforms.ts`

**What it does**:
- Mouse-tracking 3D tilt on project cards
- Subtle glare effect following cursor
- Smooth spring-based transitions
- Configurable via data attributes

**Usage**:
```html
<article
  data-tilt
  data-tilt-max="5"           <!-- Max tilt angle in degrees -->
  data-tilt-scale="1.01"      <!-- Scale on hover -->
  data-tilt-glare             <!-- Enable glare effect -->
>
```

**Applied to**:
- Project cards: 5° max tilt, subtle scale, with glare
- Contact cards: 3° max tilt, minimal scale
- Skill cards: 4° max tilt, minimal scale

**Performance**:
- ✅ Pure CSS 3D transforms (GPU accelerated)
- ✅ Only on desktop/tablet (≥768px)
- ✅ Respects `prefers-reduced-motion`
- ✅ Proper event cleanup

---

## 📦 Dependencies

```json
"three": "^0.160.0",        // ~600KB minified
"@types/three": "^0.160.0"  // Dev only
```

**Bundle impact**:
- Three.js: ~150KB gzipped (lazy loaded)
- Hero Scene: Shared Three.js
- Particle Field: Shared Three.js
- Scroll Orb: Shared Three.js
- Floating Cards: Shared Three.js
- 3D transforms: <1KB (pure CSS)
- **Total**: ~150KB (shared across all 3D components)

---

## 🎨 Visual Integration

### Color Adaptation
All 3D systems adapt to theme:

**Light theme**:
- Wireframes/Lines: `#1e3a34` (alpine)
- Particles: `#f76c1b` (ember)
- Orb: `#f76c1b` (ember) + `#7aa99a` (alpine rings)

**Dark theme**:
- Wireframes/Lines: `#7aa99a` (alpine bright)
- Particles: `#ff8547` (ember bright)
- Orb: `#ff8547` (ember) + `#7aa99a` (alpine rings)

### Layering
```
Z-index stack:
  Scroll Orb (z-50, fixed)
  Hero text (z-10, relative)
  Nav (z-50, fixed)
  3D Scene (z-0, absolute)
  Mountains (z-0, absolute)
  Gradient bg (z-auto, absolute)
  Particle Field (z-0, fixed, behind all)
```

---

## ⚙️ Configuration

### Three.js Scene Settings
```typescript
Camera FOV: 50°
Perspective: 0.1 - 1000 units
Position: z = 5
Pixel ratio: min(devicePixelRatio, 2)
```

### Tilt Settings
```typescript
Default options:
  max: 8°           // Maximum tilt
  perspective: 1000px
  scale: 1.02       // Hover scale
  speed: 400ms      // Transition
  glare: false      // Glare effect
```

---

## 🚀 Performance Optimizations

### 1. Lazy Loading
- Three.js component uses `client:idle` (loads after critical content)
- Scene only initializes after 100ms delay
- No 3D on mobile devices

### 2. Render Optimization
```typescript
// Capped pixel ratio
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// High performance mode
renderer = new THREE.WebGLRenderer({
  powerPreference: 'high-performance'
});

// Low poly geometry
new THREE.IcosahedronGeometry(1.5, 0); // 0 subdivisions
```

### 3. Animation Frame Management
- Single RAF loop per component
- Proper cleanup on unmount
- Smooth interpolation for camera movement

### 4. Conditional Rendering
```typescript
// Skip entirely if:
- window.innerWidth < 768
- prefers-reduced-motion: reduce
- Component not visible
```

---

## ♿ Accessibility

### Reduced Motion
```typescript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
  // Skip all 3D effects
  return;
}
```

### ARIA
```html
<div 
  class="3d-scene" 
  aria-hidden="true"  <!-- Decorative only -->
/>
```

### Focus Management
- 3D elements set to `pointer-events: none`
- No interference with keyboard navigation
- Focus rings remain on interactive elements

---

## 🧪 Browser Support

### Three.js Scene
- ✅ Chrome 90+ (WebGL 2)
- ✅ Firefox 78+
- ✅ Safari 15+
- ✅ Edge 90+

### CSS 3D Transforms
- ✅ All modern browsers
- ✅ Hardware accelerated
- ⚠️ Graceful degradation on older browsers

---

## 📊 Performance Targets

### Lighthouse Scores
- Performance: ≥90 (still meets goal)
- Accessibility: ≥95 (maintained)
- Best Practices: ≥95 (maintained)
- SEO: ≥95 (maintained)

### Frame Rate
- Target: 60 FPS on desktop
- Fallback: Disable on devices < 30 FPS
- Mobile: Skip entirely

### Load Impact
- First Contentful Paint: +0.1s (lazy loaded)
- Time to Interactive: No impact (idle loading)
- Total Blocking Time: <50ms

---

## 🎛️ Customization

### Adjust Tilt Intensity
```html
<!-- Subtle -->
<div data-tilt data-tilt-max="3">

<!-- Moderate (default) -->
<div data-tilt data-tilt-max="8">

<!-- Dramatic -->
<div data-tilt data-tilt-max="15">
```

### Modify Scene Colors
Edit `HeroScene.tsx`:
```typescript
material.color.setHex(0x1e3a34); // Change color
material.opacity = 0.15;         // Adjust opacity
```

### Change Particle Count
```typescript
const particleCount = 50; // Reduce for performance
```

---

## 🐛 Troubleshooting

### Scene Not Appearing
1. Check browser console for WebGL errors
2. Verify viewport width ≥ 768px
3. Disable reduced motion preference
4. Check Three.js loaded successfully

### Performance Issues
1. Reduce particle count (line 46 in HeroScene.tsx)
2. Disable tilt glare effect
3. Lower pixel ratio cap
4. Skip 3D on lower-end devices

### Tilt Not Working
1. Verify `data-tilt` attribute present
2. Check viewport width ≥ 768px
3. Ensure `initAllTilts()` is called
4. Verify no `prefers-reduced-motion`

---

## 🔮 Future Enhancements

Potential additions (keep lightweight):
- Scroll-linked camera movement
- Shader-based background effects
- Interactive particle system
- Geometric transitions between sections
- WebGL post-processing (bloom, DOF)

**Remember**: Always profile before adding! Maintain 60 FPS target.

---

**3D implementation complete — subtle, performant, professional.** ✨

