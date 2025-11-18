import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { SUCURSALES, Sucursal } from '../../../models/sucursal';

@Component({
  selector: 'app-ubicaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ubicaciones.html',
  styleUrls: ['./ubicaciones.css']
})
export class UbicacionesComponent implements OnInit, AfterViewInit {
  private map!: L.Map;
  
  // Lista de sucursales de El Picantito
  sucursales: Sucursal[] = SUCURSALES;

  ngOnInit(): void {
    // Fix para los iconos de Leaflet
    this.fixLeafletIconPath();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // Calcular centro entre todas las sucursales
    const centerLat = this.sucursales.reduce((sum, s) => sum + s.lat, 0) / this.sucursales.length;
    const centerLng = this.sucursales.reduce((sum, s) => sum + s.lng, 0) / this.sucursales.length;
    
    // Inicializar el mapa
    this.map = L.map('map').setView([centerLat, centerLng], 12);

    // Agregar capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    // Agregar marcador para cada sucursal
    this.sucursales.forEach((sucursal, index) => {
      const marker = L.marker([sucursal.lat, sucursal.lng]).addTo(this.map);
      
      const popupContent = `
        <div style="color: #222; min-width: 200px;">
          <h6 style="margin: 0 0 8px 0; color: #ffc107; font-weight: bold;">🌮 El Picantito</h6>
          <p style="margin: 4px 0; font-weight: 700; color: #c0392b; font-size: 1.1em;">${sucursal.nombre}</p>
          <p style="margin: 4px 0; font-size: 0.98em; color: #333;">${sucursal.direccion}</p>
          <p style="margin: 4px 0; font-size: 0.98em; color: #333;">📞 ${sucursal.telefono}</p>
          <p style="margin: 4px 0; font-size: 0.98em; color: #333;">🕐 ${sucursal.horario}</p>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      
      // Abrir el popup de la primera sucursal
      if (index === 0) {
        marker.openPopup();
      }
    });

    // Ajustar vista para mostrar todas las sucursales
    const bounds = L.latLngBounds(this.sucursales.map(s => [s.lat, s.lng]));
    this.map.fitBounds(bounds, { padding: [50, 50] });
  }

  private fixLeafletIconPath(): void {
    // Fix para los iconos por defecto de Leaflet
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
  }
}
