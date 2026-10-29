import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  Compass,
  Maximize2,
  Minimize2,
  RotateCcw,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Info,
  ChevronRight,
  Sparkles,
  X,
  Layers,
  Smartphone,
} from 'lucide-react';
import { RoomPanorama, VirtualTourData } from '../types';

interface VirtualTour360ViewerProps {
  tourData: VirtualTourData;
  propertyTitle: string;
  initialRoomId?: string;
  onClose?: () => void;
  isModal?: boolean;
}

export const VirtualTour360Viewer: React.FC<VirtualTour360ViewerProps> = ({
  tourData,
  propertyTitle,
  initialRoomId,
  onClose,
  isModal = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [currentRoom, setCurrentRoom] = useState<RoomPanorama>(() => {
    if (initialRoomId) {
      const found = tourData.rooms.find((r) => r.id === initialRoomId);
      if (found) return found;
    }
    const initial = tourData.rooms.find((r) => r.isInitial);
    return initial || tourData.rooms[0];
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showRoomDrawer, setShowRoomDrawer] = useState(false);
  const [isLoadingTexture, setIsLoadingTexture] = useState(true);
  const [gyroActive, setGyroActive] = useState(false);
  const [hotspotScreenPositions, setHotspotScreenPositions] = useState<
    Array<{ id: string; targetRoomId: string; label: string; x: number; y: number; visible: boolean }>
  >([]);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const textureLoaderRef = useRef<THREE.TextureLoader | null>(null);
  const reqAnimRef = useRef<number | null>(null);

  // Interaction angles & state
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const touchStartDistRef = useRef<number | null>(null);
  const targetYawRef = useRef(0);
  const targetPitchRef = useRef(0);
  const currentYawRef = useRef(0);
  const currentPitchRef = useRef(0);
  const targetFovRef = useRef(75);
  const currentFovRef = useRef(75);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer with antialias and software-gl friendliness
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      rendererRef.current = renderer;
    } catch (e) {
      console.error('WebGL not available or error initializing renderer', e);
      return;
    }

    // 4. Inverted Sphere geometry for 360 panorama
    // Sphere radius 500, scale -1 on x to view from inside
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.FrontSide,
    });
    materialRef.current = material;

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    sphereRef.current = sphere;

    const textureLoader = new THREE.TextureLoader();
    textureLoaderRef.current = textureLoader;

    // 5. Render Loop with smooth damping
    let lastTime = performance.now();

    const animate = () => {
      reqAnimRef.current = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (isAutoRotating) {
        targetYawRef.current += 6 * delta;
      }

      // Smooth interpolation (damping)
      const lerpFactor = 0.12;
      currentYawRef.current += (targetYawRef.current - currentYawRef.current) * lerpFactor;
      currentPitchRef.current += (targetPitchRef.current - currentPitchRef.current) * lerpFactor;
      currentFovRef.current += (targetFovRef.current - currentFovRef.current) * lerpFactor;

      // Clamp pitch to prevent pole flips
      currentPitchRef.current = Math.max(-85, Math.min(85, currentPitchRef.current));
      targetPitchRef.current = Math.max(-85, Math.min(85, targetPitchRef.current));

      // Update camera FOV
      if (cameraRef.current) {
        cameraRef.current.fov = currentFovRef.current;
        cameraRef.current.updateProjectionMatrix();

        // Convert Yaw and Pitch (degrees) to Spherical coordinates
        const phi = THREE.MathUtils.degToRad(90 - currentPitchRef.current);
        const theta = THREE.MathUtils.degToRad(currentYawRef.current);

        const targetX = 500 * Math.sin(phi) * Math.cos(theta);
        const targetY = 500 * Math.cos(phi);
        const targetZ = 500 * Math.sin(phi) * Math.sin(theta);

        cameraRef.current.lookAt(targetX, targetY, targetZ);

        // Project Hotspots to 2D screen coordinates
        if (currentRoom.hotspots && currentRoom.hotspots.length > 0 && containerRef.current) {
          const containerW = containerRef.current.clientWidth;
          const containerH = containerRef.current.clientHeight;

          const updated = currentRoom.hotspots.map((hs) => {
            const hPhi = THREE.MathUtils.degToRad(90 - hs.pitch);
            const hTheta = THREE.MathUtils.degToRad(hs.yaw);
            const pos = new THREE.Vector3(
              500 * Math.sin(hPhi) * Math.cos(hTheta),
              500 * Math.cos(hPhi),
              500 * Math.sin(hPhi) * Math.sin(hTheta)
            );

            // Check if point is in front of camera
            const cameraDirection = new THREE.Vector3();
            cameraRef.current!.getWorldDirection(cameraDirection);
            const toPos = pos.clone().normalize();
            const dot = cameraDirection.dot(toPos);

            pos.project(cameraRef.current!);

            const x = (pos.x * 0.5 + 0.5) * containerW;
            const y = (-(pos.y * 0.5) + 0.5) * containerH;

            return {
              id: hs.id,
              targetRoomId: hs.targetRoomId,
              label: hs.label,
              x,
              y,
              visible: dot > 0.3 && x > 20 && x < containerW - 20 && y > 20 && y < containerH - 20,
            };
          });

          setHotspotScreenPositions(updated);
        } else {
          setHotspotScreenPositions([]);
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Resize Observer
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (reqAnimRef.current) cancelAnimationFrame(reqAnimRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (materialRef.current) {
        materialRef.current.dispose();
      }
      if (sphereRef.current) {
        sphereRef.current.geometry.dispose();
      }
    };
  }, []);

  // Load Room Panorama Texture whenever currentRoom changes
  useEffect(() => {
    if (!materialRef.current || !textureLoaderRef.current || !currentRoom) return;

    setIsLoadingTexture(true);

    textureLoaderRef.current.load(
      currentRoom.panoramaUrl,
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;

        if (materialRef.current) {
          if (materialRef.current.map) {
            materialRef.current.map.dispose();
          }
          materialRef.current.map = texture;
          materialRef.current.needsUpdate = true;
        }
        setIsLoadingTexture(false);
      },
      undefined,
      (err) => {
        console.error('Error loading 360 texture', err);
        setIsLoadingTexture(false);
      }
    );
  }, [currentRoom]);

  // Touch and Mouse Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-control')) return;
    isDraggingRef.current = true;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };
    if (showInstructions) setShowInstructions(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevMouseRef.current.x;
    const deltaY = e.clientY - prevMouseRef.current.y;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };

    const sensitivity = 0.25;
    targetYawRef.current -= deltaX * sensitivity;
    targetPitchRef.current += deltaY * sensitivity;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * 0.05;
    targetFovRef.current = Math.max(35, Math.min(95, targetFovRef.current + zoomDelta));
  };

  // Touch support (1 finger drag, 2 fingers pinch zoom)
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-control')) return;
    if (showInstructions) setShowInstructions(false);

    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      touchStartDistRef.current = null;
    } else if (e.touches.length === 2) {
      isDraggingRef.current = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartDistRef.current = Math.hypot(dx, dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDraggingRef.current) {
      const deltaX = e.touches[0].clientX - prevMouseRef.current.x;
      const deltaY = e.touches[0].clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      const sensitivity = 0.3;
      targetYawRef.current -= deltaX * sensitivity;
      targetPitchRef.current += deltaY * sensitivity;
    } else if (e.touches.length === 2 && touchStartDistRef.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const diff = touchStartDistRef.current - dist;
      touchStartDistRef.current = dist;

      targetFovRef.current = Math.max(35, Math.min(95, targetFovRef.current + diff * 0.2));
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    touchStartDistRef.current = null;
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Reset view
  const handleResetView = () => {
    targetYawRef.current = 0;
    targetPitchRef.current = 0;
    targetFovRef.current = 75;
  };

  // Switch Room
  const switchRoom = useCallback(
    (roomId: string) => {
      const target = tourData.rooms.find((r) => r.id === roomId);
      if (target && target.id !== currentRoom.id) {
        setCurrentRoom(target);
        // Slightly re-center view for smooth orientation
        targetPitchRef.current = 0;
      }
    },
    [tourData.rooms, currentRoom.id]
  );

  // Device orientation / Gyroscope toggle (for mobile phones)
  const toggleGyroscope = () => {
    if (!gyroActive) {
      if (typeof DeviceOrientationEvent !== 'undefined' && 'requestPermission' in DeviceOrientationEvent) {
        (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> })
          .requestPermission()
          .then((resp: string) => {
            if (resp === 'granted') {
              setGyroActive(true);
            }
          })
          .catch(() => {});
      } else {
        setGyroActive(true);
      }
    } else {
      setGyroActive(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none bg-stone-950 font-sans ${
        isModal ? 'h-[75vh] min-h-[480px] max-h-[820px] rounded-2xl' : 'h-[600px] rounded-2xl shadow-xl'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 360 Canvas */}
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing block" />

      {/* Loading Overlay */}
      {isLoadingTexture && (
        <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-sm flex flex-col items-center justify-center text-white z-30 pointer-events-none transition-opacity duration-300">
          <div className="w-12 h-12 border-3 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mb-3"></div>
          <p className="text-sm font-medium tracking-wide text-stone-200">Cargando panorama 360°...</p>
          <span className="text-xs text-stone-400 mt-1">{currentRoom.name}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-stone-950/80 via-stone-950/40 to-transparent flex items-center justify-between z-20 pointer-events-none">
        <div className="flex flex-col gap-1 pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-600/90 text-white shadow-sm border border-emerald-400/30">
              <Sparkles className="w-3 h-3 text-emerald-200" />
              Recorrido Virtual 360°
            </span>
            {tourData.isDemoTour && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/90 text-stone-950 border border-amber-300/40 font-mono">
                Demostración
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-stone-200 text-sm">
            <span className="font-medium text-white truncate max-w-xs md:max-w-md">{propertyTitle}</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-emerald-300 font-semibold">{currentRoom.name}</span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto interactive-control">
          <button
            onClick={() => setShowRoomDrawer(!showRoomDrawer)}
            aria-label="Selector de habitaciones"
            title="Ver habitaciones de la propiedad"
            className="md:hidden p-2 rounded-xl bg-stone-900/80 backdrop-blur text-stone-200 hover:text-white hover:bg-stone-800 transition border border-stone-700/60"
          >
            <Layers className="w-5 h-5" />
          </button>
          <button
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            title="Pantalla completa"
            className="p-2 rounded-xl bg-stone-900/80 backdrop-blur text-stone-200 hover:text-white hover:bg-stone-800 transition border border-stone-700/60"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Cerrar visor 360"
              title="Cerrar recorrido 360°"
              className="p-2 rounded-xl bg-stone-900/80 backdrop-blur text-stone-200 hover:text-white hover:bg-red-950/80 hover:border-red-500/60 transition border border-stone-700/60"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive 3D Projected Hotspots (Navigation points between rooms) */}
      {hotspotScreenPositions.map((hs) => {
        if (!hs.visible) return null;
        return (
          <button
            key={hs.id}
            onClick={() => switchRoom(hs.targetRoomId)}
            aria-label={`Ir a ${hs.label}`}
            style={{
              transform: `translate(${hs.x}px, ${hs.y}px) translate(-50%, -50%)`,
            }}
            className="interactive-control absolute z-20 group flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-900/90 hover:bg-emerald-700 text-white shadow-lg border border-emerald-400/50 backdrop-blur transition-all duration-200 hover:scale-110 cursor-pointer"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-300"></span>
            </span>
            <span className="text-xs font-semibold tracking-wide whitespace-nowrap drop-shadow">
              {hs.label}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-200 group-hover:translate-x-0.5 transition-transform" />
          </button>
        );
      })}

      {/* Onscreen Navigation Overlay Controls (Zoom, Reset, Auto-rotate) */}
      <div className="absolute right-4 bottom-24 flex flex-col gap-2 z-20 interactive-control">
        <button
          onClick={() => (targetFovRef.current = Math.max(35, targetFovRef.current - 10))}
          aria-label="Acercar vista"
          title="Acercar (Zoom in)"
          className="p-2.5 rounded-xl bg-stone-900/85 hover:bg-stone-800 text-stone-200 hover:text-white shadow-md backdrop-blur border border-stone-700/60 transition"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => (targetFovRef.current = Math.min(95, targetFovRef.current + 10))}
          aria-label="Alejar vista"
          title="Alejar (Zoom out)"
          className="p-2.5 rounded-xl bg-stone-900/85 hover:bg-stone-800 text-stone-200 hover:text-white shadow-md backdrop-blur border border-stone-700/60 transition"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetView}
          aria-label="Centrar vista"
          title="Centrar orientación"
          className="p-2.5 rounded-xl bg-stone-900/85 hover:bg-stone-800 text-stone-200 hover:text-white shadow-md backdrop-blur border border-stone-700/60 transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          aria-label={isAutoRotating ? 'Pausar giro automático' : 'Activar giro automático'}
          title={isAutoRotating ? 'Pausar giro automático' : 'Giro automático'}
          className={`p-2.5 rounded-xl backdrop-blur border shadow-md transition ${
            isAutoRotating
              ? 'bg-emerald-600/90 text-white border-emerald-400'
              : 'bg-stone-900/85 text-stone-200 hover:text-white border-stone-700/60'
          }`}
        >
          {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={toggleGyroscope}
          aria-label="Modo giroscopio para celular"
          title="Giroscopio móvil"
          className={`p-2.5 rounded-xl backdrop-blur border shadow-md transition md:hidden ${
            gyroActive
              ? 'bg-emerald-600/90 text-white border-emerald-400'
              : 'bg-stone-900/85 text-stone-200 hover:text-white border-stone-700/60'
          }`}
        >
          <Smartphone className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Compass Badge */}
      <div className="absolute left-4 bottom-24 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900/80 backdrop-blur text-stone-300 text-xs border border-stone-700/60 pointer-events-none z-20">
        <Compass className="w-4 h-4 text-emerald-400 animate-pulse" />
        <span>Vista esférica 360°</span>
      </div>

      {/* Brief Navigation Instructions banner (can be closed) */}
      {showInstructions && (
        <div className="absolute top-18 inset-x-4 md:inset-x-auto md:left-4 max-w-md bg-stone-900/90 backdrop-blur-md p-3 rounded-xl border border-stone-700/80 text-white shadow-xl z-20 flex items-start justify-between gap-3 animate-fade-in pointer-events-auto interactive-control">
          <div className="flex items-start gap-2.5">
            <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5 text-stone-200">
              <p className="font-semibold text-white">¿Cómo recorrer este espacio?</p>
              <p>• <strong>Arrastra</strong> con el mouse o dedo en cualquier dirección.</p>
              <p>• <strong>Usa la rueda o pellizca</strong> para acercar o alejar el zoom.</p>
              <p>• <strong>Toca los puntos flotantes</strong> o el menú inferior para cambiar de habitación.</p>
            </div>
          </div>
          <button
            onClick={() => setShowInstructions(false)}
            aria-label="Ocultar instrucciones de recorrido"
            className="text-stone-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom Room Selector Bar */}
      <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent z-20 flex flex-col items-center pointer-events-none">
        <div className="w-full max-w-4xl flex items-center justify-between md:justify-center gap-2 pointer-events-auto interactive-control overflow-x-auto pb-1 px-1">
          {tourData.rooms.map((room) => {
            const isActive = room.id === currentRoom.id;
            return (
              <button
                key={room.id}
                onClick={() => switchRoom(room.id)}
                aria-label={`Cambiar a ${room.name}`}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-md cursor-pointer border ${
                  isActive
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-950/50 scale-105 ring-2 ring-emerald-400/30'
                    : 'bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border-stone-700/70 hover:border-stone-500'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isActive ? 'bg-white' : 'bg-emerald-400/80'
                  }`}
                />
                <span>{room.name}</span>
              </button>
            );
          })}
        </div>

        {/* Room Description preview */}
        {currentRoom.description && (
          <p className="text-[11px] text-stone-400 text-center max-w-xl truncate mt-1 pointer-events-none">
            {currentRoom.description}
          </p>
        )}
      </div>

      {/* Mobile Room Drawer (Collapsible) */}
      {showRoomDrawer && (
        <div className="md:hidden absolute inset-0 bg-stone-950/90 backdrop-blur-md p-6 z-30 flex flex-col justify-between animate-fade-in interactive-control">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-white text-base">Espacios de la propiedad</h3>
              </div>
              <button
                onClick={() => setShowRoomDrawer(false)}
                className="p-1.5 rounded-lg bg-stone-800 text-stone-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-2">
              {tourData.rooms.map((room) => {
                const isActive = room.id === currentRoom.id;
                return (
                  <button
                    key={room.id}
                    onClick={() => {
                      switchRoom(room.id);
                      setShowRoomDrawer(false);
                    }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl text-sm font-medium text-left transition border ${
                      isActive
                        ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200'
                        : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-white">{room.name}</div>
                      {room.description && (
                        <div className="text-xs text-stone-400 mt-0.5">{room.description}</div>
                      )}
                    </div>
                    {isActive && (
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500 text-stone-950 font-bold">
                        Viendo
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <p className="text-xs text-stone-400 text-center">
            Gira y recorre cada habitación para explorar la propiedad en 360°.
          </p>
        </div>
      )}
    </div>
  );
};
