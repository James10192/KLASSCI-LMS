import { Routes } from '@angular/router';
import { AuthGuard, RoleGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  // Redirection par défaut
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // Routes d'authentification (non protégées)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },

  // Dashboard principal (protégé)
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.dashboardRoutes)
  },

  // Gestion des cours (enseignants et étudiants)
  {
    path: 'courses',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/courses/courses.routes').then(m => m.coursesRoutes)
  },

  // Évaluations (enseignants principalement)
  {
    path: 'evaluations',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['enseignant', 'coordinateur'] },
    loadChildren: () => import('./features/evaluations/evaluations.routes').then(m => m.evaluationsRoutes)
  },

  // Chat et communication
  {
    path: 'chat',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/chat/chat.routes').then(m => m.chatRoutes)
  },

  // Profil utilisateur
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
  },

  // Administration (coordinateurs et admins)
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['coordinateur', 'super_admin'] },
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes)
  },

  // Pages d'erreur
  {
    path: 'access-denied',
    loadComponent: () => import('./shared/components/access-denied/access-denied.component').then(m => m.AccessDeniedComponent)
  },

  {
    path: 'not-found',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent)
  },

  // Route wildcard (doit être en dernier)
  {
    path: '**',
    redirectTo: '/not-found'
  }
];