import { Component, Input, signal, computed, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'lg-liquid-glass-card',
  standalone: true,
  imports: [CommonModule, MatRippleModule, MatProgressSpinnerModule],
  template: `
    <div
      class="liquid-glass-card"
      [class]="cardClasses()"
      [style.--blur-intensity]="blurIntensity()"
      [style.--opacity-level]="opacityLevel()"
      [attr.data-variant]="variant()"
      [attr.role]="interactive() ? 'button' : 'region'"
      [attr.tabindex]="interactive() ? '0' : null"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-disabled]="loading()"
      matRipple
      [matRippleDisabled]="!interactive() || loading()"
      [matRippleColor]="rippleColor()"
    >
      <!-- True liquid glass layer -->
      <div class="glass-layer">
        <div class="backdrop-blur" [class]="blurClasses()"></div>
        <div class="liquid-distortion" *ngIf="enableLiquidEffect() && !loading()"></div>
      </div>

      <!-- Border glass effect -->
      <div class="border-glass" [class]="borderClasses()"></div>

      <!-- Content with proper contrast -->
      <div class="card-content" [class]="contentClasses()">
        <ng-content></ng-content>
      </div>

      <!-- Loading state -->
      <div class="loading-overlay" *ngIf="loading()" role="status" aria-label="Chargement">
        <mat-spinner diameter="24" color="accent"></mat-spinner>
        <span class="loading-text">Chargement...</span>
      </div>

      <!-- Hover effect indicator -->
      <div class="hover-indicator" *ngIf="interactive() && !loading()"></div>
    </div>
  `,
  styleUrl: './liquid-glass-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.interactive]': 'interactive()',
    '[class.loading]': 'loading()',
    '[class.disabled]': 'disabled()',
    '(click)': 'onCardClick()',
    '(keydown.enter)': 'onCardClick()',
    '(keydown.space)': 'onCardClick($event)'
  }
})
export class LiquidGlassCardComponent {
  @Input() variant = signal<'default' | 'compact' | 'large' | 'dashboard' | 'course' | 'evaluation'>('default');
  @Input() blur = signal<'sm' | 'md' | 'lg' | 'xl'>('md');
  @Input() opacity = signal(10); // 0-100
  @Input() interactive = signal(false);
  @Input() loading = signal(false);
  @Input() disabled = signal(false);
  @Input() enableLiquidEffect = signal(true);
  @Input() ariaLabel = signal('');
  @Input() elevation = signal<'low' | 'medium' | 'high'>('medium');

  @Output() cardClick = new EventEmitter<void>();

  // Computed properties pour optimisation performance
  blurIntensity = computed(() => {
    const intensities = { sm: '4px', md: '8px', lg: '16px', xl: '24px' };
    return intensities[this.blur()];
  });

  opacityLevel = computed(() => this.opacity() / 100);

  cardClasses = computed(() => {
    const classes = [
      `variant-${this.variant()}`,
      `blur-${this.blur()}`,
      `elevation-${this.elevation()}`
    ];

    if (this.interactive()) classes.push('interactive');
    if (this.loading()) classes.push('loading');
    if (this.disabled()) classes.push('disabled');

    return classes.join(' ');
  });

  blurClasses = computed(() => {
    // Support fallback Firefox
    const isFirefox = navigator.userAgent.includes('Firefox');
    return isFirefox ? 'fallback-blur' : 'backdrop-blur-support';
  });

  borderClasses = computed(() => {
    switch (this.variant()) {
      case 'dashboard':
        return 'border-dashboard';
      case 'course':
        return 'border-course';
      case 'evaluation':
        return 'border-evaluation';
      default:
        return 'border-default';
    }
  });

  contentClasses = computed(() => {
    const opacity = this.opacity();
    return `contrast-${opacity > 50 ? 'high' : 'low'}`;
  });

  rippleColor = computed(() => {
    switch (this.variant()) {
      case 'dashboard':
        return 'rgba(59, 130, 246, 0.3)';
      case 'course':
        return 'rgba(34, 197, 94, 0.3)';
      case 'evaluation':
        return 'rgba(239, 68, 68, 0.3)';
      default:
        return 'rgba(148, 163, 184, 0.3)';
    }
  });

  onCardClick(event?: KeyboardEvent) {
    // Prévenir activation multiple
    if (this.loading() || this.disabled()) {
      return;
    }

    // Prévenir scroll sur espace
    if (event?.code === 'Space') {
      event.preventDefault();
    }

    if (this.interactive()) {
      this.cardClick.emit();
    }
  }
}