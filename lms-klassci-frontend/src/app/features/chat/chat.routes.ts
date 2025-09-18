import { Routes } from '@angular/router';

export const chatRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./forum-main/forum-main.component').then(m => m.ForumMainComponent)
  },
  {
    path: 'general',
    loadComponent: () => import('./forum-general/forum-general.component').then(m => m.ForumGeneralComponent)
  },
  {
    path: 'course/:courseId',
    loadComponent: () => import('./forum-course/forum-course.component').then(m => m.ForumCourseComponent)
  },
  {
    path: 'topic/:topicId',
    loadComponent: () => import('./forum-topic/forum-topic.component').then(m => m.ForumTopicComponent)
  }
];