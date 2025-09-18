import { Injectable, inject } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { KlassciApiService } from '@core/services/klassci-api.service';
import { RoleService } from '@core/services/role.service';

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
    console.log('🔐 AuthGuard: Checking auth for URL:', url);

    // Vérification synchrone rapide
    const token = this.klassciApi.getAuthToken();
    if (!token) {
      console.log('❌ AuthGuard: No token found, redirecting to login');
      this.redirectToLogin(url);
      return false;
    }

    console.log('✅ AuthGuard: Token found, checking user state');

    // Vérification asynchrone de l'utilisateur
    return this.klassciApi.currentUser$.pipe(
      take(1),
      map(user => {
        if (user) {
          console.log('✅ AuthGuard: User authenticated:', {
            id: user.id,
            role: user.role,
            nom: user.nom
          });
          return true;
        } else {
          console.log('❌ AuthGuard: No user in state, redirecting to login');
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
  private roleService = inject(RoleService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const requiredRoles = route.data['roles'] as string[];

    console.log('🔑 RoleGuard: Checking roles for route:', {
      path: route.routeConfig?.path,
      requiredRoles
    });

    if (!requiredRoles || requiredRoles.length === 0) {
      console.log('✅ RoleGuard: No roles required, access granted');
      return true;
    }

    return this.klassciApi.currentUser$.pipe(
      take(1),
      map(user => {
        if (!user) {
          console.log('❌ RoleGuard: No user, redirecting to login');
          this.router.navigate(['/auth/login']);
          return false;
        }

        console.log('🔑 RoleGuard: Checking user role:', {
          userRole: user.role,
          requiredRoles
        });

        // Utiliser le service de rôles pour vérifier l'équivalence coordinateur/superAdmin
        const hasRole = this.roleService.hasAnyRole(user.role, requiredRoles);

        if (!hasRole) {
          console.log('❌ RoleGuard: Access denied, insufficient role permissions');
          this.router.navigate(['/access-denied']);
          return false;
        }

        console.log('✅ RoleGuard: Access granted for role:', user.role);
        return true;
      })
    );
  }
}