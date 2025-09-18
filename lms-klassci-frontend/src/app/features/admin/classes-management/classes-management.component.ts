import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LiquidGlassBackgroundComponent } from '@shared/components/liquid-glass-background/liquid-glass-background.component';
import { LiquidGlassCardComponent } from '@shared/components/liquid-glass-card/liquid-glass-card.component';
import { KlassciApiService, KlassciClasse } from '@core/services/klassci-api.service';

@Component({
  selector: 'lg-classes-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LiquidGlassBackgroundComponent,
    LiquidGlassCardComponent
  ],
  template: `
    <lg-liquid-glass-background variant="admin">
      <div class="classes-management-container">
        <!-- Header -->
        <div class="header-section">
          <lg-liquid-glass-card variant="large" [opacity]="10" blur="md">
            <div class="header-content">
              <h1 class="page-title">Gestion des Classes</h1>
              <p class="page-subtitle">Administration des classes et formations</p>
              <div class="header-actions">
                <button class="action-btn primary" (click)="showCreateModal = true">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Nouvelle Classe
                </button>
                <button class="action-btn secondary" (click)="loadClasses()">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Actualiser
                </button>
              </div>
            </div>
          </lg-liquid-glass-card>
        </div>

        <!-- Stats Overview -->
        <div class="stats-section">
          <div class="stats-grid">
            <lg-liquid-glass-card variant="compact" [opacity]="8" blur="sm">
              <div class="stat-content">
                <div class="stat-icon blue">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{classes().length}}</div>
                  <div class="stat-label">Classes Totales</div>
                </div>
              </div>
            </lg-liquid-glass-card>

            <lg-liquid-glass-card variant="compact" [opacity]="8" blur="sm">
              <div class="stat-content">
                <div class="stat-icon green">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{getTotalStudents()}}</div>
                  <div class="stat-label">Étudiants</div>
                </div>
              </div>
            </lg-liquid-glass-card>

            <lg-liquid-glass-card variant="compact" [opacity]="8" blur="sm">
              <div class="stat-content">
                <div class="stat-icon purple">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                  </svg>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{getActiveClasses()}}</div>
                  <div class="stat-label">Classes Actives</div>
                </div>
              </div>
            </lg-liquid-glass-card>
          </div>
        </div>

        <!-- Classes List -->
        <div class="classes-section">
          <lg-liquid-glass-card variant="large" [opacity]="12" blur="lg">
            <div class="classes-content">
              <div class="section-header">
                <h2 class="section-title">Liste des Classes</h2>
                <div class="search-filter">
                  <input
                    type="text"
                    placeholder="Rechercher une classe..."
                    class="search-input"
                    [(ngModel)]="searchTerm"
                    (input)="filterClasses()"
                  >
                </div>
              </div>

              @if (isLoading()) {
                <div class="loading-state">
                  <div class="loading-spinner"></div>
                  <p>Chargement des classes...</p>
                </div>
              } @else if (filteredClasses().length === 0) {
                <div class="empty-state">
                  <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  <p>Aucune classe trouvée</p>
                </div>
              } @else {
                <div class="classes-grid">
                  @for (classe of filteredClasses(); track classe.id) {
                    <div class="classe-card" [class.inactive]="!classe.is_active">
                      <div class="classe-header">
                        <h3 class="classe-name">{{classe.nom}}</h3>
                        <div class="classe-status" [class.active]="classe.is_active">
                          {{classe.is_active ? 'Active' : 'Inactive'}}
                        </div>
                      </div>

                      <div class="classe-info">
                        <div class="info-item">
                          <span class="label">Étudiants:</span>
                          <span class="value">{{classe.nb_etudiants || 0}}</span>
                        </div>
                        <div class="info-item">
                          <span class="label">Filière ID:</span>
                          <span class="value">{{classe.filiere_id}}</span>
                        </div>
                        <div class="info-item">
                          <span class="label">Niveau ID:</span>
                          <span class="value">{{classe.niveau_id}}</span>
                        </div>
                      </div>

                      <div class="classe-actions">
                        <button class="action-btn small primary" (click)="viewStudents(classe)">
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                          Voir
                        </button>
                        <button class="action-btn small secondary" (click)="editClasse(classe)">
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                          Modifier
                        </button>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </lg-liquid-glass-card>
        </div>

        <!-- Create Modal -->
        @if (showCreateModal) {
          <div class="modal-overlay" (click)="showCreateModal = false">
            <div class="modal-content" (click)="$event.stopPropagation()">
              <lg-liquid-glass-card variant="large" [opacity]="20" blur="xl">
                <div class="modal-body">
                  <h3 class="modal-title">Créer une nouvelle classe</h3>
                  <p class="modal-subtitle">Cette fonctionnalité sera bientôt disponible</p>
                  <div class="modal-actions">
                    <button class="action-btn secondary" (click)="showCreateModal = false">
                      Fermer
                    </button>
                  </div>
                </div>
              </lg-liquid-glass-card>
            </div>
          </div>
        }
      </div>
    </lg-liquid-glass-background>
  `,
  styles: [`
    .classes-management-container {
      min-height: 100vh;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    /* Header Section */
    .header-section {
      width: 100%;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 2rem;
      flex-wrap: wrap;
      gap: 1.5rem;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 800;
      color: white;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .page-subtitle {
      font-size: 1.125rem;
      color: #cbd5e1;
      font-weight: 400;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    /* Stats Section */
    .stats-section {
      width: 100%;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-icon.blue {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    }

    .stat-icon.green {
      background: linear-gradient(135deg, #10b981, #047857);
    }

    .stat-icon.purple {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    }

    .stat-icon svg {
      color: white;
    }

    .stat-info {
      flex: 1;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 800;
      color: white;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #94a3b8;
    }

    /* Classes Section */
    .classes-section {
      width: 100%;
      flex: 1;
    }

    .classes-content {
      padding: 2rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
    }

    .search-filter {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .search-input {
      padding: 0.75rem 1rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: white;
      font-size: 0.875rem;
      width: 250px;
      transition: all 0.3s ease;
    }

    .search-input::placeholder {
      color: #9ca3af;
    }

    .search-input:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.15);
      border-color: #3b82f6;
    }

    /* Classes Grid */
    .classes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .classe-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 1.5rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }

    .classe-card:hover {
      background: rgba(255, 255, 255, 0.08);
      transform: translateY(-2px);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .classe-card.inactive {
      opacity: 0.6;
    }

    .classe-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .classe-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: white;
      margin: 0;
    }

    .classe-status {
      padding: 0.25rem 0.75rem;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 500;
      background: rgba(239, 68, 68, 0.2);
      color: #fca5a5;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .classe-status.active {
      background: rgba(34, 197, 94, 0.2);
      color: #86efac;
      border-color: rgba(34, 197, 94, 0.3);
    }

    .classe-info {
      margin-bottom: 1.5rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .info-item .label {
      color: #9ca3af;
      font-size: 0.875rem;
    }

    .info-item .value {
      color: white;
      font-weight: 500;
      font-size: 0.875rem;
    }

    .classe-actions {
      display: flex;
      gap: 0.75rem;
    }

    /* Action Buttons */
    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      color: white;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      font-size: 0.875rem;
    }

    .action-btn.small {
      padding: 0.5rem 1rem;
      font-size: 0.8rem;
    }

    .action-btn.primary {
      background: rgba(59, 130, 246, 0.2);
      border-color: rgba(59, 130, 246, 0.4);
    }

    .action-btn.primary:hover {
      background: rgba(59, 130, 246, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(59, 130, 246, 0.2);
    }

    .action-btn.secondary {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .action-btn.secondary:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    /* Loading and Empty States */
    .loading-state, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      color: #9ca3af;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top: 3px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    .empty-state svg {
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }

    .modal-content {
      max-width: 400px;
      width: 100%;
      margin: 2rem;
    }

    .modal-body {
      padding: 2rem;
      text-align: center;
    }

    .modal-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: 0.5rem;
    }

    .modal-subtitle {
      color: #9ca3af;
      margin-bottom: 2rem;
    }

    .modal-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }

    /* Animations */
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .classes-management-container {
        padding: 1rem;
        gap: 1.5rem;
      }

      .header-content {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }

      .header-actions {
        justify-content: center;
      }

      .page-title {
        font-size: 2rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .classes-grid {
        grid-template-columns: 1fr;
      }

      .section-header {
        flex-direction: column;
        align-items: stretch;
      }

      .search-input {
        width: 100%;
      }
    }
  `]
})
export class ClassesManagementComponent implements OnInit {
  private klassciApi = inject(KlassciApiService);

