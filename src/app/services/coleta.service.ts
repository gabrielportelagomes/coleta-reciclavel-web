import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Material, PontoColeta, PontoColetaRequest, LoginRequest, TokenResponse } from '../models/coleta.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ColetaService {
  private baseUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  listarMateriais(): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.baseUrl}/materiais`);
  }

  cadastrarMaterial(nome: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/materiais`, { nome }, { headers: this.getAuthHeader() });
  }

  excluirMaterial(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/materiais/${id}`, { headers: this.getAuthHeader() });
  }

  atualizarMaterial(id: number, nome: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/materiais/${id}`, { nome }, { headers: this.getAuthHeader() });
  }

  listarAprovados(): Observable<PontoColeta[]> {
    return this.http.get<PontoColeta[]>(`${this.baseUrl}/pontos-coleta/aprovados`);
  }

  sugerirPonto(ponto: PontoColetaRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/pontos-coleta`, ponto);
  }

  listarPendentes(): Observable<PontoColeta[]> {
    return this.http.get<PontoColeta[]>(`${this.baseUrl}/pontos-coleta/pendentes`, { headers: this.getAuthHeader() });
  }

  aprovarPonto(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/pontos-coleta/${id}/aprovar`, {}, { headers: this.getAuthHeader() });
  }

  rejeitarPonto(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/pontos-coleta/${id}/rejeitar`, {}, { headers: this.getAuthHeader() });
  }

  excluirPonto(id: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/pontos-coleta/${id}`, { headers: this.getAuthHeader() });
  }

  login(credenciais: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.baseUrl}/auth/login`, credenciais);
  }

  salvarToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private getAuthHeader(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}
