import { Routes } from '@angular/router';

export const evaluationsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./evaluations-list/evaluations-list.component').then(m => m.EvaluationsListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./evaluation-form/evaluation-form.component').then(m => m.EvaluationFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./evaluation-detail/evaluation-detail.component').then(m => m.EvaluationDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./evaluation-form/evaluation-form.component').then(m => m.EvaluationFormComponent)
  }
];