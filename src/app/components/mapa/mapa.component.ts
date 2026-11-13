import { LoadingService } from './../../services/loading.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { ColetaService } from '../../services/coleta.service';
import { PontoColeta } from '../../models/coleta.model';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.scss'
})
export class MapaComponent implements OnInit, AfterViewInit {
  private map!: L.Map;

  private teresinaBounds: L.LatLngBoundsExpression = [
    [-5.3500, -43.0500],
    [-4.9000, -42.6000]
  ];

  constructor(private coletaService: ColetaService, public loadingService: LoadingService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
    this.carregarPontosAprovados();
  }

  private initMap(): void {
    const teresinaCenter: L.LatLngExpression = [-5.0892, -42.8019];

    this.map = L.map('map', {
      center: teresinaCenter,
      zoom: 13,
      minZoom: 11,
      maxZoom: 18,
      maxBounds: this.teresinaBounds,
      maxBoundsViscosity: 1.0
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
    const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
    const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

    L.Marker.prototype.options.icon = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  }

  private carregarPontosAprovados(): void {
  this.loadingService.setMapLoading(true);

  this.coletaService.listarAprovados().subscribe({
    next: (pontos: PontoColeta[]) => {
      pontos.forEach((ponto: PontoColeta) => {
        const marker = L.marker([Number(ponto.latitude), Number(ponto.longitude)]).addTo(this.map);

        const materiaisNomes = ponto.materiais.map(m => m.nome).join(', ');

        let imagemHtml = '';
        if (ponto.imagemBase64) {
          imagemHtml = `<img src="${ponto.imagemBase64}" style="width:100%; max-height:120px; object-fit:cover; border-radius:4px; margin-top:6px;" />`;
        }

        marker.bindPopup(`
          <div style="min-width: 200px;">
            <b style="font-size: 1.1rem; color: #0f172a;">${ponto.nome}</b><br>
            <p style="margin: 4px 0; color: #475569; font-size: 0.9rem;">${ponto.descricao || ''}</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 6px 0;">
            <b>Endereço:</b> ${ponto.endereco}, ${ponto.bairro}<br>
            <b>Materiais:</b> <span style="color: #16a34a; font-weight: 500;">${materiaisNomes}</span>
            ${imagemHtml}
          </div>
        `);
      });
      this.loadingService.setMapLoading(false);
    },
    error: (err) => {
      this.loadingService.setMapLoading(false);
      console.error('Erro ao carregar pontos aprovados', err);
    }
  });
}
}
