import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-ubicaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ubicaciones.html',
  styleUrls: ['./ubicaciones.css']
})
export class UbicacionesComponent implements OnInit, AfterViewInit {
  private map!: L.Map;
  
  // Coordenadas de Bogotá (puedes modificar estas coordenadas)
  private bogotaCoords = { lat: 4.7110, lng: -74.0721 };

  ngOnInit(): void {
    // Fix para los iconos de Leaflet
    this.fixLeafletIconPath();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // Inicializar el mapa centrado en Bogotá
    this.map = L.map('map').setView([this.bogotaCoords.lat, this.bogotaCoords.lng], 13);

    // Agregar capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    // Agregar marcador en las coordenadas de Bogotá
    const marker = L.marker([this.bogotaCoords.lat, this.bogotaCoords.lng]).addTo(this.map);
    
    // Puedes agregar un popup al marcador
    marker.bindPopup('<b>El Picantito</b><br>Sucursal Principal').openPopup();

    // Aquí puedes agregar más marcadores para otras sucursales
    // Ejemplo:
    // const sucursal2 = L.marker([4.6097, -74.0817]).addTo(this.map);
    // sucursal2.bindPopup('<b>El Picantito</b><br>Sucursal 2');
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
