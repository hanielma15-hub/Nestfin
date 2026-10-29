/**
 * Generates equirectangular 2:1 panoramas using HTML5 Canvas.
 * Creates architectural interior scenes suitable for 360 spherical mapping in Three.js.
 */

type RoomTheme =
  | 'sala_familiar'
  | 'cocina_familiar'
  | 'recamara_principal'
  | 'patio_jardin'
  | 'depto_sala'
  | 'depto_cocina'
  | 'depto_recamara'
  | 'depto_bano'
  | 'habitacion_estudiante'
  | 'cocina_compartida'
  | 'bano_compartido';

const cache = new Map<RoomTheme, string>();

export function generateEquirectangularPanorama(theme: RoomTheme): string {
  if (cache.has(theme)) {
    return cache.get(theme)!;
  }

  // If running in an environment without DOM canvas, return a fallback data SVG
  if (typeof document === 'undefined') {
    return 'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="512"/>';
  }

  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background ceiling and floor gradient (Equirectangular layout: Top = Ceiling, Bottom = Floor)
  const isOutdoor = theme === 'patio_jardin';

  if (isOutdoor) {
    // Outdoor sky and garden floor
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, '#3a7bd5');
    skyGrad.addColorStop(0.48, '#a1c4fd');
    skyGrad.addColorStop(0.5, '#c2e9fb');
    skyGrad.addColorStop(0.52, '#76885b'); // Horizon grass & hills
    skyGrad.addColorStop(0.7, '#5b7042');
    skyGrad.addColorStop(1, '#8b5a2b'); // Terrace tile
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Draw mountains in the distance (Montemorelos Sierra Madre foothills)
    ctx.fillStyle = '#617d69';
    ctx.beginPath();
    ctx.moveTo(0, height * 0.49);
    for (let x = 0; x <= width; x += 40) {
      const y = height * 0.46 + Math.sin(x * 0.02) * 15 + Math.cos(x * 0.05) * 8;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height * 0.52);
    ctx.lineTo(0, height * 0.52);
    ctx.fill();

    // Terrace pergola beams on top
    ctx.fillStyle = 'rgba(78, 52, 46, 0.85)';
    for (let x = 30; x < width; x += 120) {
      ctx.fillRect(x, 0, 24, height * 0.35);
    }
    ctx.fillRect(0, height * 0.1, width, 16);

    // Asador de ladrillo (Barbecue grill on right)
    ctx.fillStyle = '#8d3b24';
    ctx.fillRect(width * 0.65, height * 0.42, 140, 150);
    ctx.fillStyle = '#222';
    ctx.fillRect(width * 0.67, height * 0.45, 100, 60);
    // Chimenea
    ctx.fillStyle = '#6e2b19';
    ctx.fillRect(width * 0.7, height * 0.3, 40, 60);

    // Naranjos / Arboles cítricos de Montemorelos
    ctx.fillStyle = '#2d5a27';
    ctx.beginPath();
    ctx.arc(width * 0.25, height * 0.44, 70, 0, Math.PI * 2);
    ctx.arc(width * 0.4, height * 0.46, 50, 0, Math.PI * 2);
    ctx.fill();
    // Naranjas en los árboles
    ctx.fillStyle = '#f38118';
    for (let i = 0; i < 12; i++) {
      const nx = width * 0.2 + (i % 5) * 22;
      const ny = height * 0.4 + Math.sin(i) * 30;
      ctx.beginPath();
      ctx.arc(nx, ny, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mesa de jardín exterior
    ctx.fillStyle = '#4e342e';
    ctx.fillRect(width * 0.12, height * 0.55, 120, 45);
    ctx.fillRect(width * 0.13, height * 0.59, 14, 70);
    ctx.fillRect(width * 0.21, height * 0.59, 14, 70);
  } else {
    // Indoor rooms
    // Top: Ceiling
    const ceilingGrad = ctx.createLinearGradient(0, 0, 0, height * 0.48);
    ceilingGrad.addColorStop(0, '#d9d2c5');
    ceilingGrad.addColorStop(1, '#f4efe6');
    ctx.fillStyle = ceilingGrad;
    ctx.fillRect(0, 0, width, height * 0.48);

    // Center: Walls with subtle warm texture
    let wallColor = '#ece6dc';
    if (theme.includes('bano')) wallColor = '#dbe5e1';
    if (theme === 'habitacion_estudiante') wallColor = '#e7ede8';
    if (theme === 'depto_sala') wallColor = '#e8e5e0';

    ctx.fillStyle = wallColor;
    ctx.fillRect(0, height * 0.25, width, height * 0.4);

    // Bottom: Floor (Wood or Tile)
    const floorGrad = ctx.createLinearGradient(0, height * 0.52, 0, height);
    if (theme.includes('bano') || theme.includes('cocina')) {
      // Ceramic porcelain tile
      floorGrad.addColorStop(0, '#c9c3b8');
      floorGrad.addColorStop(1, '#a69f93');
    } else {
      // Warm laminate hardwood
      floorGrad.addColorStop(0, '#9c6f44');
      floorGrad.addColorStop(0.5, '#78502d');
      floorGrad.addColorStop(1, '#4e3219');
    }
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, height * 0.52, width, height * 0.48);

    // Draw floor plank lines or tiles
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.lineWidth = 1.5;
    for (let x = 0; x < width; x += 45) {
      ctx.beginPath();
      ctx.moveTo(x, height * 0.52);
      ctx.lineTo(x * 1.3 - width * 0.15, height);
      ctx.stroke();
    }
    for (let y = height * 0.54; y < height; y += 35) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Ceiling fixtures / modern recessed spot lights & pendant
    ctx.fillStyle = 'rgba(255, 252, 230, 0.9)';
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.14, 18, 0, Math.PI * 2);
    ctx.arc(width * 0.2, height * 0.12, 10, 0, Math.PI * 2);
    ctx.arc(width * 0.8, height * 0.12, 10, 0, Math.PI * 2);
    ctx.fill();

    // Large Scenic Window with outdoor Montemorelos view
    ctx.fillStyle = '#89b6dd'; // Sky outside
    ctx.fillRect(width * 0.35, height * 0.26, 180, 110);
    // Sierra / Garden outside
    ctx.fillStyle = '#4a754f';
    ctx.beginPath();
    ctx.arc(width * 0.4, height * 0.38, 50, 0, Math.PI);
    ctx.arc(width * 0.48, height * 0.38, 40, 0, Math.PI);
    ctx.fill();
    // Window frame
    ctx.strokeStyle = '#2b2a27';
    ctx.lineWidth = 4;
    ctx.strokeRect(width * 0.35, height * 0.26, 180, 110);
    ctx.beginPath();
    ctx.moveTo(width * 0.44, height * 0.26);
    ctx.lineTo(width * 0.44, height * 0.37);
    ctx.moveTo(width * 0.35, height * 0.32);
    ctx.lineTo(width * 0.53, height * 0.32);
    ctx.stroke();

    // Room-specific furnishings
    if (theme === 'sala_familiar' || theme === 'depto_sala') {
      // Large sectional sofa in center/foreground
      ctx.fillStyle = '#2c3e35'; // Forest/sage dark sofa
      ctx.beginPath();
      ctx.roundRect(width * 0.42, height * 0.46, 160, 60, [8, 8, 0, 0]);
      ctx.fill();
      // Cushions
      ctx.fillStyle = '#e5d9c5';
      ctx.fillRect(width * 0.44, height * 0.48, 35, 30);
      ctx.fillRect(width * 0.52, height * 0.48, 35, 30);
      // Modern coffee table
      ctx.fillStyle = '#593b22';
      ctx.fillRect(width * 0.46, height * 0.56, 100, 24);
      // TV credenza & large screen on opposite wall (left)
      ctx.fillStyle = '#1c1c1c';
      ctx.fillRect(width * 0.08, height * 0.3, 110, 65);
      ctx.fillStyle = '#4a3728';
      ctx.fillRect(width * 0.06, height * 0.44, 130, 45);
      // Indoor potted plant
      ctx.fillStyle = '#2f5d34';
      ctx.beginPath();
      ctx.arc(width * 0.22, height * 0.42, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#d4c5b9';
      ctx.fillRect(width * 0.2, height * 0.46, 24, 30);
    } else if (theme === 'cocina_familiar' || theme === 'depto_cocina' || theme === 'cocina_compartida') {
      // Modern Kitchen counter & cabinets
      ctx.fillStyle = '#ffffff'; // White quartz counter
      ctx.fillRect(width * 0.58, height * 0.44, 180, 30);
      ctx.fillStyle = '#2d4336'; // Dark sage cabinets below
      ctx.fillRect(width * 0.58, height * 0.48, 180, 70);
      // Upper cabinets
      ctx.fillStyle = '#e8ded2';
      ctx.fillRect(width * 0.6, height * 0.22, 160, 50);
      // Stainless steel refrigerator on left
      ctx.fillStyle = '#d0d4d8';
      ctx.fillRect(width * 0.15, height * 0.25, 75, 140);
      ctx.fillStyle = '#8c9399';
      ctx.fillRect(width * 0.16, height * 0.35, 6, 40);
      // Breakfast island stools
      ctx.fillStyle = '#4a321d';
      ctx.fillRect(width * 0.64, height * 0.53, 20, 40);
      ctx.fillRect(width * 0.72, height * 0.53, 20, 40);
    } else if (theme === 'recamara_principal' || theme === 'depto_recamara' || theme === 'habitacion_estudiante') {
      // King / Queen Bed
      ctx.fillStyle = '#283b32'; // Headboard
      ctx.fillRect(width * 0.42, height * 0.36, 160, 40);
      // White fluffy duvet & pillows
      ctx.fillStyle = '#f8f8f6';
      ctx.fillRect(width * 0.43, height * 0.43, 150, 65);
      ctx.fillStyle = '#dcd8cf';
      ctx.fillRect(width * 0.46, height * 0.39, 45, 20);
      ctx.fillRect(width * 0.52, height * 0.39, 45, 20);
      // Accent throw blanket
      ctx.fillStyle = '#7a9680';
      ctx.fillRect(width * 0.43, height * 0.48, 150, 20);
      // Nightstands with lamps
      ctx.fillStyle = '#5c4033';
      ctx.fillRect(width * 0.36, height * 0.45, 30, 40);
      ctx.fillRect(width * 0.62, height * 0.45, 30, 40);
      // Warm lamps
      ctx.fillStyle = '#fff4cc';
      ctx.beginPath();
      ctx.arc(width * 0.38, height * 0.41, 10, 0, Math.PI * 2);
      ctx.arc(width * 0.64, height * 0.41, 10, 0, Math.PI * 2);
      ctx.fill();

      if (theme === 'habitacion_estudiante') {
        // Study desk with laptop and chair (UMontemorelos student friendly)
        ctx.fillStyle = '#6b4f35';
        ctx.fillRect(width * 0.12, height * 0.46, 80, 25);
        ctx.fillRect(width * 0.13, height * 0.49, 8, 45);
        ctx.fillRect(width * 0.21, height * 0.49, 8, 45);
        // Laptop
        ctx.fillStyle = '#7d868c';
        ctx.fillRect(width * 0.15, height * 0.43, 24, 16);
        // Bookshelf
        ctx.fillStyle = '#5c4033';
        ctx.fillRect(width * 0.8, height * 0.28, 60, 110);
        ctx.fillStyle = '#2f5d34';
        ctx.fillRect(width * 0.82, height * 0.31, 12, 18);
        ctx.fillStyle = '#c0392b';
        ctx.fillRect(width * 0.84, height * 0.31, 12, 18);
      }
    } else if (theme.includes('bano')) {
      // Modern bathroom
      // Glass shower enclosure
      ctx.fillStyle = 'rgba(200, 225, 240, 0.4)';
      ctx.fillRect(width * 0.65, height * 0.25, 120, 140);
      ctx.strokeStyle = '#5a6268';
      ctx.lineWidth = 3;
      ctx.strokeRect(width * 0.65, height * 0.25, 120, 140);
      // Vanity counter with marble top and LED mirror
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(width * 0.2, height * 0.45, 110, 35);
      ctx.fillStyle = '#3a4a40';
      ctx.fillRect(width * 0.2, height * 0.49, 110, 45);
      // Round LED illuminated mirror
      ctx.fillStyle = '#e9f1f5';
      ctx.beginPath();
      ctx.arc(width * 0.27, height * 0.34, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.stroke();
    }
  }

  // Stamp a subtle equirectangular grid / watermark notice for authentic transparency
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('NestFind 360° Panorama Demostrativo • Montemorelos, N.L.', 24, height - 20);

  const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
  cache.set(theme, dataUrl);
  return dataUrl;
}
