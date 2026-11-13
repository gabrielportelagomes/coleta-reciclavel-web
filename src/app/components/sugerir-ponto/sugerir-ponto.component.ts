import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import * as L from 'leaflet';
import { ColetaService } from '../../services/coleta.service';
import { Material } from '../../models/coleta.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-sugerir-ponto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './sugerir-ponto.component.html',
  styleUrl: './sugerir-ponto.component.scss'
})
export class SugerirPontoComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  materiaisDisponiveis: Material[] = [];
  selectedMateriais: number[] = [];
  private map!: L.Map;
  private marker!: L.Marker;
  private imagemBase64: string = '';

  constructor(
    private fb: FormBuilder,
    private coletaService: ColetaService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      descricao: [''],
      endereco: ['', Validators.required],
      bairro: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required]
    });

    this.carregarMateriais();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    const teresinaCenter: L.LatLngExpression = [-5.0892, -42.8019];

    this.map = L.map('mini-map', {
      center: teresinaCenter,
      zoom: 13,
      minZoom: 11,
      maxZoom: 18
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      this.form.patchValue({
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6)
      });

      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng).addTo(this.map);
      }
    });
  }

  private carregarMateriais(): void {
    this.coletaService.listarMateriais().subscribe({
      next: (materiais) => this.materiaisDisponiveis = materiais,
      error: (err) => console.error('Erro ao carregar materiais', err)
    });
  }

  onMaterialChange(materialId: number, event: any): void {
    if (event.target.checked) {
      this.selectedMateriais.push(materialId);
    } else {
      this.selectedMateriais = this.selectedMateriais.filter(id => id !== materialId);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagemBase64 = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.form.valid && this.selectedMateriais.length > 0) {
      const request = {
        ...this.form.value,
        latitude: parseFloat(this.form.value.latitude),
        longitude: parseFloat(this.form.value.longitude),
        imagemBase64: this.imagemBase64,
        materiaisIds: this.selectedMateriais
      };

      this.coletaService.sugerirPonto(request).subscribe({
        next: () => {
          this.toastService.show('Ponto de coleta sugerido com sucesso! Aguardando aprovação da administração.', 'success');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Erro ao sugerir ponto', err);
          this.toastService.show('Erro ao enviar sugestão. Verifique os dados.', 'error');
        }
      });
    }
  }
}
