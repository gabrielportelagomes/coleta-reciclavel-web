export interface Material {
  id: number;
  nome: string;
}

export interface PontoColeta {
  id?: number;
  nome: string;
  descricao?: string;
  endereco: string;
  bairro: string;
  latitude: number;
  longitude: number;
  imagemBase64?: string;
  status?: string;
  criadoEm?: string;
  materiais: Material[];
}

export interface PontoColetaRequest {
  nome: string;
  descricao?: string;
  endereco: string;
  bairro: string;
  latitude: number;
  longitude: number;
  imagemBase64?: string;
  materiaisIds: number[];
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface TokenResponse {
  token: string;
}
