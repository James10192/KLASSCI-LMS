import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { LiquidGlassBackgroundComponent } from '@shared/components/liquid-glass-background/liquid-glass-background.component';
import { KlassciApiService } from '@core/services/klassci-api.service';

@Component({
  selector: 'lg-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    LiquidGlassBackgroundComponent
  ],
  template: `
    <lg-liquid-glass-background
      [variant]="backgroundVariant()"
      [enableAdvancedEffects]="enableAdvancedEffects()">

      <!-- Navigation events loading indicator -->
      <div class="navigation-loader" *ngIf="isNavigating()" role="status" aria-label="Navigation en cours">
        <div class="loader-bar"></div>
      </div>

      <!-- Main application content -->
      <main class="app-main" [class.loading]="isNavigating()">
        <router-outlet></router-outlet>
      </main>

      <!-- Global error boundary -->
      <div class="error-boundary" *ngIf="hasGlobalError()" role="alert">
        <lg-liquid-glass-card variant="compact" [opacity]="20">
          <div class="error-content">
            <h3>Une erreur est survenue</h3>
            <p>{{ globalErrorMessage() }}</p>
            <button (click)="dismissError()" class="dismiss-btn">
              Fermer
            </button>
          </div>
        </lg-liquid-glass-card>
      </div>
    </lg-liquid-glass-background>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private klassciApi = inject(KlassciApiService);

  // Signals pour état global
  isNavigating = signal(false);
  hasGlobalError = signal(false);
  globalErrorMessage = signal('');
  enableAdvancedEffects = signal(true);

  // Computed pour variant du background selon utilisateur
  backgroundVariant = signal<'default' | 'dark' | 'educator' | 'student' | 'admin'>('default');

  ngOnInit() {
    this.setupNavigationLoading();
    this.setupUserContextualBackground();
    this.detectPerformanceCapabilities();
    this.initializeApp();
  }

  private setupNavigationLoading() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isNavigating.set(false);
    });

    // Démarrer le loading sur navigation
    this.router.events.subscribe(event => {
      if (event.constructor.name === 'NavigationStart') {
        this.isNavigating.set(true);
      }
    });
  }

  private setupUserContextualBackground() {
    this.klassciApi.currentUser$.subscribe(user => {
      if (user) {
        switch (user.role) {
          case 'enseignant':
            this.backgroundVariant.set('educator');
            break;
          case 'etudiant':
            this.backgroundVariant.set('student');
            break;
          case 'coordinateur':
          case 'super_admin':
            this.backgroundVariant.set('admin');
            break;
          default:
            this.backgroundVariant.set('default');
        }
      } else {
        this.backgroundVariant.set('dark'); // Mode authentification
      }
    });
  }

  private detectPerformanceCapabilities() {
    // Détection des capacités device
    const deviceMemory = (navigator as any).deviceMemory || 4;
    const isMobile = window.innerWidth < 768;
    const isLowPowerDevice = deviceMemory < 4 || isMobile;

    if (isLowPowerDevice) {
      this.enableAdvancedEffects.set(false);
    }

    // Adaptation selon les préférences utilisateur
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.enableAdvancedEffects.set(false);
    }
  }

  private initializeApp() {
    // Initialisation de l'app selon le token stocké
    const token = this.klassciApi.getAuthToken();
    if (token) {
      this.klassciApi.getCurrentUser().subscribe({
        next: () => {
          // Utilisateur connecté, rediriger si nécessaire
          if (this.router.url === '/' || this.router.url.startsWith('/auth')) {
            this.router.navigate(['/dashboard']);
          }
        },
        error: () => {
          // Token invalide, nettoyer et rediriger
          this.router.navigate(['/auth/login']);
        }
      });
    }
  }

  dismissError() {
    this.hasGlobalError.set(false);
    this.globalErrorMessage.set('');
  }

  // Méthode pour gérer les erreurs globales depuis d'autres composants
  showGlobalError(message: string) {
    this.globalErrorMessage.set(message);
    this.hasGlobalError.set(true);

    // Auto-dismiss après 10 secondes
    setTimeout(() => {
      this.dismissError();
    }, 10000);
  }
}