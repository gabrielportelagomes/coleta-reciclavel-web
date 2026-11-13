import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ColetaService } from '../../services/coleta.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent implements OnInit {
  form!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private coletaService: ColetaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.coletaService.login(this.form.value).subscribe({
        next: (response) => {
          this.coletaService.salvarToken(response.token);
          this.router.navigate(['/admin/dashboard']);
        },
        error: (err) => {
          console.error('Erro no login', err);
          this.errorMessage = 'E-mail ou senha inválidos.';
        }
      });
    }
  }
}
