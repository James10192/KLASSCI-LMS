import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { LiquidGlassBackgroundComponent } from '@shared/components/liquid-glass-background/liquid-glass-background.component';
import { LiquidGlassCardComponent } from '@shared/components/liquid-glass-card/liquid-glass-card.component';
import { KlassciApiService, KlassciUser } from '@core/services/klassci-api.service';

interface DashboardCard {
  id: string;
  title: string;
  subtitle: string;
  value: number;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
  link?: string;
  loading: boolean;
}

@Component({
  selector: 'lg-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LiquidGlassBackgroundComponent,
    LiquidGlassCardComponent
  ],
  template: `
    <lg-liquid-glass-background [variant]="backgroundVariant()" [enableAdvancedEffects]="true">
      <div class="dashboard-container">

        <!-- Header -->
        <header class="dashboard-header">
          <div class="welcome-section">
            <h1 class="welcome-title">
              Bonjour {{ currentUser()?.nom || 'Utilisateur' }} 👋
            </h1>
            <p class="welcome-subtitle">
              {{ getWelcomeMessage() }}
            </p>
          </div>

          <div class="user-actions">
            <button class="action-btn" (click)="refreshData()" [disabled]="isRefreshing()">
              <svg class="icon" [class.spinning]="isRefreshing()" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path>
              </svg>
              Actualiser
            </button>

            <button class="action-btn profile-btn" (click)="goToProfile()">
              <div class="avatar">
                {{ getInitials() }}
              </div>
              Profil
            </button>

            <button class="action-btn logout-btn" (click)="logout()">
              <svg class="icon" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 001-1h10.586l-2.293 2.293a1 1 0 001.414 1.414l4-4a1 1 0 000-1.414l-4-4a1 1 0 10-1.414 1.414L15.586 3H3z" clip-rule="evenodd"></path>
              </svg>
              Déconnexion
            </button>
          </div>
        </header>

        <!-- Stats Grid -->
        <section class="stats-grid">
          @for (card of dashboardCards(); track card.id) {
            <lg-liquid-glass-card
              [variant]="'dashboard'"
              [opacity]="12"
              [blur]="'lg'"
              [interactive]="!!card.link"
              [loading]="card.loading"
              (cardClick)="onCardClick(card)"
              class="stat-card"
              [attr.data-color]="card.color">

              <div class="card-content">
                <div class="card-header">
                  <div class="card-icon" [attr.data-color]="card.color">
                    <div [innerHTML]="card.icon"></div>
                  </div>
                  <div class="card-info">
                    <h3 class="card-title">{{ card.title }}</h3>
                    <p class="card-subtitle">{{ card.subtitle }}</p>
                  </div>
                </div>

                <div class="card-value">
                  <span class="value-number">{{ card.value }}</span>
                </div>

                <div class="card-action" *ngIf="card.link">
                  <span class="action-text">Voir plus</span>
                  <svg class="action-arrow" width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </lg-liquid-glass-card>
          }
        </section>

        <!-- Quick Actions -->
        <section class="quick-actions">
          <lg-liquid-glass-card variant="large" [opacity]="10" blur="xl">
            <div class="quick-actions-content">
              <h2 class="section-title">Actions rapides</h2>

              <div class="actions-grid">
                @for (action of quickActions(); track action.id) {
                  <button
                    class="quick-action-btn"
                    (click)="onQuickAction(action)"
                    [disabled]="action.disabled">
                    <div class="action-icon" [innerHTML]="action.icon"></div>
                    <span class="action-label">{{ action.label }}</span>
                  </button>
                }
              </div>
            </div>
          </lg-liquid-glass-card>
        </section>

        <!-- Recent Activity -->
        <section class="recent-activity" *ngIf="recentActivities().length > 0">
          <lg-liquid-glass-card variant="default" [opacity]="8" blur="md">
            <div class="activity-content">
              <h2 class="section-title">Activité récente</h2>

              <div class="activity-list">
                @for (activity of recentActivities(); track activity.id) {
                  <div class="activity-item">
                    <div class="activity-icon">
                      <div [innerHTML]="activity.icon"></div>
                    </div>
                    <div class="activity-details">
                      <p class="activity-text">{{ activity.text }}</p>
                      <span class="activity-time">{{ activity.time }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>
          </lg-liquid-glass-card>
        </section>
      </div>
    </lg-liquid-glass-background>
  `,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private klassciApi = inject(KlassciApiService);
  private router = inject(Router);

  // State signals
  currentUser = signal<KlassciUser | null>(null);
  isRefreshing = signal(false);
  dashboardCards = signal<DashboardCard[]>([]);
  quickActions = signal<any[]>([]);
  recentActivities = signal<any[]>([]);

  // Computed properties
  backgroundVariant = computed(() => {
    const user = this.currentUser();
    if (!user) return 'default';

    switch (user.role) {
      case 'enseignant': return 'educator';
      case 'etudiant': return 'student';
      case 'coordinateur':
      case 'super_admin': return 'admin';
      default: return 'default';
    }
  });

  ngOnInit() {
    this.initializeUser();
    this.loadDashboardData();
    this.setupQuickActions();
    this.loadRecentActivity();
  }

  private initializeUser() {
    this.klassciApi.currentUser$.subscribe(user => {
      this.currentUser.set(user);
      if (user) {
        this.updateDashboardForRole(user.role);
      }
    });
  }

  private loadDashboardData() {
    const user = this.currentUser();
    if (!user) return;

    // Données de base selon le rôle
    if (user.role === 'enseignant') {
      this.loadTeacherData();
    } else if (user.role === 'etudiant') {
      this.loadStudentData();
    } else if (user.role === 'coordinateur' || user.role === 'super_admin') {
      this.loadAdminData();
    }
  }

  private loadTeacherData() {
    const cards: DashboardCard[] = [
      {
        id: 'classes',
        title: 'Mes Classes',
        subtitle: 'Classes assignées',
        value: 0,
        icon: '<svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path></svg>',
        color: 'blue',
        link: '/courses',
        loading: true
      },
      {
        id: 'evaluations',
        title: 'Évaluations',
        subtitle: 'À programmer',
        value: 0,
        icon: '<svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z" clip-rule="evenodd"></path></svg>',
        color: 'purple',
        link: '/evaluations',
        loading: true
      },
      {
        id: 'matieres',
        title: 'Matières',
        subtitle: 'Enseignées',
        value: 0,
        icon: '<svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path></svg>',
        color: 'green',
        link: '/courses',
        loading: true
      },
      {
        id: 'messages',
        title: 'Messages',
        subtitle: 'Non lus',
        value: 0,
        icon: '<svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>',
        color: 'orange',
        link: '/chat',
        loading: true
      }
    ];

    this.dashboardCards.set(cards);

    // Charger les données réelles
    this.loadClassesData();
    this.loadMatieresData();
  }

  private loadStudentData() {
    const cards: DashboardCard[] = [
      {
        id: 'courses',
        title: 'Mes Cours',
        subtitle: 'Cours suivis',
        value: 0,
        icon: '<svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path></svg>',
        color: 'blue',
        link: '/courses',
        loading: false
      },
      {
        id: 'grades',
        title: 'Notes',
        subtitle: 'Moyenne générale',
        value: 0,
        icon: '<svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z" clip-rule="evenodd"></path></svg>',
        color: 'green',
        loading: false
      },
      {
        id: 'assignments',
        title: 'Devoirs',
        subtitle: 'À rendre',
        value: 0,
        icon: '<svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>',
        color: 'purple',
        loading: false
      }
    ];

    this.dashboardCards.set(cards);
  }

  private loadAdminData() {
    const cards: DashboardCard[] = [
      {
        id: 'students',
        title: 'Étudiants',
        subtitle: 'Total inscrits',
        value: 0,
        icon: '<svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path></svg>',
        color: 'blue',
        link: '/admin/students',
        loading: true
      },
      {
        id: 'teachers',
        title: 'Enseignants',
        subtitle: 'Personnel actif',
        value: 0,
        icon: '<svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path></svg>',
        color: 'green',
        link: '/admin/teachers',
        loading: true
      },
      {
        id: 'classes',
        title: 'Classes',
        subtitle: 'Année courante',
        value: 0,
        icon: '<svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z" clip-rule="evenodd"></path></svg>',
        color: 'purple',
        link: '/admin/classes',
        loading: true
      }
    ];

    this.dashboardCards.set(cards);
    this.loadClassesData();
  }

  private loadClassesData() {
    this.klassciApi.getClasses().subscribe({
      next: (classes) => {
        this.updateCardValue('classes', classes.length);
      },
      error: () => {
        this.updateCardValue('classes', 0);
      }
    });
  }

  private loadMatieresData() {
    this.klassciApi.getMatieres().subscribe({
      next: (matieres) => {
        this.updateCardValue('matieres', matieres.length);
      },
      error: () => {
        this.updateCardValue('matieres', 0);
      }
    });
  }

  private updateCardValue(cardId: string, value: number) {
    const cards = this.dashboardCards();
    const updatedCards = cards.map(card =>
      card.id === cardId ? { ...card, value, loading: false } : card
    );
    this.dashboardCards.set(updatedCards);
  }

  private updateDashboardForRole(role: string) {
    // Actions rapides selon le rôle
    let actions: any[] = [];

    if (role === 'enseignant') {
      actions = [
        {
          id: 'new-evaluation',
          label: 'Nouvelle évaluation',
          icon: '<svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path></svg>',
          disabled: false
        },
        {
          id: 'attendance',
          label: 'Prendre présences',
          icon: '<svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>',
          disabled: false
        }
      ];
    } else if (role === 'etudiant') {
      actions = [
        {
          id: 'view-schedule',
          label: 'Mon emploi du temps',
          icon: '<svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>',
          disabled: false
        },
        {
          id: 'view-grades',
          label: 'Mes notes',
          icon: '<svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z" clip-rule="evenodd"></path></svg>',
          disabled: false
        }
      ];
    }

    this.quickActions.set(actions);
  }

  private setupQuickActions() {
    const user = this.currentUser();
    if (user) {
      this.updateDashboardForRole(user.role);
    }
  }

  private loadRecentActivity() {
    // Simuler des activités récentes
    const activities = [
      {
        id: '1',
        text: 'Nouvelle évaluation de Mathématiques créée',
        time: 'Il y a 2 heures',
        icon: '<svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path></svg>'
      },
      {
        id: '2',
        text: 'Notes saisies pour la classe Licence 1',
        time: 'Hier',
        icon: '<svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>'
      }
    ];

    this.recentActivities.set(activities);
  }

  getWelcomeMessage(): string {
    const user = this.currentUser();
    if (!user) return 'Bienvenue sur votre plateforme d\'apprentissage';

    switch (user.role) {
      case 'enseignant':
        return 'Gérez vos cours et évaluations facilement';
      case 'etudiant':
        return 'Suivez vos cours et consultez vos notes';
      case 'coordinateur':
        return 'Supervisez l\'activité pédagogique';
      case 'super_admin':
        return 'Administration complète de la plateforme';
      default:
        return 'Bienvenue sur votre plateforme d\'apprentissage';
    }
  }

  getInitials(): string {
    const user = this.currentUser();
    if (!user?.nom) return 'U';

    return user.nom.split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  refreshData() {
    this.isRefreshing.set(true);
    setTimeout(() => {
      this.loadDashboardData();
      this.isRefreshing.set(false);
    }, 2000);
  }

  onCardClick(card: DashboardCard) {
    if (card.link) {
      this.router.navigate([card.link]);
    }
  }

  onQuickAction(action: any) {
    switch (action.id) {
      case 'new-evaluation':
        this.router.navigate(['/evaluations/new']);
        break;
      case 'attendance':
        this.router.navigate(['/courses/attendance']);
        break;
      case 'view-schedule':
        this.router.navigate(['/schedule']);
        break;
      case 'view-grades':
        this.router.navigate(['/grades']);
        break;
    }
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.klassciApi.logout().subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }
}