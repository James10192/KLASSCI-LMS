import { Injectable, inject } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { KlassciApiService } from '@core/services/klassci-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  private klassciApi = inject(KlassciApiService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.checkAuthStatus(state.url);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.canActivate(route, state);
  }

  private checkAuthStatus(url: string): Observable<boolean> | boolean {
    // Vérification synchrone rapide
    if (!this.klassciApi.getAuthToken()) {
      this.redirectToLogin(url);
      return false;
    }

    // Vérification asynchrone de l'utilisateur
    return this.klassciApi.currentUser$.pipe(
      take(1),
      map(user => {
        if (user) {
          return true;
        } else {
          this.redirectToLogin(url);
          return false;
        }
      })
    );
  }

  private redirectToLogin(returnUrl: string): void {
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl }
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  private klassciApi = inject(KlassciApiService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const requiredRoles = route.data['roles'] as string[];

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    return this.klassciApi.currentUser$.pipe(
      take(1),
      map(user => {
        if (!user) {
          this.router.navigate(['/auth/login']);
          return false;
        }

        const hasRole = requiredRoles.includes(user.role);
        if (!hasRole) {
          this.router.navigate(['/access-denied']);
          return false;
        }

        return true;
      })
    );
  }
}