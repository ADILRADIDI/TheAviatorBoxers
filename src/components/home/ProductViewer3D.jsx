import { useEffect, useRef, useState } from "react";
import { Move3d, ZoomIn } from "lucide-react";
import { useLanguage } from "@/lib/language";

const NAVY_DEEP = 0x0a1f3e;
const LIME = 0xc8d600;

function buildBoxerGroup(THREE) {
  const group = new THREE.Group();
  const fabricMat = new THREE.MeshStandardMaterial({ color: 0x0b2a55, roughness: 0.55, metalness: 0.18, flatShading: true });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x0a3a6b, roughness: 0.6, metalness: 0.2, flatShading: true });
  const limeMat = new THREE.MeshStandardMaterial({ color: LIME, roughness: 0.35, metalness: 0.4, flatShading: true });

  const waist = new THREE.Mesh(new THREE.TorusGeometry(0.98, 0.17, 18, 40), fabricMat);
  waist.rotation.x = Math.PI / 2;
  waist.position.y = 0.78;
  group.add(waist);

  const rimTop = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.035, 10, 40), limeMat);
  rimTop.rotation.x = Math.PI / 2;
  rimTop.position.y = 0.985;
  group.add(rimTop);

  const rimBottom = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.035, 10, 40), limeMat);
  rimBottom.rotation.x = Math.PI / 2;
  rimBottom.position.y = 0.55;
  group.add(rimBottom);

  const hip = new THREE.Mesh(new THREE.SphereGeometry(0.62, 24, 20), fabricMat);
  hip.scale.set(0.62, 0.52, 0.72);
  hip.position.set(0, 0.34, 0.02);
  group.add(hip);

  [-0.46, 0.46].forEach((x, i) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.3, 0.98, 18), i === 0 ? fabricMat : darkMat);
    leg.position.set(x, -0.22, 0);
    leg.rotation.z = i === 0 ? 0.08 : -0.08;
    group.add(leg);

    const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.03, 8, 24), limeMat);
    cuff.rotation.x = Math.PI / 2;
    cuff.position.set(x, -0.7, 0);
    group.add(cuff);
  });

  const front = new THREE.Mesh(new THREE.CapsuleGeometry(0.26, 0.34, 10, 18), darkMat);
  front.rotation.x = Math.PI / 2;
  front.position.set(0, 0.26, 0.36);
  group.add(front);

  const seamGlow = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 1.7, 0.04),
    new THREE.MeshBasicMaterial({ color: LIME, transparent: true, opacity: 0.5 })
  );
  seamGlow.position.set(0, -0.28, 0.82);
  group.add(seamGlow);

  const wire = group.clone();
  wire.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshBasicMaterial({ color: LIME, wireframe: true, transparent: true, opacity: 0.09 });
      child.scale.multiplyScalar(1.012);
    }
  });
  group.add(wire);

  return group;
}

