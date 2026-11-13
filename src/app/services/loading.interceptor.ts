import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  const isMapPointsRequest = req.url.includes('/pontos-coleta/aprovados');

  if (!isMapPointsRequest) {
    loadingService.showGlobal();
  }

  return next(req).pipe(
    finalize(() => {
      if (!isMapPointsRequest) {
        loadingService.hideGlobal();
      }
    })
  );
};
