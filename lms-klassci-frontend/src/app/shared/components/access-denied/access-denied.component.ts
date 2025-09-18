import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lg-access-denied',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="access-denied-container">
      <div class="content">
        <h1>Accès refusé</h1>
        <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        <a routerLink="/dashboard" class="home-link">Retour au dashboard</a>
      </div>
    </div>
  `,
  styles: [`
    .access-denied-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      color: white;
    }
    .home-link {
      color: #3b82f6;
      text-decoration: none;
    }
  `]
})
export class AccessDeniedComponent {}