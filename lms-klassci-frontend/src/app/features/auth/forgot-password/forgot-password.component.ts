import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { LiquidGlassBackgroundComponent } from '@shared/components/liquid-glass-background/liquid-glass-background.component';
import { LiquidGlassCardComponent } from '@shared/components/liquid-glass-card/liquid-glass-card.component';

@Component({
  selector: 'lg-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LiquidGlassBackgroundComponent,
    LiquidGlassCardComponent
  ],
  template: `
    <lg-liquid-glass-background variant="dark">
      <div class="forgot-password-container">
        <lg-liquid-glass-card variant="large" [opacity]="15" blur="lg">
          <div class="content">
            <h2>Mot de passe oublié</h2>
            <p>Cette fonctionnalité sera bientôt disponible.</p>
            <a routerLink="/auth/login" class="back-link">
              Retour à la connexion
            </a>
          </div>
        </lg-liquid-glass-card>
      </div>
    </lg-liquid-glass-background>
  `,
  styles: [`
    .forgot-password-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
    }

    .content {
      text-align: center;
      color: white;
    }

    h2 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    p {
      color: #cbd5e1;
      margin-bottom: 2rem;
    }

    .back-link {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
    }

    .back-link:hover {
      color: #60a5fa;
      text-decoration: underline;
    }
  `]
})
export class ForgotPasswordComponent {}