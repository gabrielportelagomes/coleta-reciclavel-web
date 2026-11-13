import { Routes } from '@angular/router';
import { MapaComponent } from './components/mapa/mapa.component';
import { SugerirPontoComponent } from './components/sugerir-ponto/sugerir-ponto.component';
import { InstrucoesComponent } from './components/instrucoes/instrucoes.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: MapaComponent },
  { path: 'sugerir', component: SugerirPontoComponent },
  { path: 'instrucoes', component: InstrucoesComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];
