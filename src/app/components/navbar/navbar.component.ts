import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ColetaService } from '../../services/coleta.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(public coletaService: ColetaService, private router: Router
  ) {}

  isLoggedIn(): boolean {
    return this.coletaService.isLoggedIn();
  }

  logout(): void {
    this.coletaService.logout();
    this.router.navigate(['/']);
  }
}
