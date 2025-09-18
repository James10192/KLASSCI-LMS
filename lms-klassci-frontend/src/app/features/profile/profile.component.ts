import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lg-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <div class="content">
        <h1>Profil utilisateur</h1>
        <p>Cette fonctionnalité sera bientôt disponible.</p>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 2rem;
      color: white;
    }
  `]
})
export class ProfileComponent {}