  // Signals
  classes = signal<KlassciClasse[]>([]);
  filteredClasses = signal<KlassciClasse[]>([]);
  isLoading = signal(false);
  showCreateModal = false;
  searchTerm = '';

  ngOnInit() {
    this.loadClasses();
  }

  loadClasses() {
    this.isLoading.set(true);

    this.klassciApi.getClasses().subscribe({
      next: (classes) => {
        this.classes.set(classes);
        this.filteredClasses.set(classes);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des classes:', error);
        this.isLoading.set(false);
      }
    });
  }

  filterClasses() {
    const term = this.searchTerm.toLowerCase();
    const filtered = this.classes().filter(classe =>
      classe.nom.toLowerCase().includes(term)
    );
    this.filteredClasses.set(filtered);
  }

  getTotalStudents(): number {
    return this.classes().reduce((total, classe) => total + (classe.nb_etudiants || 0), 0);
  }

  getActiveClasses(): number {
    return this.classes().filter(classe => classe.is_active).length;
  }

  viewStudents(classe: KlassciClasse) {
    console.log('Voir les étudiants de:', classe.nom);
    // TODO: Navigation vers la liste des étudiants
  }

  editClasse(classe: KlassciClasse) {
    console.log('Modifier la classe:', classe.nom);
    // TODO: Ouvrir le modal d'édition
  }
}