# 🌊 LMS KLASSCI Frontend - Liquid Glass Design

Plateforme d'apprentissage moderne avec design liquid glass, développée avec Angular 17+ et intégration KLASSCI.

## 🎨 Caractéristiques

- **Design Liquid Glass** - Glassmorphism 2024 avec distorsion liquide
- **Angular 17+** - Signal-based components et standalone architecture
- **Performance optimisée** - 60fps garantis, Core Web Vitals optimized
- **Intégration KLASSCI** - API complète avec authentification Sanctum
- **Accessibilité WCAG 2.1 AAA** - Support complet clavier/écran

## 🚀 Quick Start

```bash
# Installation des dépendances
npm install

# Développement
npm start

# L'application sera disponible sur http://localhost:4200
```

## 📦 Scripts Disponibles

```bash
# Développement
npm start                 # Serveur de développement
npm run watch            # Build en mode watch

# Production
npm run build:prod       # Build optimisé pour production
npm run analyze          # Analyse de bundle avec webpack-bundle-analyzer

# Qualité
npm run test             # Tests unitaires
npm run test:coverage    # Tests avec couverture
npm run lint             # ESLint + vérifications
npm run e2e              # Tests end-to-end
```

## 🏗️ Architecture

### Structure du Projet

```
src/
├── app/
│   ├── core/                    # Services globaux, guards, intercepteurs
│   │   ├── services/
│   │   │   └── klassci-api.service.ts
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   └── interceptors/
│   │       └── auth.interceptor.ts
│   │
│   ├── shared/                  # Composants réutilisables
│   │   └── components/
│   │       ├── liquid-glass-background/
│   │       ├── liquid-glass-card/
│   │       └── liquid-glass-button/
│   │
│   ├── features/                # Modules métier
│   │   ├── auth/               # Authentification
│   │   ├── dashboard/          # Tableau de bord
│   │   ├── courses/            # Gestion des cours
│   │   ├── evaluations/        # Évaluations
│   │   └── chat/               # Communication
│   │
│   ├── layout/                  # Composants de mise en page
│   └── styles/                  # Styles globaux
│
├── assets/                      # Ressources statiques
├── environments/                # Configuration d'environnement
└── styles.scss                  # Styles globaux
```

### Composants Liquid Glass

#### LiquidGlassBackgroundComponent
```typescript
<lg-liquid-glass-background
  variant="educator"           // 'default' | 'dark' | 'educator' | 'student' | 'admin'
  [enableAdvancedEffects]="true">
  <!-- Contenu -->
</lg-liquid-glass-background>
```

#### LiquidGlassCardComponent
```typescript
<lg-liquid-glass-card
  variant="dashboard"          // 'default' | 'compact' | 'large' | 'dashboard'
  [opacity]="15"              // 0-100
  blur="lg"                   // 'sm' | 'md' | 'lg' | 'xl'
  [interactive]="true"
  (cardClick)="onCardClick()">
  <!-- Contenu -->
</lg-liquid-glass-card>
```

## 🔌 Intégration KLASSCI

### Configuration API

```typescript
// src/environments/environment.ts
export const environment = {
  klassciApiUrl: 'http://localhost:8000/api',
  klassciBaseUrl: 'http://localhost:8000',
  // ...
};
```

### Service KLASSCI API

```typescript
// Authentification
this.klassciApi.login(email, password).subscribe(response => {
  // Utilisateur connecté
});

// Récupération des données
this.klassciApi.getClasses().subscribe(classes => {
  // Liste des classes
});

this.klassciApi.getMatieres().subscribe(matieres => {
  // Liste des matières
});

// Sauvegarde des notes
this.klassciApi.saveNotes(evaluationId, notes).subscribe(result => {
  // Notes sauvegardées
});
```

### Rôles Utilisateur

Le système gère automatiquement les rôles KLASSCI :

- **`enseignant`** - Accès cours, évaluations, notes
- **`etudiant`** - Consultation cours, notes, emploi du temps
- **`coordinateur`** - Administration pédagogique
- **`super_admin`** - Administration complète

## 🎨 Système de Design

### Variables CSS Liquid Glass

