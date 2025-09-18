import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink, NavigationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { LiquidGlassBackgroundComponent } from '@shared/components/liquid-glass-background/liquid-glass-background.component';
import { LiquidGlassCardComponent } from '@shared/components/liquid-glass-card/liquid-glass-card.component';
import { KlassciApiService } from '@core/services/klassci-api.service';
import { RoleService } from '@core/services/role.service';

@Component({
  selector: 'lg-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    LiquidGlassBackgroundComponent,
    LiquidGlassCardComponent
  ],
  template: `
    <lg-liquid-glass-background variant="dark" [enableAdvancedEffects]="true">
      <div class="login-container">

        <!-- Logo et titre -->
        <div class="header-section">
          <div class="logo-container">
            <img src="assets/images/logo_klassci.png" alt="KLASSCI" class="logo-image">
          </div>
          <p class="app-subtitle">Plateforme d'apprentissage moderne</p>
        </div>

        <!-- Formulaire de connexion -->
        <lg-liquid-glass-card
          variant="large"
          [opacity]="15"
          blur="lg"
          class="login-card">

          <div class="card-header">
            <h2>Connexion</h2>
            <p>Connectez-vous à votre espace d'apprentissage</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">

            <!-- Email ou nom d'utilisateur -->
            <div class="form-group">
              <label for="username" class="form-label">Email ou nom d'utilisateur</label>
              <div class="input-container">
                <input
                  id="username"
                  type="text"
                  formControlName="username"
                  class="form-input"
                  [class.error]="usernameErrors()"
                  placeholder="votre@email.com ou nom d'utilisateur"
                  autocomplete="username"
                  required>
                <div class="input-icon">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              </div>
              <div class="form-error" *ngIf="usernameErrors()">
                {{ usernameErrors() }}
              </div>
            </div>

            <!-- Mot de passe -->
            <div class="form-group">
              <label for="password" class="form-label">Mot de passe</label>
              <div class="input-container">
                <input
                  id="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  class="form-input"
                  [class.error]="passwordErrors()"
                  placeholder="••••••••"
                  autocomplete="current-password"
                  required>
                <button
                  type="button"
                  class="input-toggle"
                  (click)="togglePassword()"
                  [attr.aria-label]="showPassword() ? 'Cacher le mot de passe' : 'Afficher le mot de passe'">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20" *ngIf="!showPassword()">
                    <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"></path>
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"></path>
                  </svg>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20" *ngIf="showPassword()">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </div>
              <div class="form-error" *ngIf="passwordErrors()">
                {{ passwordErrors() }}
              </div>
            </div>

            <!-- Options -->
            <div class="form-options">
              <label class="checkbox-container">
                <input type="checkbox" formControlName="rememberMe">
                <span class="checkmark"></span>
                Se souvenir de moi
              </label>

              <a routerLink="/auth/forgot-password" class="forgot-link">
                Mot de passe oublié ?
              </a>
            </div>

            <!-- Bouton de connexion -->
            <button
              type="submit"
              class="submit-button"
              [disabled]="loginForm.invalid || isLoading()"
              [class.loading]="isLoading()">

              <span *ngIf="!isLoading()">Se connecter</span>
              <span *ngIf="isLoading()" class="loading-content">
                <svg class="spinner" width="20" height="20" viewBox="0 0 50 50">
                  <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-dasharray="31.416" stroke-dashoffset="31.416">
                    <animate attributeName="stroke-array" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                    <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                  </circle>
                </svg>
                Connexion...
              </span>
            </button>

            <!-- Message d'erreur global -->
            <div class="global-error" *ngIf="globalError()">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              {{ globalError() }}
            </div>
          </form>
        </lg-liquid-glass-card>
      </div>
    </lg-liquid-glass-background>
  `,
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private klassciApi = inject(KlassciApiService);
  private roleService = inject(RoleService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  // State signals
  isLoading = signal(false);
  showPassword = signal(false);
  globalError = signal('');

  loginForm!: FormGroup;
  private returnUrl = '/dashboard';

  // Computed error messages
  usernameErrors = signal('');
  passwordErrors = signal('');

  ngOnInit() {
    this.initForm();
    this.setupValidationMessages();
    this.getReturnUrl();
  }

  private initForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  private setupValidationMessages() {
    this.loginForm.get('username')?.statusChanges.subscribe(() => {
      this.updateUsernameErrors();
    });

    this.loginForm.get('password')?.statusChanges.subscribe(() => {
      this.updatePasswordErrors();
    });
  }

  private updateUsernameErrors() {
    const usernameControl = this.loginForm.get('username');
    if (usernameControl?.invalid && usernameControl?.touched) {
      if (usernameControl.errors?.['required']) {
        this.usernameErrors.set('L\'email ou nom d\'utilisateur est requis');
      }
    } else {
      this.usernameErrors.set('');
    }
  }

  private updatePasswordErrors() {
    const passwordControl = this.loginForm.get('password');
    if (passwordControl?.invalid && passwordControl?.touched) {
      if (passwordControl.errors?.['required']) {
        this.passwordErrors.set('Le mot de passe est requis');
      } else if (passwordControl.errors?.['minlength']) {
        this.passwordErrors.set('Le mot de passe doit contenir au moins 6 caractères');
      }
    } else {
      this.passwordErrors.set('');
    }
  }

  private getReturnUrl() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  private getRedirectUrlForUser(userRole: string): string {
    // Récupérer l'URL de retour des paramètres de query
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];

    // Valider et nettoyer l'URL de retour
    if (returnUrl && this.isValidReturnUrl(returnUrl)) {
      return decodeURIComponent(returnUrl);
    }

    // Sinon, utiliser la logique de redirection basée sur le rôle
    return this.roleService.getDefaultRedirectRoute(userRole);
  }

  private isValidReturnUrl(url: string): boolean {
    try {
      const decodedUrl = decodeURIComponent(url);

      // Rejeter les URLs qui pointent vers la page de login (évite les boucles)
      if (decodedUrl.includes('/auth/login')) {
        console.log('Rejected returnUrl (login loop):', decodedUrl);
        return false;
      }

      // Rejeter les URLs qui ne commencent pas par / (évite les redirections externes)
      if (!decodedUrl.startsWith('/')) {
        console.log('Rejected returnUrl (external):', decodedUrl);
        return false;
      }

      // Accepter les URLs valides
      console.log('Valid returnUrl:', decodedUrl);
      return true;
    } catch (error) {
      console.error('Invalid returnUrl format:', url, error);
      return false;
    }
  }

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  onSubmit() {
    if (this.loginForm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      this.globalError.set('');

      const { username, password } = this.loginForm.value;

      this.klassciApi.login(username, password).subscribe({
        next: (response) => {
          if (response.success) {
            const userRole = response.data.user.role;
            const redirectUrl = this.getRedirectUrlForUser(userRole);

            // Debug: Log pour diagnostiquer la redirection
            console.log('Login successful:', {
              userRole,
              redirectUrl,
              user: response.data.user
            });

            // Message personnalisé selon le rôle
            const roleDisplayName = this.roleService.getRoleDisplayName(userRole);
            this.snackBar.open(`Connexion réussie ! Bienvenue ${roleDisplayName}`, '', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });

            // Redirection avec un petit délai pour permettre à l'authentification de se propager
            setTimeout(() => {
              console.log('🚀 Attempting navigation to:', redirectUrl);

              // Écouter les événements de navigation pour debug
              this.router.events.subscribe(event => {
                console.log('🔄 Router event:', event.constructor.name, event);
              });

              this.router.navigateByUrl(redirectUrl).then(
                (success) => {
                  console.log('✅ Navigation result:', success);
                  if (success) {
                    console.log('✅ Successfully navigated to:', this.router.url);
                  } else {
                    console.log('❌ Navigation failed, current URL:', this.router.url);
                  }
                },
                (error) => console.error('❌ Navigation error:', error)
              );
            }, 100);
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          this.globalError.set(
            error.error || 'Identifiants incorrects'
          );
        },
        complete: () => {
          this.isLoading.set(false);
        }
      });
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      this.updateUsernameErrors();
      this.updatePasswordErrors();
    }
  }
}