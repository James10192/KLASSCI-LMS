import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { LiquidGlassBackgroundComponent } from '@shared/components/liquid-glass-background/liquid-glass-background.component';
import { LiquidGlassCardComponent } from '@shared/components/liquid-glass-card/liquid-glass-card.component';

@Component({
  selector: 'lg-forum-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LiquidGlassBackgroundComponent,
    LiquidGlassCardComponent
  ],
  template: `
    <lg-liquid-glass-background variant="default">
      <div class="forum-main-container">
        <div class="header">
          <div class="brand-section">
            <img src="assets/images/logo_klassci.png" alt="KLASSCI" class="brand-logo">
          </div>
          <h1>Forums de Discussion</h1>
          <p>Espaces d'échange et de collaboration pour la communauté KLASSCI</p>
        </div>

        <div class="forums-grid">
          <!-- Forum Général -->
          <lg-liquid-glass-card
            variant="large"
            [opacity]="15"
            blur="lg"
            [interactive]="true"
            class="forum-card">
            <a routerLink="/chat/general" class="forum-link">
              <div class="forum-icon general">
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="forum-info">
                <h3>Forum Général</h3>
                <p>Discussions générales, annonces et actualités de l'établissement</p>
                <div class="forum-stats">
                  <span class="stat">25 sujets</span>
                  <span class="stat">142 messages</span>
                </div>
              </div>
            </a>
          </lg-liquid-glass-card>

          <!-- Forums par Cours -->
          <lg-liquid-glass-card
            variant="large"
            [opacity]="15"
            blur="lg"
            [interactive]="true"
            class="forum-card">
            <div class="forum-link">
              <div class="forum-icon courses">
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
                </svg>
              </div>
              <div class="forum-info">
                <h3>Forums par Cours</h3>
                <p>Discussions spécifiques à chaque matière et cours</p>
                <div class="courses-list">
                  <a routerLink="/chat/course/math" class="course-link">Mathématiques</a>
                  <a routerLink="/chat/course/physique" class="course-link">Physique</a>
                  <a routerLink="/chat/course/informatique" class="course-link">Informatique</a>
                  <a class="course-link more">+ Voir tous les cours</a>
                </div>
              </div>
            </div>
          </lg-liquid-glass-card>
        </div>

        <!-- Derniers Messages -->
        <lg-liquid-glass-card variant="default" [opacity]="10" blur="md" class="recent-messages">
          <div class="recent-content">
            <h2>Derniers Messages</h2>
            <div class="messages-list">
              <div class="message-item">
                <div class="message-info">
                  <span class="message-title">Nouvelle procédure d'inscription</span>
                  <span class="message-meta">Forum Général • Il y a 2h</span>
                </div>
              </div>
              <div class="message-item">
                <div class="message-info">
                  <span class="message-title">Question sur le TD de mathématiques</span>
                  <span class="message-meta">Forum Mathématiques • Il y a 4h</span>
                </div>
              </div>
              <div class="message-item">
                <div class="message-info">
                  <span class="message-title">Partage de ressources informatique</span>
                  <span class="message-meta">Forum Informatique • Hier</span>
                </div>
              </div>
            </div>
          </div>
        </lg-liquid-glass-card>
      </div>
    </lg-liquid-glass-background>
  `,
  styles: [`
    .forum-main-container {
      min-height: 100vh;
      padding: 2rem;
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .brand-section {
      margin-bottom: 2rem;

      .brand-logo {
        height: 60px;
        width: auto;
        max-width: 240px;
        filter: drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3));
        transition: transform 0.3s ease;

        &:hover {
          transform: scale(1.05);
        }
      }
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

    .forums-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .forum-card {
      transition: transform 0.3s ease;
    }

    .forum-card:hover {
      transform: translateY(-5px);
    }

    .forum-link {
      display: flex;
      align-items: flex-start;
      gap: 1.5rem;
      padding: 2rem;
      text-decoration: none;
      color: inherit;
    }

    .forum-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: white;
    }

    .forum-icon.general {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    }

    .forum-icon.courses {
      background: linear-gradient(135deg, #10b981, #047857);
    }

    .forum-info {
      flex: 1;
    }

    .forum-info h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: 0.5rem;
    }

    .forum-info p {
      color: #cbd5e1;
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .forum-stats {
      display: flex;
      gap: 1rem;
    }

    .stat {
      font-size: 0.875rem;
      color: #94a3b8;
    }

    .courses-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .course-link {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.875rem;
      transition: color 0.2s ease;
    }

    .course-link:hover {
      color: #60a5fa;
    }

    .course-link.more {
      color: #8b5cf6;
      font-style: italic;
    }

    .recent-messages {
      max-width: 800px;
      margin: 0 auto;
    }

    .recent-content {
      padding: 2rem;
    }

    .recent-content h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: 1.5rem;
    }

    .messages-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .message-item {
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .message-title {
      display: block;
      color: white;
      font-weight: 500;
      margin-bottom: 0.25rem;
    }

    .message-meta {
      font-size: 0.875rem;
      color: #94a3b8;
    }

    @media (max-width: 768px) {
      .forum-main-container {
        padding: 1rem;
      }

      .forums-grid {
        grid-template-columns: 1fr;
      }

      .forum-link {
        flex-direction: column;
        text-align: center;
      }

      .header h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class ForumMainComponent {}