export default function ProductViewer3D({ src, alt, className = "", hotspots = [], activeIndex = -1, onSelect = () => {} }) {
  const { t } = useLanguage();
  const mountRef = useRef(null);
  const hotspotsRef = useRef(hotspots);
  const onSelectRef = useRef(onSelect);
  const activeRef = useRef(activeIndex);
  const disposedRef = useRef(false);
  const [fallback, setFallback] = useState(false);

  hotspotsRef.current = hotspots;
  onSelectRef.current = onSelect;
  activeRef.current = activeIndex;

  useEffect(() => {
    if (typeof document === "undefined" || hotspots.length === 0) return;
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let cleanup = null;

    async function init() {
      try {
        const THREE = await import("three");
        const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
        if (disposed || !mountRef.current) return;
        cleanup = mountScene({ THREE, OrbitControls, mount: mountRef.current });
      } catch (err) {
        if (!disposed) setFallback(true);
      }
    }
    init();

    return () => {
      disposed = true;
      disposedRef.current = true;
      if (cleanup) cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function mountScene({ THREE, OrbitControls, mount }) {
    let frameId = null;
    let observer = null;
    let controls = null;
    let renderer = null;
    const normalTxs = [];
    const activeTxs = [];
    const hotspots = hotspotsRef.current;

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    } catch (err) {
      setFallback(true);
      return () => {};
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(NAVY_DEEP, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 60);
    camera.position.set(0, 0.45, 4.6);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 1.7);
    key.position.set(2.2, 3, 3);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x9db8ff, 0.7);
    rim.position.set(-3, 1, -2.5);
    scene.add(rim);
    const accent = new THREE.PointLight(LIME, 14, 8);
    accent.position.set(0, 1.7, 1.5);
    scene.add(accent);

    const product = buildBoxerGroup(THREE);
    const holder = new THREE.Group();
    holder.scale.setScalar(1.06);
    holder.add(product);
    scene.add(holder);

    (async () => {
      try {
        const head = await fetch("/products/product3d.glb", { method: "HEAD" });
        if (!head.ok) { mount.dataset.model = "no-glb"; return; }
        mount.dataset.model = "loading";
        const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
        const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
        if (disposedRef.current) return;
        const pmrem = new THREE.PMREMGenerator(renderer);
        scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        const gltf = await new GLTFLoader().loadAsync("/products/product3d.glb");
        if (disposedRef.current) return;
        const model = gltf.scene;
        model.traverse((c) => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
        const fit = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        fit.getSize(size);
        const scale = 2.4 / Math.max(size.x, size.z, 0.001);
        model.scale.setScalar(scale);
        const fit2 = new THREE.Box3().setFromObject(model);
        const size2 = new THREE.Vector3();
        fit2.getSize(size2);
        const center = new THREE.Vector3();
        fit2.getCenter(center);
        model.position.set(-center.x, -0.1 - center.y, -center.z);
        holder.remove(product);
        product.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach((m) => m.dispose());
        });
        holder.add(model);
        mount.dataset.model = "user-model";
      } catch (err) {
        mount.dataset.model = "fallback:" + (err && err.message ? err.message : String(err)).slice(0, 80);
      }
    })();

    const grid = new THREE.PolarGridHelper(3.2, 10, 5, 56, LIME, 0xffffff);
    grid.position.y = -1.13;
    grid.material.transparent = true;
    grid.material.opacity = 0.16;
    scene.add(grid);

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(1.35, 48),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.11;
    scene.add(shadow);

    const pickMeshes = [];
    const markers = hotspots.map((point, index) => {
      const m = { index, sprite: null, material: null, connector: null, group: new THREE.Group() };

      const makeTex = (dot) => {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, 256, 256);
        ctx.beginPath();
        ctx.arc(128, 128, 64, 0, Math.PI * 2);
        ctx.fillStyle = dot;
        ctx.fill();
        ctx.lineWidth = 10;
        ctx.strokeStyle = "rgba(255,255,255,0.35)";
        ctx.stroke();
        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
      };

      normalTxs.push(makeTex("rgba(11,42,85,0.95)"));
      activeTxs.push(makeTex("rgba(200,214,0,0.96)"));

      const material = new THREE.SpriteMaterial({
        map: normalTxs[normalTxs.length - 1],
        transparent: true,
        depthWrite: false,
        depthTest: true,
      });
      const sprite = new THREE.Sprite(material);
      sprite.scale.setScalar(0.2);
      sprite.renderOrder = 3;
      m.sprite = sprite;
      m.material = material;
      m.group.add(sprite);

      const pivot = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 8), new THREE.MeshBasicMaterial({ visible: false }));
      pivot.userData.index = index;
      m.group.add(pivot);
      pickMeshes.push(pivot);

      const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)]);
      const connector = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: LIME, transparent: true, opacity: 0.5 }));
      connector.renderOrder = 2;
      connector.frustumCulled = false;
      m.connector = connector;
      m.group.add(connector);

      const x = point.x3 !== undefined ? Number(point.x3) : Math.cos((index / hotspots.length) * Math.PI * 2);
      const y = point.y3 !== undefined ? Number(point.y3) : 0.45 - index * 0.3;
      const z = point.z3 !== undefined ? Number(point.z3) : 1.0;
      m.group.position.set(x, y, z);
      connector.geometry.setFromPoints([new THREE.Vector3(x * 0.6, y * 0.6, z * 0.6), new THREE.Vector3(x, y, z)]);
      return m;
    });

    markers.forEach((m) => holder.add(m.group));

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, -0.05, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 2.6;
    controls.maxDistance = 7;
    controls.minPolarAngle = Math.PI * 0.3;
    controls.maxPolarAngle = Math.PI * 0.72;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    controls.autoRotate = !reduced;
    controls.autoRotateSpeed = 1.3;

    mount.appendChild(renderer.domElement);

    const raycaster = new THREE.Raycaster();
    const g = new THREE.Vector2();
    let hoveredIdx = -1;
    let downPos = { x: 0, y: 0 };

    const toNdc = (clientX, clientY) => {
      const rect = renderer.domElement.getBoundingClientRect();
      g.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    };

    const pickAt = (clientX, clientY) => {
      toNdc(clientX, clientY);
      raycaster.setFromCamera(g, camera);
      const hits = raycaster.intersectObjects(pickMeshes, false);
      if (hits.length > 0) onSelectRef.current(hits[0].object.userData.index);
    };

    const updateVisuals = () => {
      const activeIndex = activeRef.current;
      markers.forEach((m) => {
        const active = m.index === activeIndex;
        const want = active ? activeTxs[m.index] : normalTxs[m.index];
        if (m.material.map !== want) {
          m.material.map = want;
          m.material.needsUpdate = true;
        }
        const pulse = active ? 1 + Math.sin(performance.now() * 0.008) * 0.08 : 1;
        m.connector.material.opacity = active ? 0.9 : 0.5;
        m.sprite.scale.setScalar((active ? 0.24 : hoveredIdx === m.index ? 0.23 : 0.2) * pulse);
      });
    };

    const onPointerDown = (event) => {
      downPos = { x: event.clientX, y: event.clientY };
      if (controls) controls.autoRotate = false;
    };
    const onPointerUp = (event) => {
      const moved = Math.hypot(event.clientX - downPos.x, event.clientY - downPos.y);
      if (moved < 6) pickAt(event.clientX, event.clientY);
      if (controls && !reduced) controls.autoRotate = true;
    };
    const onPointerMove = (event) => {
      toNdc(event.clientX, event.clientY);
      raycaster.setFromCamera(g, camera);
      const hits = raycaster.intersectObjects(pickMeshes, false);
      hoveredIdx = hits.length > 0 ? hits[0].object.userData.index : -1;
      updateVisuals();
      renderer.domElement.style.cursor = hoveredIdx >= 0 ? "pointer" : "grab";
    };
    const onPointerLeave = () => {
      hoveredIdx = -1;
      updateVisuals();
    };
    const onKeyDown = (event) => {
      if (event.key === "ArrowLeft") holder.rotation.y -= 0.25;
      else if (event.key === "ArrowRight") holder.rotation.y += 0.25;
      else if (event.key === "ArrowUp") holder.rotation.x -= 0.2;
      else if (event.key === "ArrowDown") holder.rotation.x += 0.2;
    };

    const el = renderer.domElement;
    el.style.touchAction = "none";
    el.style.cursor = "grab";
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", t("Explorer le produit en 3D"));
    el.tabIndex = 0;
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerleave", onPointerLeave);
    el.addEventListener("keydown", onKeyDown);

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    observer = new ResizeObserver(resize);
    observer.observe(mount);

    const clock = new THREE.Clock();
    const animate = () => {
      if (disposedRef.current) return;
      frameId = requestAnimationFrame(animate);
      const dt = Math.min(0.05, clock.getDelta());
      if (controls) controls.update();
      updateVisuals();
      grid.rotation.y += dt * 0.04;
      renderer.render(scene, camera);
    };
    frameId = requestAnimationFrame(animate);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      if (observer) observer.disconnect();
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
      el.removeEventListener("keydown", onKeyDown);
      if (controls) controls.dispose();
      normalTxs.forEach((tx) => tx.dispose());
      activeTxs.forEach((tx) => tx.dispose());
      renderer.dispose();
      if (el.parentNode === mount) mount.removeChild(el);
    };
  }

  if (fallback) {
    return (
      <div className={`relative ${className}`}>
        <div className="group relative h-full w-full overflow-hidden bg-muted">
          <div className="product-viewer-float h-full w-full">
            <img src={src} alt={alt} draggable={false} className="h-full w-full object-contain" />
            {hotspots.map((point, index) => {
              const active = index === activeIndex;
              return (
                <button
                  key={`${point.x}-${point.y}-${index}`}
                  type="button"
                  aria-label={point.title || `Point ${point.number ?? index + 1}`}
                  aria-pressed={active}
                  onClick={() => onSelect(index)}
                  className={`product-hotspot ${active ? "product-hotspot-active" : ""}`}
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                >
                  <span className="product-hotspot-dot" aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mountRef}
        className="group relative h-full w-full overflow-hidden bg-[radial-gradient(120%_120%_at_50%_0%,#0e2a54_0%,#0a1f3e_70%)]"
      >
        <div className="pointer-events-none absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur">
          <ZoomIn className="h-4 w-4" />
        </div>
        <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded bg-black/35 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/90 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
          <Move3d className="h-3.5 w-3.5" /> {t("Glisser pour explorer")}
        </div>
      </div>
      <style>{`
        @keyframes productViewerFloatFallback {
          0%,100% { transform: rotateY(-8deg) scale(1); }
          50% { transform: rotateY(8deg) scale(1.02); }
        }
        .product-viewer-float { animation: productViewerFloatFallback 8s ease-in-out infinite; }
        .product-hotspot { position: absolute; transform: translate(-50%, -50%); padding: 0; border: none; background: none; cursor: pointer; }
        .product-hotspot-dot {
          display: block;
          width: 14px; height: 14px; border-radius: 9999px;
          background: hsl(var(--primary)); color: #fff;
          border: 1.5px solid rgb(255 255 255 / 0.75);
          box-shadow: 0 2px 6px rgb(0 40 94 / 0.35);
          opacity: 0.9;
          transition: transform 0.25s ease, background 0.25s ease;
        }
        .product-hotspot:hover .product-hotspot-dot { transform: scale(1.15); }
        .product-hotspot-active .product-hotspot-dot {
          background: hsl(64 100% 42%) !important;
          box-shadow: 0 0 0 4px rgb(199 212 0 / 0.3);
          opacity: 1;
        }
      `}</style>
    </div>
  );
}