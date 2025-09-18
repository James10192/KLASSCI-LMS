import { Routes } from '@angular/router';

export const chatRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./chat-main/chat-main.component').then(m => m.ChatMainComponent)
  },
  {
    path: 'conversation/:id',
    loadComponent: () => import('./conversation/conversation.component').then(m => m.ConversationComponent)
  }
];