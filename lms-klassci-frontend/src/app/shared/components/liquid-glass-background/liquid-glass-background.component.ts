import { Component, Input, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FloatingOrb {
  id: string;
  delay: number;
  size: string;
  color: string;
  position: { x: number; y: number };
  animationDuration: number;
}

@Component({
  selector: 'lg-liquid-glass-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="liquid-glass-background"
      [class]="backgroundClasses()"
      [attr.data-variant]="variant()"
      [attr.data-performance-mode]="enableAdvancedEffects() ? 'high' : 'low'"
    >
      <!-- Liquid distortion layer (true liquid glass effect) -->
      <div
        class="distortion-layer"
        [style.filter]="distortionFilter()"
        *ngIf="enableAdvancedEffects()">
        <div class="distortion-mesh"></div>
      </div>

      <!-- Floating orbs with GPU acceleration -->
      <div class="orbs-container" role="presentation" aria-hidden="true">
        @for (orb of orbs(); track orb.id) {
          <div
            class="floating-orb"
            [style.--delay]="orb.delay + 's'"
            [style.--size]="orb.size"
            [style.--color]="orb.color"
            [style.--x]="orb.position.x + '%'"
            [style.--y]="orb.position.y + '%'"
            [style.--duration]="orb.animationDuration + 's'">
          </div>
        }
      </div>

      <!-- Gradient overlay -->
      <div class="gradient-overlay" [class]="gradientClasses()"></div>

      <!-- Content projection -->
      <div class="content-wrapper" [attr.data-blur-mode]="blurMode()">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrl: './liquid-glass-background.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LiquidGlassBackgroundComponent implements OnInit {
  @Input() variant = signal<'default' | 'dark' | 'educator' | 'student' | 'admin'>('default');
  @Input() enableAdvancedEffects = signal(true);
  @Input() blurMode = signal<'backdrop' | 'fallback'>('backdrop');

  orbs = signal<FloatingOrb[]>([]);
  distortionFilter = signal('');

  // Computed properties pour optimisation
  backgroundClasses = computed(() => {
    const variant = this.variant();
    const effects = this.enableAdvancedEffects() ? 'advanced' : 'basic';
    return `variant-${variant} effects-${effects}`;
  });

  gradientClasses = computed(() => {
    switch (this.variant()) {
      case 'educator':
        return 'gradient-educator';
      case 'student':
        return 'gradient-student';
      case 'admin':
        return 'gradient-admin';
      case 'dark':
        return 'gradient-dark';
      default:
        return 'gradient-default';
    }
  });

  ngOnInit() {
    this.generateOrbs();
    this.setupLiquidDistortion();
    this.detectBrowserSupport();
    this.adaptToPerformance();
  }

  private generateOrbs() {
    const colors = ['#3b82f6', '#6366f1', '#8b5cf6', '#06b6d4'];
    const sizes = ['w-32 h-32', 'w-48 h-48', 'w-64 h-64', 'w-80 h-80'];

    const orbsData: FloatingOrb[] = Array.from({ length: 5 }, (_, i) => ({
      id: `orb-${i}`,
      delay: i * 0.8,
      size: sizes[Math.floor(Math.random() * sizes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      position: {
        x: Math.random() * 100,
        y: Math.random() * 100
      },
      animationDuration: 6 + Math.random() * 4
    }));

    this.orbs.set(orbsData);
  }

  private setupLiquidDistortion() {
    if (this.enableAdvancedEffects()) {
      // Configuration pour effet liquid glass avancé
      this.distortionFilter.set('blur(1px) contrast(1.1) brightness(1.1)');
    }
  }

  private detectBrowserSupport() {
    // Détection Firefox pour fallback
    const isFirefox = navigator.userAgent.includes('Firefox');
    if (isFirefox) {
      this.blurMode.set('fallback');
    }

    // Test support backdrop-filter
    const testEl = document.createElement('div');
    testEl.style.backdropFilter = 'blur(1px)';
    if (!testEl.style.backdropFilter) {
      this.blurMode.set('fallback');
    }
  }

  private adaptToPerformance() {
    // Détection device memory et mobile
    const deviceMemory = (navigator as any).deviceMemory || 4;
    const isMobile = window.innerWidth < 768;
    const isLowPower = deviceMemory < 4 || isMobile;

    if (isLowPower) {
      this.enableAdvancedEffects.set(false);
    }
  }
}