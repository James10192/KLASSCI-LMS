# Fix: Harmonisation accès matières LMS-KLASSCI

## Problème identifié

Discordance entre le dashboard KLASSCI (affichant 2 matières) et le dashboard LMS (affichant 0 matières) pour un utilisateur super_admin.

## Analyse des causes

### KLASSCI Dashboard (DashboardController.php:154)
```php
$data['totalMatieres'] = ESBTPMatiere::count(); // Approche administrative globale
```
- **Philosophie**: Vue d'ensemble administrative
- **Résultat**: Toutes les matières existantes (2 matières)

### LMS API (BaseApiController.php:176-199)
```php
$query = $this->applyRoleFilters($query, 'matieres'); // Filtrage par rôle
```
- **Philosophie**: Vue pédagogique contextuelle
- **Problème**: Seuls les 'coordinateur' avaient accès total
- **Résultat**: 0 matières pour super_admin (filtrage restrictif)

## Solution implémentée

### Modification BaseApiController.php ligne 185
**AVANT:**
```php
// Les coordinateurs ont accès à tout
if ($user->hasRole('coordinateur')) {
    return $query;
}
```

**APRÈS:**
```php
// Les coordinateurs et super_admin ont accès à tout
if ($user->hasRole(['coordinateur', 'super_admin'])) {
    return $query;
}
```

## Résultat attendu

- **Super_admin**: Accès complet à toutes les matières (comme dans KLASSCI)
- **Coordinateur**: Accès complet maintenu
- **Enseignant**: Accès limité à ses matières assignées
- **Étudiant**: Accès limité aux matières de sa classe

## Principe respecté

Le LMS utilise maintenant la même logique d'accès que KLASSCI pour les rôles administratifs, garantissant une cohérence parfaite entre les deux systèmes tout en préservant la sécurité pédagogique pour les autres rôles.