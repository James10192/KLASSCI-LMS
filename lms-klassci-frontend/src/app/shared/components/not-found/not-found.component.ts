import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lg-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="not-found-container">
      <div class="content">
        <h1>404 - Page non trouvée</h1>
        <p>La page que vous recherchez n'existe pas.</p>
        <a routerLink="/dashboard" class="home-link">Retour au dashboard</a>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
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
export class NotFoundComponent {}