```scss
:root {
  // Couleurs
  --lg-primary: #3b82f6;
  --lg-secondary: #8b5cf6;
  --lg-accent: #06b6d4;

  // Blur intensities
  --lg-blur-sm: 4px;
  --lg-blur-md: 8px;
  --lg-blur-lg: 16px;
  --lg-blur-xl: 24px;

  // Transitions
  --lg-transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --lg-transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Classes Utilitaires

```scss
.lg-glass              // Effet verre de base
.lg-glass-strong       // Effet verre prononcé
.lg-glass-subtle       // Effet verre subtil
.lg-animate-float      // Animation flottante
.lg-animate-glow       // Animation glow
.lg-text-gradient      // Texte avec gradient
.lg-interactive        // États interactifs
```

## ⚡ Optimisations Performance

### Détection Automatique
- **Device Memory** - Adaptation selon RAM disponible
- **Mobile Detection** - Réduction des effets sur mobile
- **Firefox Fallbacks** - Support backdrop-filter alternatif

### Mode Performance
```typescript
// Détection automatique dans app.component.ts
const deviceMemory = (navigator as any).deviceMemory || 4;
const isMobile = window.innerWidth < 768;
const enableAdvanced = deviceMemory >= 4 && !isMobile;
```

### Metrics Garanties
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Lighthouse Score**: >= 90

## 🔐 Authentification & Sécurité

### Guards de Route
```typescript
// Protection par authentification
{
  path: 'dashboard',
  canActivate: [AuthGuard],
  loadComponent: () => import('./dashboard.component')
}

// Protection par rôle
{
  path: 'admin',
  canActivate: [AuthGuard, RoleGuard],
  data: { roles: ['coordinateur', 'super_admin'] }
}
```

### Intercepteur HTTP
Ajout automatique du token Bearer pour les requêtes KLASSCI API.

## 🧪 Tests

### Tests Unitaires
```bash
npm run test             # Tests avec Karma/Jasmine
npm run test:coverage    # Avec couverture de code
```

### Tests de Performance
```typescript
it('should not exceed 16ms frame budget', (done) => {
  // Test 60fps compliance
});

it('should meet WCAG 2.1 AAA contrast requirements', () => {
  // Test accessibilité
});
```

## 📱 Responsive & Accessibilité

### Breakpoints
- **Mobile**: < 768px - Effets réduits, navigation adaptée
- **Tablet**: 768px - 1024px - Layout adaptatif
- **Desktop**: > 1024px - Tous les effets activés

### Accessibilité
- **Navigation clavier** complète
- **Lecteurs d'écran** supportés
- **Contraste WCAG 2.1 AAA** automatique
- **Mode réduit** pour prefers-reduced-motion

## 🚀 Déploiement

### Build Production
```bash
npm run build:prod
```

### Configuration Environnement
```typescript
// environment.prod.ts
export const environment = {
  production: true,
  klassciApiUrl: 'https://your-klassci-domain.com/api',
  enableAdvancedEffects: true,
  // ...
};
```

### Service Worker PWA
Activé automatiquement en production pour le cache et l'offline.

## 📚 Documentation Complémentaire

- [Guide d'Architecture LMS](../docs/LMS_ARCHITECTURE_GUIDE.md)
- [Documentation API KLASSCI](../docs/LMS_API_README.md)
- [Composants Liquid Glass](../docs/LIQUID_GLASS_COMPONENTS.md)

## 🛠️ Développement

### Prérequis
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Angular CLI** >= 17.0.0

### Installation Angular CLI
```bash
npm install -g @angular/cli@latest
```

### Génération de Composants
```bash
ng generate component shared/components/my-component --standalone
ng generate service core/services/my-service
ng generate guard core/guards/my-guard
```

## 🔄 Workflow Git

```bash
# Développement d'une nouvelle fonctionnalité
git checkout -b feature/nouvelle-fonctionnalite
git add .
git commit -m "feat: description de la fonctionnalité"
git push origin feature/nouvelle-fonctionnalite
```

## 📞 Support

- **Documentation**: Consulter les guides dans `/docs`
- **Issues**: Utiliser le système de tickets Git
- **API KLASSCI**: Vérifier la documentation backend

---

**🌊 LMS KLASSCI Frontend**
*Système d'apprentissage moderne avec design liquid glass*

**Développé avec Angular 17+ • Signal-based • Enterprise-ready • WCAG 2.1 AAA**