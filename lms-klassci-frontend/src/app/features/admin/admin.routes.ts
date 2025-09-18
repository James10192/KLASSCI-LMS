import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'students',
    loadComponent: () => import('./students-management/students-management.component').then(m => m.StudentsManagementComponent)
  },
  {
    path: 'teachers',
    loadComponent: () => import('./teachers-management/teachers-management.component').then(m => m.TeachersManagementComponent)
  },
  {
    path: 'classes',
    loadComponent: () => import('./classes-management/classes-management.component').then(m => m.ClassesManagementComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./system-settings/system-settings.component').then(m => m.SystemSettingsComponent)
  }
];