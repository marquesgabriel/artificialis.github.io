import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { BufferGeometry } from 'three';
import type { PrintObject } from '../../types';

interface Props<T extends Record<string, number>> {
  object: PrintObject<T>;
  params: T;
}

export function Viewer3D<T extends Record<string, number>>({ object, params }: Props<T>) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{
    addMesh?: (p: T) => void;
    cleanup?: () => void;
  }>({});

  // ── Init scene once ──────────────────────────────────────────────────────
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const state = stateRef.current;

    const W = el.clientWidth;
    const H = el.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0f0e0d');

    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 2000);
    camera.position.set(0, 60, 200);
    camera.lookAt(0, 30, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xe0ddd9, 0.5));
    const key = new THREE.DirectionalLight(0xe0ddd9, 1.8);
    key.position.set(-100, 50, -80);
    // key.position.set(100, 200, 100);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x0ceea3, 0.6);
    // fill.position.set(-100, 50, -80);
    fill.position.set(100, 200, 100);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffe4b5, 0.4);
    rim.position.set(0, -80, -100);
    scene.add(rim);

    // Grid
    const grid = new THREE.GridHelper(300, 90, '#b85d03', '#b85d03');
    grid.position.y = -1;
    scene.add(grid);

    // Material
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#13c76d'),
      metalness: 0.15,
      roughness: 0.45,
    });

    let mesh: THREE.Mesh | null = null;
    let geo: BufferGeometry | null = null;

    const addMesh = (p: T) => {
      if (mesh) {
        scene.remove(mesh);
        geo?.dispose();
      }
      geo = object.buildGeometry(p, 80);
      mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      const box = new THREE.Box3().setFromObject(mesh);
      const center = box.getCenter(new THREE.Vector3());
      mesh.position.sub(center);
      mesh.position.y = 0;
      scene.add(mesh);
    };
    addMesh(params);
    state.addMesh = addMesh;

    // Orbit — manual implementation
    let isDragging = false;
    let lastX = 0,
      lastY = 0;
    let rotY = 0.4,
      rotX = 0.25,
      zoom = 1;

    const onDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      lastX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      lastY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    };
    const onUp = () => {
      isDragging = false;
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
      rotY += (cx - lastX) * 0.008;
      rotX += (cy - lastY) * 0.005;
      lastX = cx;
      lastY = cy;
    };
    const onWheel = (e: WheelEvent) => {
      zoom = Math.max(0.3, Math.min(3, zoom + e.deltaY * 0.001));
      e.preventDefault();
    };
    const onResize = () => {
      const w = el.clientWidth,
        h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    el.addEventListener('mousedown', onDown);
    el.addEventListener('touchstart', onDown as EventListener);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    window.addEventListener('mousemove', onMove as EventListener);
    window.addEventListener('touchmove', onMove as EventListener);
    el.addEventListener('wheel', onWheel, { passive: false });

    // A ResizeObserver (rather than only a window 'resize' listener) also
    // self-corrects if `el` had zero size at mount time - e.g. its layout
    // depends on a separately-loaded stylesheet (src/styles/index.scss)
    // that hasn't necessarily applied yet when this effect first runs,
    // which otherwise leaves the renderer permanently sized 0x0 and the
    // canvas invisible until an unrelated window resize happens to fire.
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(el);

    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (mesh) {
        mesh.rotation.y = rotY;
        mesh.rotation.x = rotX - Math.PI / 2;
      }
      const dist = 180 * zoom;
      camera.position.set(0, dist * 0.3, dist);
      camera.lookAt(0, 10, 0);
      renderer.render(scene, camera);
    };
    animate();

    state.cleanup = () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('mousedown', onDown);
      el.removeEventListener('touchstart', onDown as EventListener);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
      window.removeEventListener('mousemove', onMove as EventListener);
      window.removeEventListener('touchmove', onMove as EventListener);
      el.removeEventListener('wheel', onWheel);
      resizeObserver.disconnect();
      renderer.dispose();
      geo?.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };

    return () => state.cleanup?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [object]); // re-init if the object type changes

  // ── Update mesh when params change ───────────────────────────────────────
  useEffect(() => {
    stateRef.current.addMesh?.(params);
  }, [params]);

  return (
    // Absolute+inset fills the parent's actual painted box directly, rather
    // than via a height:100% percentage that depends on the parent having a
    // CSS-definite height - the parent here only gets its size from flex:1
    // inside a flex column, which flexbox resolves visually but doesn't
    // count as "definite" for percentage-height resolution on children,
    // leaving this at 0 height (and the whole canvas invisible) regardless
    // of when Viewer3D measures it.
    <div
      ref={mountRef}
      style={{ position: 'absolute', inset: 0, cursor: 'grab', borderRadius: 12, overflow: 'hidden' }}
    />
  );
}
