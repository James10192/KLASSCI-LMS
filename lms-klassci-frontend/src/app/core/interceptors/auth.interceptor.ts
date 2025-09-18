import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { KlassciApiService } from '@core/services/klassci-api.service';

// Global state for refresh token handling
let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export const AuthInterceptor: HttpInterceptorFn = (request: HttpRequest<any>, next) => {
  const router = inject(Router);
  const klassciApi = inject(KlassciApiService);
  // Ajouter le token d'auth si disponible
  const authToken = klassciApi.getAuthToken();

  if (authToken && isKlassciRequest(request)) {
    request = addTokenToRequest(request, authToken);
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Gestion des erreurs d'authentification
      if (error.status === 401 && isKlassciRequest(request)) {
        return handle401Error(request, next, router);
      }

      // Gestion des erreurs de réseau
      if (error.status === 0) {
        console.error('Erreur de réseau - Vérifiez votre connexion internet');
      }

      // Gestion des erreurs serveur
      if (error.status >= 500) {
        console.error('Erreur serveur - Veuillez réessayer plus tard');
      }

      return throwError(() => error);
    })
  );
};

function isKlassciRequest(request: HttpRequest<any>): boolean {
  return request.url.includes('/api/lms');
}

function addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({
    setHeaders: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // Headers pour CORS si nécessaire
      'X-Requested-With': 'XMLHttpRequest'
    }
  });
}

function handle401Error(request: HttpRequest<any>, next: any, router: Router): Observable<HttpEvent<any>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    // Rediriger vers la page de connexion
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: router.url }
    });

    // Nettoyer le token
    localStorage.removeItem('klassci_token');

    return throwError(() => new Error('Session expirée'));
  }

  // Si on est déjà en train de rafraîchir, attendre
  return refreshTokenSubject.pipe(
    filter(token => token !== null),
    take(1),
    switchMap((): Observable<HttpEvent<any>> => next(request)),
    finalize(() => {
      isRefreshing = false;
    })
  );
}