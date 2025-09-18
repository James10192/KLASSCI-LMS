import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { LiquidGlassBackgroundComponent } from '@shared/components/liquid-glass-background/liquid-glass-background.component';
import { LiquidGlassCardComponent } from '@shared/components/liquid-glass-card/liquid-glass-card.component';

@Component({
  selector: 'lg-forum-general',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LiquidGlassBackgroundComponent,
    LiquidGlassCardComponent
  ],
  template: `
    <lg-liquid-glass-background variant="default">
      <div class="forum-general-container">
        <div class="header">
          <a routerLink="/chat" class="back-link">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
            </svg>
            Retour aux forums
          </a>
          <h1>Forum Général</h1>
          <p>Discussions générales et annonces de l'établissement</p>
        </div>

        <!-- Actions -->
        <div class="forum-actions">
          <lg-liquid-glass-card variant="compact" [opacity]="10" blur="md" class="action-card">
            <button class="new-topic-btn">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
              </svg>
              Nouveau sujet
            </button>
          </lg-liquid-glass-card>
        </div>

        <!-- Topics List -->
        <div class="topics-list">
          <!-- Épinglé -->
          <lg-liquid-glass-card variant="default" [opacity]="12" blur="lg" class="topic-card pinned">
            <div class="topic-content">
              <div class="topic-header">
                <div class="topic-info">
                  <div class="topic-meta">
                    <span class="pinned-badge">📌 Épinglé</span>
                    <span class="category">Annonces</span>
                  </div>
                  <h3 class="topic-title">Règlement du forum et bonnes pratiques</h3>
                  <p class="topic-preview">Merci de lire attentivement les règles d'utilisation du forum avant de poster...</p>
                </div>
                <div class="topic-stats">
                  <div class="stat">
                    <span class="stat-number">45</span>
                    <span class="stat-label">Réponses</span>
                  </div>
                  <div class="stat">
                    <span class="stat-number">1.2k</span>
                    <span class="stat-label">Vues</span>
                  </div>
                </div>
              </div>
              <div class="topic-footer">
                <div class="author">
                  <span class="author-name">Admin KLASSCI</span>
                  <span class="post-date">Il y a 3 mois</span>
                </div>
                <div class="last-activity">
                  <span class="last-author">Marie Dupont</span>
                  <span class="last-date">Il y a 2 jours</span>
                </div>
              </div>
            </div>
          </lg-liquid-glass-card>

          <!-- Topic normal -->
          <lg-liquid-glass-card variant="default" [opacity]="8" blur="md" class="topic-card">
            <div class="topic-content">
              <div class="topic-header">
                <div class="topic-info">
                  <div class="topic-meta">
                    <span class="category">Général</span>
                  </div>
                  <h3 class="topic-title">Nouvelle procédure d'inscription pour 2024</h3>
                  <p class="topic-preview">Suite aux changements réglementaires, voici les nouvelles modalités d'inscription...</p>
                </div>
                <div class="topic-stats">
                  <div class="stat">
                    <span class="stat-number">12</span>
                    <span class="stat-label">Réponses</span>
                  </div>
                  <div class="stat">
                    <span class="stat-number">356</span>
                    <span class="stat-label">Vues</span>
                  </div>
                </div>
              </div>
              <div class="topic-footer">
                <div class="author">
                  <span class="author-name">Secrétariat</span>
                  <span class="post-date">Il y a 5 heures</span>
                </div>
                <div class="last-activity">
                  <span class="last-author">Pierre Martin</span>
                  <span class="last-date">Il y a 2 heures</span>
                </div>
              </div>
            </div>
          </lg-liquid-glass-card>

          <!-- Topic actif -->
          <lg-liquid-glass-card variant="default" [opacity]="8" blur="md" class="topic-card active">
            <div class="topic-content">
              <div class="topic-header">
                <div class="topic-info">
                  <div class="topic-meta">
                    <span class="category">Questions</span>
                    <span class="active-badge">🔥 Actif</span>
                  </div>
                  <h3 class="topic-title">Problème d'accès à la plateforme</h3>
                  <p class="topic-preview">Bonjour, je n'arrive plus à me connecter depuis hier matin...</p>
                </div>
                <div class="topic-stats">
                  <div class="stat">
                    <span class="stat-number">8</span>
                    <span class="stat-label">Réponses</span>
                  </div>
                  <div class="stat">
                    <span class="stat-number">124</span>
                    <span class="stat-label">Vues</span>
                  </div>
                </div>
              </div>
              <div class="topic-footer">
                <div class="author">
                  <span class="author-name">Jean Durand</span>
                  <span class="post-date">Hier</span>
                </div>
                <div class="last-activity">
                  <span class="last-author">Support IT</span>
                  <span class="last-date">Il y a 15 min</span>
                </div>
              </div>
            </div>
          </lg-liquid-glass-card>
        </div>
      </div>
    </lg-liquid-glass-background>
  `,
  styles: [`
    .forum-general-container {
      min-height: 100vh;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 2rem;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
      margin-bottom: 1rem;
      transition: color 0.2s ease;
    }

    .back-link:hover {
      color: #60a5fa;
    }

    .header h1 {
      font-size: 2.5rem;
      font-weight: 800;
      color: white;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .header p {
      font-size: 1.125rem;
      color: #cbd5e1;
    }

    .forum-actions {
      margin-bottom: 2rem;
    }

    .action-card {
      display: inline-block;
    }

    .new-topic-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .new-topic-btn:hover {
      transform: translateY(-2px);
    }

    .topics-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .topic-card {
      transition: transform 0.2s ease;
      cursor: pointer;
    }

    .topic-card:hover {
      transform: translateY(-2px);
    }

    .topic-card.pinned {
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .topic-card.active {
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .topic-content {
      padding: 1.5rem;
    }

    .topic-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .topic-info {
      flex: 1;
    }

    .topic-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    .category {
      font-size: 0.875rem;
      color: #94a3b8;
      font-weight: 500;
    }

    .pinned-badge {
      font-size: 0.875rem;
      color: #3b82f6;
      font-weight: 600;
    }

    .active-badge {
      font-size: 0.875rem;
      color: #ef4444;
      font-weight: 600;
    }

    .topic-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: white;
      margin-bottom: 0.5rem;
      line-height: 1.4;
    }

    .topic-preview {
      font-size: 0.875rem;
      color: #cbd5e1;
      line-height: 1.5;
    }

    .topic-stats {
      display: flex;
      gap: 1rem;
      margin-left: 1rem;
    }

    .stat {
      text-align: center;
    }

    .stat-number {
      display: block;
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
    }

    .stat-label {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .topic-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .author, .last-activity {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .author-name, .last-author {
      font-size: 0.875rem;
      font-weight: 500;
      color: white;
    }

    .post-date, .last-date {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    @media (max-width: 768px) {
      .forum-general-container {
        padding: 1rem;
      }

      .topic-header {
        flex-direction: column;
        gap: 1rem;
      }

      .topic-stats {
        margin-left: 0;
      }

      .topic-footer {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .header h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class ForumGeneralComponent {}