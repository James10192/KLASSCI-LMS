import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';

import { routes } from './app.routes';
import { AuthInterceptor } from '@core/interceptors/auth.interceptor';
import { environment } from '@environments/environment';

// Material imports
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

export const appConfig: ApplicationConfig = {
  providers: [
    // Router configuration
    provideRouter(
      routes,
      withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      })
    ),

    // HTTP configuration avec intercepteurs
    provideHttpClient(
      withInterceptors([AuthInterceptor])
    ),

    // Animations
    provideAnimations(),

    // Service Worker pour PWA
    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    }),

    // Material modules
    importProvidersFrom(
      MatSnackBarModule,
      MatDialogModule
    )
  ]
};