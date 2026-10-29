import { Property } from '../types';
import { generateEquirectangularPanorama } from './panoramaGenerator';

export function getInitialDemoProperties(): Property[] {
  return [
    {
      id: 'demo-prop-1-casa-huertas',
      regionId: 'montemorelos-nl',
      title: 'Casa familiar con jardín y asador',
      type: 'casa',
      price: 12000,
      currency: 'MXN',
      period: 'mensual',
      isDemo: true,
      status: 'publicado',
      colonia: 'Fraccionamiento Las Huertas',
      postalCode: '67510',
      city: 'Montemorelos',
      state: 'Nuevo León',
      referenceLocation: 'Cerca del Libramiento y acceso a Carretera Nacional',
      bedrooms: 3,
      bathrooms: 2,
      surfaceM2: 175,
      furnished: false,
      petsAllowed: true,
      parkingSpots: 2,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
      ],
      virtualTour: {
        enabled: true,
        isDemoTour: true,
        rooms: [
          {
            id: 'sala-1',
            name: 'Sala Familiar',
            type: 'sala',
            panoramaUrl: generateEquirectangularPanorama('sala_familiar'),
            description: 'Espacio social amplio con vista al jardín y ventanales.',
            isInitial: true,
            hotspots: [
              { id: 'h1', targetRoomId: 'cocina-1', label: 'Ir a Cocina Integral', yaw: 45, pitch: -5 },
              { id: 'h2', targetRoomId: 'patio-1', label: 'Salir al Patio y Jardín', yaw: 135, pitch: -8 },
              { id: 'h3', targetRoomId: 'recamara-1', label: 'Recámara Principal', yaw: -60, pitch: 0 },
            ],
          },
          {
            id: 'cocina-1',
            name: 'Cocina Integral',
            type: 'cocina',
            panoramaUrl: generateEquirectangularPanorama('cocina_familiar'),
            description: 'Cocina con barra de cuarzo y gabinetes modernos.',
            hotspots: [
              { id: 'h4', targetRoomId: 'sala-1', label: 'Regresar a Sala', yaw: -130, pitch: -5 },
              { id: 'h5', targetRoomId: 'patio-1', label: 'Puerta hacia el Asador', yaw: 80, pitch: -6 },
            ],
          },
          {
            id: 'recamara-1',
            name: 'Recámara Principal',
            type: 'recamara',
            panoramaUrl: generateEquirectangularPanorama('recamara_principal'),
            description: 'Habitación principal con espacio para cama King, clóset y baño privado.',
            hotspots: [
              { id: 'h6', targetRoomId: 'sala-1', label: 'Volver a Sala', yaw: 170, pitch: -5 },
            ],
          },
          {
            id: 'patio-1',
            name: 'Patio y Jardín',
            type: 'patio',
            panoramaUrl: generateEquirectangularPanorama('patio_jardin'),
            description: 'Terraza exterior con asador de ladrillo y naranjos típicos de Montemorelos.',
            hotspots: [
              { id: 'h7', targetRoomId: 'sala-1', label: 'Entrar a la Casa', yaw: 180, pitch: 0 },
              { id: 'h8', targetRoomId: 'cocina-1', label: 'Acceso a Cocina', yaw: -80, pitch: 0 },
            ],
          },
        ],
      },
      amenities: [
        'Cochera techada (2 autos)',
        'Patio privado con asador',
        'Clima minisplit inverter',
        'Cocina integral equipada',
        'Área de lavandería techada',
        'Protecciones y reja perimetral',
        'Tinaco con bomba hidroneumática',
      ],
      description:
        'Residencia en zona tranquila de Montemorelos. Cuenta con 3 habitaciones, 2 baños completos, sala con techos altos, cocina integral y un amplio patio posterior con asador ideal para reuniones familiares. Ubicada en Fraccionamiento Las Huertas con rápido acceso a avenidas principales.',
      coexistenceRules: [
        'Mascotas bienvenidas en patio exterior.',
        'Horario moderado de ruido vecinal después de las 11:00 PM.',
        'No se permite subarrendar sin autorización previa.',
      ],
      rentalRequirements: [
        '1 mes de depósito en garantía.',
        'Identificación oficial vigente (INE o Pasaporte).',
        'Comprobante de ingresos o aval con propiedad en N.L.',
        'Firma de contrato de arrendamiento mínimo de 12 meses.',
      ],
      availableDate: 'Disponibilidad inmediata',
      host: {
        name: 'Ing. Carlos Garza Silva',
        role: 'Propietario particular',
        phone: '826 123 4567',
        email: 'propietario.demo@nestfind.mx',
        verifiedIdentity: true,
        responseRate: '98%',
        responseTime: 'En menos de 1 hora',
      },
    },

    {
      id: 'demo-prop-2-departamento-centro',
      regionId: 'montemorelos-nl',
      title: 'Departamento moderno en Zona Centro',
      type: 'departamento',
      price: 7500,
      currency: 'MXN',
      period: 'mensual',
      isDemo: true,
      status: 'publicado',
      colonia: 'Centro',
      postalCode: '67500',
      city: 'Montemorelos',
      state: 'Nuevo León',
      referenceLocation: 'A 3 cuadras de la Plaza Principal y bancos',
      bedrooms: 2,
      bathrooms: 1,
      surfaceM2: 78,
      furnished: true,
      petsAllowed: false,
      parkingSpots: 1,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
      ],
      virtualTour: {
        enabled: true,
        isDemoTour: true,
        rooms: [
          {
            id: 'depto-sala',
            name: 'Sala - Comedor',
            type: 'sala',
            panoramaUrl: generateEquirectangularPanorama('depto_sala'),
            description: 'Concepto abierto contemporáneo con luz natural.',
            isInitial: true,
            hotspots: [
              { id: 'dh1', targetRoomId: 'depto-cocina', label: 'Ver Cocina', yaw: 50, pitch: -4 },
              { id: 'dh2', targetRoomId: 'depto-recamara', label: 'Entrar a Recámara', yaw: -70, pitch: 0 },
            ],
          },
          {
            id: 'depto-cocina',
            name: 'Cocina Equipada',
            type: 'cocina',
            panoramaUrl: generateEquirectangularPanorama('depto_cocina'),
            description: 'Cocina integral con parrilla eléctrica y refrigerador.',
            hotspots: [
              { id: 'dh3', targetRoomId: 'depto-sala', label: 'Volver a Estancia', yaw: 170, pitch: -6 },
              { id: 'dh4', targetRoomId: 'depto-bano', label: 'Ir al Baño', yaw: 85, pitch: -4 },
            ],
          },
          {
            id: 'depto-recamara',
            name: 'Recámara',
            type: 'recamara',
            panoramaUrl: generateEquirectangularPanorama('depto_recamara'),
            description: 'Recámara con cama Queen, clóset de pared y escritorio.',
            hotspots: [
              { id: 'dh5', targetRoomId: 'depto-sala', label: 'Ir a Sala', yaw: 160, pitch: 0 },
              { id: 'dh6', targetRoomId: 'depto-bano', label: 'Baño Completo', yaw: 65, pitch: 0 },
            ],
          },
          {
            id: 'depto-bano',
            name: 'Baño Completo',
            type: 'bano',
            panoramaUrl: generateEquirectangularPanorama('depto_bano'),
            description: 'Acabados en porcelanato, cancel de vidrio templado y espejo LED.',
            hotspots: [
              { id: 'dh7', targetRoomId: 'depto-recamara', label: 'Regresar a Recámara', yaw: 180, pitch: 0 },
            ],
          },
        ],
      },
      amenities: [
        'Completamente amueblado',
        'Cocina con parrilla y refrigerador',
        'Internet de alta velocidad incluido',
        'Clima minisplit frío/calor',
        'Lavandería dentro del edificio',
        'Estacionamiento cerrado (sujeto a disponibilidad)',
        'Cámaras de circuito cerrado 24/7',
      ],
      description:
        'Departamento moderno y completamente equipado en el corazón de Montemorelos. Ideal para profesionistas o parejas. Con acabados de primera calidad, excelente iluminación, internet de fibra óptica y cercanía a comercios, restaurantes y transporte.',
      coexistenceRules: [
        'Ambiente tranquilo y respetuoso para profesionistas.',
        'No se admiten fiestas ruidosas.',
        'Inmueble 100% libre de humo de tabaco.',
      ],
      rentalRequirements: [
        'Depósito equivalente a 1 mes de renta.',
        'Identificación oficial y carta laboral vigente.',
        'Contrato semestral o anual.',
      ],
      availableDate: '1 de Noviembre de 2026',
      host: {
        name: 'Lic. Mariana Treviño',
        role: 'Administradora de Inmuebles',
        phone: '826 987 6543',
        email: 'contacto.depto@nestfind.mx',
        verifiedIdentity: true,
        responseRate: '100%',
        responseTime: 'En 15 minutos',
      },
    },

    {
      id: 'demo-prop-3-habitacion-estudiante',
      regionId: 'montemorelos-nl',
      title: 'Habitación amueblada cerca de UMontemorelos',
      type: 'habitacion',
      price: 3000,
      currency: 'MXN',
      period: 'quincenal',
      isDemo: true,
      status: 'publicado',
      colonia: 'Colonia Matamoros',
      postalCode: '67520',
      city: 'Montemorelos',
      state: 'Nuevo León',
      referenceLocation: 'A 5 minutos a pie de la Universidad y Hospital La Carlota',
      bedrooms: 1,
      bathrooms: 1,
      surfaceM2: 24,
      furnished: true,
      petsAllowed: false,
      parkingSpots: 0,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80',
      ],
      virtualTour: {
        enabled: true,
        isDemoTour: true,
        rooms: [
          {
            id: 'hab-privada',
            name: 'Habitación Privada',
            type: 'recamara',
            panoramaUrl: generateEquirectangularPanorama('habitacion_estudiante'),
            description: 'Recámara privada con escritorio ergonómico, cama y clóset.',
            isInitial: true,
            hotspots: [
              { id: 'hh1', targetRoomId: 'cocina-comun', label: 'Cocina Compartida', yaw: 40, pitch: -6 },
              { id: 'hh2', targetRoomId: 'bano-comun', label: 'Baño', yaw: -85, pitch: -4 },
            ],
          },
          {
            id: 'cocina-comun',
            name: 'Cocina Común',
            type: 'cocina',
            panoramaUrl: generateEquirectangularPanorama('cocina_compartida'),
            description: 'Área común de cocina con refrigerador, estufa y alacena individual.',
            hotspots: [
              { id: 'hh3', targetRoomId: 'hab-privada', label: 'Regresar a Habitación', yaw: 180, pitch: 0 },
            ],
          },
          {
            id: 'bano-comun',
            name: 'Baño',
            type: 'bano',
            panoramaUrl: generateEquirectangularPanorama('bano_compartido'),
            description: 'Baño completo con agua caliente las 24 horas.',
            hotspots: [
              { id: 'hh4', targetRoomId: 'hab-privada', label: 'Volver al Cuarto', yaw: 170, pitch: 0 },
            ],
          },
        ],
      },
      amenities: [
        'Cama individual con colchón ortopédico',
        'Escritorio de estudio y silla ergonómica',
        'Clima minisplit independiente',
        'Agua, luz e internet Wi-Fi de alta velocidad incluidos',
        'Acceso a cocina compartida y lavadora',
        'Chapa de seguridad con llave propia',
      ],
      description:
        'Cuarto amueblado especialmente acondicionado para estudiantes de la Universidad de Montemorelos, residentes médicos o practicantes. En zona muy segura y tranquila, a unos pasos de la avenida principal y centros médicos. Renta flexible por quincena con todos los servicios básicos incluidos.',
      coexistenceRules: [
        'Ambiente de estudio y descanso.',
        'Limpieza obligatoria en áreas comunes después de su uso.',
        'No se permiten fiestas ni consumo de alcohol en el inmueble.',
      ],
      rentalRequirements: [
        'Depósito equivalente a 1 quincena ($3,000 MXN).',
        'Comprobante de inscripción universitaria o credencial de trabajo.',
        'Identificación oficial vigente.',
      ],
      availableDate: 'Disponible para el próximo ciclo o inmediata',
      host: {
        name: 'Sra. Rosa Elia Morales',
        role: 'Anfitriona de alojamiento',
        phone: '826 345 6789',
        email: 'rosa.alojamiento@nestfind.mx',
        verifiedIdentity: true,
        responseRate: '95%',
        responseTime: 'En 30 minutos',
      },
    },
  ];
}

const LOCAL_STORAGE_PROPERTIES_KEY = 'nestfind_properties_data_v1';

export function getStoredProperties(): Property[] {
  if (typeof window === 'undefined') return getInitialDemoProperties();
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROPERTIES_KEY);
    if (!raw) {
      const initial = getInitialDemoProperties();
      localStorage.setItem(LOCAL_STORAGE_PROPERTIES_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((p: any) => {
        if (!p.postalCode) {
          if (p.colonia?.includes('Huertas') || p.colonia?.includes('Bugambilias')) {
            p.postalCode = '67510';
          } else if (p.colonia?.includes('Matamoros') || p.colonia?.includes('Leyva') || p.colonia?.includes('Maestro')) {
            p.postalCode = '67520';
          } else {
            p.postalCode = '67500';
          }
        }
        return p;
      });
    }
    return getInitialDemoProperties();
  } catch {
    return getInitialDemoProperties();
  }
}

export function saveStoredProperties(properties: Property[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_PROPERTIES_KEY, JSON.stringify(properties));
  } catch (err) {
    console.error('Error saving properties to localStorage', err);
  }
}
