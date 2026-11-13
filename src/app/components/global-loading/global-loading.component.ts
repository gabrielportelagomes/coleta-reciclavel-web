import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-global-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './global-loading.component.html',
  styleUrl: './global-loading.component.scss'
})
export class GlobalLoadingComponent {
  public loadingService = inject(LoadingService);
}
