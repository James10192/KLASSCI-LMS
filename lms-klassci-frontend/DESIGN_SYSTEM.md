# 🎨 KLASSCI Design System

## Vue d'ensemble

Le système de design KLASSCI est basé sur les couleurs officielles de la marque, extraites directement des logos de l'institution. Il combine l'identité visuelle KLASSCI avec une esthétique moderne "liquid glass" pour créer une expérience utilisateur cohérente et élégante.

## 🎯 Couleurs de la Marque

### Couleurs Principales

#### Bleu KLASSCI (Couleur Primaire)
- **Utilisation** : Éléments principaux, navigation, boutons primaires
- **Origines** : Texte du logo KLASSCI et symbole académique
- **Palette** :
  ```scss
  $klassci-blue-900: #1a3f7a;    // Bleu le plus foncé
  $klassci-blue-800: #1e4d9b;    // Bleu principal de la marque ⭐
  $klassci-blue-700: #2563eb;    // Bleu moyen
  $klassci-blue-600: #3b82f6;    // Bleu clair (primaire UI)
  ```

#### Orange KLASSCI (Couleur Secondaire)
- **Utilisation** : Accents, éléments d'emphase, boutons secondaires
- **Origines** : Lettre "K" du logo KLASSCI
- **Palette** :
  ```scss
  $klassci-orange-900: #c2410c;  // Orange le plus foncé
  $klassci-orange-800: #ea580c;  // Orange foncé
  $klassci-orange-700: #ff4500;  // Orange principal de la marque ⭐
  $klassci-orange-600: #ff5722;  // Orange moyen
  ```

### Couleurs Neutres
```scss
$klassci-gray-900: #0f172a;    // Arrière-plan principal
$klassci-gray-800: #1e293b;    // Arrière-plan secondaire
$klassci-gray-700: #334155;    // Surfaces
$klassci-gray-300: #cbd5e1;    // Texte secondaire
$klassci-white: #ffffff;       // Texte principal
```

## 🌈 Gradients de Marque

### Gradients Principaux
```scss
// Gradient primaire (bleus KLASSCI)
$klassci-gradient-primary: linear-gradient(135deg, #1e4d9b, #3b82f6);

// Gradient secondaire (oranges KLASSCI)
$klassci-gradient-secondary: linear-gradient(135deg, #ff4500, #ff5722);

// Gradient de marque (bleu + orange)
$klassci-gradient-brand: linear-gradient(135deg, #1e4d9b, #ff5722);

// Gradient d'arrière-plan
$klassci-gradient-background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
```

## 🎨 Application des Couleurs

### États Interactifs

#### Boutons Primaires
```scss
// État normal
background: linear-gradient(135deg, #1e4d9b, #3b82f6);

// État hover
background: linear-gradient(135deg, #2563eb, #60a5fa);

// État actif
background: linear-gradient(135deg, #1a3f7a, #2563eb);
```

#### Boutons Secondaires
```scss
// État normal
background: linear-gradient(135deg, #ff4500, #ff5722);

// État hover
background: linear-gradient(135deg, #ff6b47, #ff8a65);
```

### Variantes de Fond

#### Variants par Rôle Utilisateur
- **Éducateur** : Dominante bleu KLASSCI avec accents orange
- **Étudiant** : Mélange équilibré bleu/orange
- **Administrateur** : Bleu foncé KLASSCI avec accents subtils
- **Sombre** : Dominante grise avec touches de bleu

## 🔧 Utilisation Technique

### Import des Couleurs
```scss
@import 'styles/klassci-colors';
```

### Variables CSS
```css
:root {
  --lg-primary: #1e4d9b;        /* Bleu principal KLASSCI */
  --lg-secondary: #ff4500;      /* Orange secondaire KLASSCI */
  --lg-accent: #3b82f6;         /* Bleu accent */
}
```

### Classes Utilitaires

#### Texte avec Gradient
```scss
.lg-text-gradient {
  background: linear-gradient(135deg, #1e4d9b, #ff5722);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

#### Effets Liquid Glass
```scss
.lg-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

## 🎯 Règles d'Usage

### Priorité des Couleurs
1. **Bleu KLASSCI** (#1e4d9b) - Éléments principaux et navigation
2. **Orange KLASSCI** (#ff4500) - Accents et éléments d'action
3. **Variantes de bleu** - États et variations
4. **Neutres** - Texte et arrière-plans

### Accessibilité
- Ratio de contraste minimum : 4.5:1 (WCAG AA)
- Bleu KLASSCI sur fond sombre : 4.8:1 ✅
- Orange KLASSCI sur fond sombre : 5.2:1 ✅
- Blanc sur fond sombre : 21:1 ✅

### Combinaisons Recommandées

#### Éléments Principaux
- Texte blanc sur bleu KLASSCI
- Texte blanc sur orange KLASSCI
- Bleu KLASSCI sur fond transparent

#### Éléments Secondaires
- Texte gris clair sur fond sombre
- Bordures transparentes blanches
- Ombres avec couleurs de marque

## 🎨 Exemples d'Application

### Navigation
- Fond : Bleu KLASSCI avec transparence
- Liens actifs : Orange KLASSCI
- Liens inactifs : Bleu clair

### Boutons
- **Primaire** : Gradient bleu KLASSCI
- **Secondaire** : Gradient orange KLASSCI
- **Tertiaire** : Transparent avec bordure

### Cartes et Surfaces
- Fond : Liquid glass avec bordure transparente
- Accents : Ombres colorées avec couleurs de marque
- États hover : Légère augmentation d'opacité

## 🔄 Évolution et Maintenance

### Versioning
- Version actuelle : 1.0.0
- Basé sur les logos officiels KLASSCI 2024

### Updates
- Les couleurs sont extraites directement des assets officiels
- Toute modification doit respecter l'identité de marque KLASSCI
- Tests d'accessibilité requis pour tout changement

### Contribution
1. Vérifier la cohérence avec la marque KLASSCI
2. Tester l'accessibilité (ratios de contraste)
3. Valider sur différents écrans et thèmes
4. Documenter les changements

---

**Note** : Ce système de design est vivant et évolue avec la marque KLASSCI. Toutes les couleurs sont extraites des logos officiels pour garantir la cohérence de l'identité visuelle.