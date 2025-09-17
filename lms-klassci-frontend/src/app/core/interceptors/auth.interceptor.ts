import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { KlassciApiService } from '@core/services/klassci-api.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private router = inject(Router);
  private klassciApi = inject(KlassciApiService);

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Ajouter le token d'auth si disponible
    const authToken = this.klassciApi.getAuthToken();

    if (authToken && this.isKlassciRequest(request)) {
      request = this.addTokenToRequest(request, authToken);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Gestion des erreurs d'authentification
        if (error.status === 401 && this.isKlassciRequest(request)) {
          return this.handle401Error(request, next);
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
  }

  private isKlassciRequest(request: HttpRequest<any>): boolean {
    return request.url.includes('/api/lms');
  }

  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
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

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      // Rediriger vers la page de connexion
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: this.router.url }
      });

      // Nettoyer le token
      localStorage.removeItem('klassci_token');

      return throwError(() => new Error('Session expirée'));
    }

    // Si on est déjà en train de rafraîchir, attendre
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(() => next.handle(request)),
      finalize(() => {
        this.isRefreshing = false;
      })
    );
  }
}