import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiquidGlassBackgroundComponent } from '@shared/components/liquid-glass-background/liquid-glass-background.component';
import { LiquidGlassCardComponent } from '@shared/components/liquid-glass-card/liquid-glass-card.component';

@Component({
  selector: 'lg-evaluation-detail',
  standalone: true,
  imports: [
    CommonModule,
    LiquidGlassBackgroundComponent,
    LiquidGlassCardComponent
  ],
  template: `
    <lg-liquid-glass-background variant="educator">
      <div class="evaluation-detail-container">
        <lg-liquid-glass-card variant="large" [opacity]="15" blur="lg">
          <div class="content">
            <h1>Détails de l'Évaluation</h1>
            <p>Consultation et gestion d'une évaluation spécifique.</p>
            <p>Fonctionnalités prévues :</p>
            <ul>
              <li>• Informations de l'évaluation</li>
              <li>• Saisie des notes</li>
              <li>• Liste des participants</li>
              <li>• Statistiques des résultats</li>
              <li>• Export des données</li>
            </ul>
          </div>
        </lg-liquid-glass-card>
      </div>
    </lg-liquid-glass-background>
  `,
  styles: [`
    .evaluation-detail-container {
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

    ul {
      text-align: left;
      color: #cbd5e1;
      max-width: 300px;
      margin: 0 auto;
    }

    li {
      margin-bottom: 0.5rem;
    }
  `]
})
export class EvaluationDetailComponent {}