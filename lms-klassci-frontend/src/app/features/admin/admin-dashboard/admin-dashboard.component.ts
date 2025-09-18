import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiquidGlassBackgroundComponent } from '@shared/components/liquid-glass-background/liquid-glass-background.component';
import { LiquidGlassCardComponent } from '@shared/components/liquid-glass-card/liquid-glass-card.component';

@Component({
  selector: 'lg-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LiquidGlassBackgroundComponent,
    LiquidGlassCardComponent
  ],
  template: `
    <lg-liquid-glass-background variant="admin">
      <div class="admin-dashboard-container">
        <lg-liquid-glass-card variant="large" [opacity]="15" blur="lg">
          <div class="content">
            <h1>Tableau de bord Admin</h1>
            <p>Interface d'administration du système LMS KLASSCI.</p>
            <p>Fonctionnalités en développement...</p>
          </div>
        </lg-liquid-glass-card>
      </div>
    </lg-liquid-glass-background>
  `,
  styles: [`
    .admin-dashboard-container {
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

    h1 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    p {
      color: #cbd5e1;
      margin-bottom: 1rem;
    }
  `]
})
export class AdminDashboardComponent {}