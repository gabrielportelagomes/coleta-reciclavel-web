import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColetaService } from '../../services/coleta.service';
import { PontoColeta, Material } from '../../models/coleta.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  pontosPendentes: PontoColeta[] = [];
  pontosAprovados: PontoColeta[] = [];
  materiais: Material[] = [];
  novoMaterialNome: string = '';

  modalAberto: boolean = false;
  tipoItemParaExcluir: 'material' | 'ponto' | null = null;
  idItemParaExcluir: number | null = null;
  itemNomeParaExcluir: string = '';

  materialEditandoId: number | null = null;
  materialEditandoNome: string = '';

  constructor(private coletaService: ColetaService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.carregarPendentes();
    this.carregarAprovados();
    this.carregarMateriais();
  }

  carregarPendentes(): void {
    this.coletaService.listarPendentes().subscribe({
      next: (pontos) => this.pontosPendentes = pontos,
      error: (err) => console.error('Erro ao carregar pendentes', err)
    });
  }

  carregarAprovados(): void {
    this.coletaService.listarAprovados().subscribe({
      next: (pontos) => this.pontosAprovados = pontos,
      error: (err) => console.error('Erro ao carregar aprovados', err)
    });
  }

  carregarMateriais(): void {
    this.coletaService.listarMateriais().subscribe({
      next: (materiais) => this.materiais = materiais,
      error: (err) => console.error('Erro ao carregar materiais', err)
    });
  }

  aprovar(id: number): void {
    this.coletaService.aprovarPonto(id).subscribe({
      next: () => {
        this.toastService.show('Ponto aprovado com sucesso!', 'success');
        this.carregarDados();
      }
    });
  }

  rejeitar(id: number): void {
    this.coletaService.rejeitarPonto(id).subscribe({
      next: () => {
        this.toastService.show('Ponto rejeitado.', 'info');
        this.carregarDados();
      }
    });
  }

  cadastrarMaterial(): void {
    if (this.novoMaterialNome.trim()) {
      this.coletaService.cadastrarMaterial(this.novoMaterialNome).subscribe({
        next: () => {
          this.toastService.show('Material cadastrado com sucesso!', 'success');
          this.novoMaterialNome = '';
          this.carregarMateriais();
        },
        error: (err) => {
          console.error('Erro ao cadastrar material', err);
          this.toastService.show('Erro ao cadastrar material. Verifique se já existe.', 'error');
        }
      });
    }
  }

  editarMaterial(mat: Material): void {
    const novoNome = prompt('Editar nome do material:', mat.nome);
    if (novoNome && novoNome.trim() !== '' && mat.id) {
      this.coletaService.atualizarMaterial(mat.id, novoNome.trim()).subscribe({
        next: () => {
          this.toastService.show('Material atualizado com sucesso!', 'success');
          this.carregarMateriais();
        },
        error: (err) => {
          console.error('Erro ao atualizar material', err);
          this.toastService.show('Erro ao atualizar material.', 'error');
        }
      });
    }
  }

  confirmarExclusao(): void {
    if (this.idItemParaExcluir === null || !this.tipoItemParaExcluir) return;

    if (this.tipoItemParaExcluir === 'material') {
      this.coletaService.excluirMaterial(this.idItemParaExcluir).subscribe({
        next: () => {
          this.toastService.show('Material excluído com sucesso!', 'success');
          this.carregarMateriais();
          this.fecharModal();
        },
        error: (err) => {
          console.error('Erro ao excluir material', err);
          this.toastService.show('Erro ao excluir material. Pode estar em uso.', 'error');
          this.fecharModal();
        }
      });
    } else if (this.tipoItemParaExcluir === 'ponto') {
      this.coletaService.excluirPonto(this.idItemParaExcluir).subscribe({
        next: () => {
          this.toastService.show('Ponto de coleta excluído com sucesso!', 'success');
          this.carregarAprovados();
          this.fecharModal();
        },
        error: (err) => {
          console.error('Erro ao excluir ponto', err);
          this.toastService.show('Erro ao excluir ponto de coleta.', 'error');
          this.fecharModal();
        }
      });
    }
  }

  abrirModalExclusao(tipo: 'material' | 'ponto', id: number, nome: string): void {
    this.tipoItemParaExcluir = tipo;
    this.idItemParaExcluir = id;
    this.itemNomeParaExcluir = nome;
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.tipoItemParaExcluir = null;
    this.idItemParaExcluir = null;
    this.itemNomeParaExcluir = '';
  }

  iniciarEdicao(mat: Material): void {
    this.materialEditandoId = mat.id!;
    this.materialEditandoNome = mat.nome;
  }

  cancelarEdicao(): void {
    this.materialEditandoId = null;
    this.materialEditandoNome = '';
  }

  salvarEdicao(id: number): void {
    if (!this.materialEditandoNome.trim()) {
      this.toastService.show('O nome do material não pode ser vazio.', 'error');
      return;
    }

    this.coletaService.atualizarMaterial(id, this.materialEditandoNome.trim()).subscribe({
      next: () => {
        this.toastService.show('Material atualizado com sucesso!', 'success');
        this.cancelarEdicao();
        this.carregarMateriais();
      },
      error: (err) => {
        console.error('Erro ao atualizar material', err);
        this.toastService.show('Erro ao atualizar material.', 'error');
      }
    });
  }
}
