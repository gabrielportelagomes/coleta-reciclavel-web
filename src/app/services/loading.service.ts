import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  readonly mapLoading = signal<boolean>(false);

  readonly globalLoading = signal<boolean>(false);

  private activeRequests = 0;

  showGlobal() {
    this.activeRequests++;
    this.globalLoading.set(true);
  }

  hideGlobal() {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    if (this.activeRequests === 0) {
      this.globalLoading.set(false);
    }
  }

  setMapLoading(loading: boolean) {
    this.mapLoading.set(loading);
  }
}
