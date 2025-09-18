import { Routes } from '@angular/router';

export const coursesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./courses-list/courses-list.component').then(m => m.CoursesListComponent)
  },
  {
    path: 'attendance',
    loadComponent: () => import('./attendance/attendance.component').then(m => m.AttendanceComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./course-detail/course-detail.component').then(m => m.CourseDetailComponent)
  }
];