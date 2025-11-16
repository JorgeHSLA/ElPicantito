// Modelo para las sucursales de El Picantito
export interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  lat: number;
  lng: number;
  telefono: string;
  horario: string;
}

// Lista de sucursales disponibles
export const SUCURSALES: Sucursal[] = [
  {
    id: 1,
    nombre: 'Centro Comercial Cafam Floresta',
    direccion: 'Av. 68 #90-88, Local 67, Bogotá',
    lat: 4.687062983237386,
    lng: -74.07370802922286,
    telefono: '(601) 555-0101',
    horario: 'Lun-Dom: 10:00 AM - 10:00 PM'
  },
  {
    id: 2,
    nombre: 'Centro Comercial MallPlaza NQS',
    direccion: 'Av. Cra 30 #19, Los Mártires, Bogotá',
    lat: 4.609851,
    lng: -74.088947,
    telefono: '(601) 555-0102',
    horario: 'Lun-Dom: 10:00 AM - 10:00 PM'
  }
];

/**
 * Calcula la distancia entre dos puntos geográficos usando la fórmula de Haversine
 * @param lat1 Latitud del punto 1
 * @param lon1 Longitud del punto 1
 * @param lat2 Latitud del punto 2
 * @param lon2 Longitud del punto 2
 * @returns Distancia en kilómetros
 */
export function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Encuentra la sucursal más cercana a una ubicación dada
 * @param lat Latitud de la ubicación del cliente
 * @param lng Longitud de la ubicación del cliente
 * @returns La sucursal más cercana
 */
export function obtenerSucursalMasCercana(lat: number, lng: number): Sucursal {
  let sucursalMasCercana = SUCURSALES[0];
  let distanciaMinima = calcularDistancia(lat, lng, SUCURSALES[0].lat, SUCURSALES[0].lng);

  for (let i = 1; i < SUCURSALES.length; i++) {
    const distancia = calcularDistancia(lat, lng, SUCURSALES[i].lat, SUCURSALES[i].lng);
    if (distancia < distanciaMinima) {
      distanciaMinima = distancia;
      sucursalMasCercana = SUCURSALES[i];
    }
  }

  return sucursalMasCercana;
}
