import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { ColetaService } from '../services/coleta.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const coletaService = inject(ColetaService);
  const router = inject(Router);

  if (coletaService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/admin/login']);
  return false;
};
