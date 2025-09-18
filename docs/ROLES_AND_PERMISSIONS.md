# 👥 Système de Rôles et Permissions LMS KLASSCI

## Vue d'ensemble

Le LMS KLASSCI implémente un système de rôles unifié qui garantit une expérience utilisateur cohérente entre les différents types d'utilisateurs. Le principe clé est l'**équivalence stricte** entre les rôles `coordinateur` et `superAdmin`.

## 🎯 Équivalence des Rôles

### Coordinateur ≡ SuperAdmin

Les rôles `coordinateur` et `superAdmin` sont **strictement équivalents** dans le système :

| Aspect | Coordinateur | SuperAdmin | Équivalence |
|--------|--------------|------------|-------------|
| **Permissions** | Accès complet admin | Accès complet admin | ✅ **Identique** |
| **Dashboard** | Interface admin | Interface admin | ✅ **Identique** |
| **Navigation** | Menus complets | Menus complets | ✅ **Identique** |
| **API Access** | Toutes les routes | Toutes les routes | ✅ **Identique** |
| **Redirection** | `/dashboard` | `/dashboard` | ✅ **Identique** |

### Justification de l'Équivalence

1. **Historique** : Dans KLASSCI, certains utilisateurs ont le rôle `coordinateur`, d'autres `superAdmin`
2. **Fonctionnel** : Dans le contexte LMS, ces deux rôles ont exactement les mêmes besoins
3. **Simplification** : Évite la duplication de code et d'interfaces
4. **Maintenance** : Un seul système de permissions à maintenir

## 📋 Permissions Détaillées

### Coordinateur/SuperAdmin
- ✅ **Gestion complète des évaluations** : Créer, modifier, supprimer toutes les évaluations
- ✅ **Visualisation globale** : Accès à tous les cours, classes, étudiants
- ✅ **Administration** : Gestion des utilisateurs et paramètres système
- ✅ **Rapports** : Génération de tous types de rapports
- ✅ **Emplois du temps** : Modification et supervision complète
- ✅ **Statistiques** : Accès aux tableaux de bord analytiques

### Enseignant
- ✅ **Gestion de ses cours** : Voir et modifier ses propres cours
- ✅ **Évaluations personnelles** : Créer des évaluations pour ses matières
- ✅ **Étudiants de ses cours** : Accès aux listes d'étudiants
- ✅ **Présences** : Enregistrer les présences pour ses cours
- ✅ **Rapports de cours** : Générer des rapports sur ses cours
- ❌ Accès administratif global

### Étudiant
- ✅ **Ses cours** : Voir ses cours et emploi du temps
- ✅ **Ses notes** : Consulter ses évaluations et résultats
- ✅ **Communication** : Accès au système de chat
- ✅ **Profil** : Gérer ses informations personnelles
- ❌ Voir les données d'autres étudiants
- ❌ Fonctions administratives

## 🔧 Implémentation Technique

### Frontend Angular

#### Service de Gestion des Rôles

```typescript
// src/app/core/services/role.service.ts
@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly COORDINATOR_EQUIVALENT_ROLES = ['coordinateur', 'superAdmin'];

  isCoordinatorEquivalent(role: string): boolean {
    return this.COORDINATOR_EQUIVALENT_ROLES.includes(role);
  }

  hasAnyRole(userRole: string, requiredRoles: string[]): boolean {
    if (requiredRoles.includes(userRole)) return true;

    // Gestion automatique de l'équivalence
    if (requiredRoles.includes('coordinateur') && this.isCoordinatorEquivalent(userRole)) {
      return true;
    }

    return false;
  }

  getDefaultRedirectRoute(role: string): string {
    if (this.isCoordinatorEquivalent(role)) return '/dashboard';
    return '/dashboard'; // Tous vers le même dashboard pour l'instant
  }
}
```

#### Guard avec Équivalence

```typescript
// src/app/core/guards/auth.guard.ts
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const requiredRoles = route.data['roles'] as string[];

    return this.klassciApi.currentUser$.pipe(
      map(user => {
        if (!user) return false;

        // Utilise le service pour vérifier l'équivalence
        return this.roleService.hasAnyRole(user.role, requiredRoles);
      })
    );
  }
}
```

#### Configuration des Routes

```typescript
// src/app/app.routes.ts
{
  path: 'admin',
  canActivate: [AuthGuard, RoleGuard],
  data: { roles: ['coordinateur', 'superAdmin'] }, // Les deux sont acceptés
  loadChildren: () => import('./features/admin/admin.routes')
}
```

### Backend Laravel

#### Helper de Gestion des Rôles

```php
// app/Helpers/RoleHelper.php
class RoleHelper
{
    const COORDINATOR_EQUIVALENT_ROLES = ['coordinateur', 'superAdmin'];

    public static function isCoordinatorEquivalent(string $role): bool
    {
        return in_array($role, self::COORDINATOR_EQUIVALENT_ROLES);
    }

    public static function hasAnyRole(string $userRole, array $requiredRoles): bool
    {
        if (in_array($userRole, $requiredRoles)) return true;

        // Équivalence automatique
        if (in_array('coordinateur', $requiredRoles) &&
            self::isCoordinatorEquivalent($userRole)) {
            return true;
        }

        return false;
    }

    public static function getRolePermissions(string $role): array
    {
        if (self::isCoordinatorEquivalent($role)) {
            return [
                'view_all_courses',
                'manage_evaluations',
                'view_all_students',
                'manage_schedules',
                'admin_access',
                'generate_reports',
                'manage_users',
                'view_statistics'
            ];
        }
        // ... autres rôles
    }
}
```

#### AuthController avec Équivalence

```php
// app/Http/Controllers/API/AuthController.php
public function login(Request $request): JsonResponse
{
    // ... validation et authentification

    $userRole = $user->getRoleNames()->first();
    $userData = [
        'role' => $userRole,
        'role_display_name' => RoleHelper::getRoleDisplayName($userRole),
        'permissions' => RoleHelper::getRolePermissions($userRole),
        'is_admin' => RoleHelper::isAdmin($userRole),
        'is_coordinator_equivalent' => RoleHelper::isCoordinatorEquivalent($userRole),
        // ... autres données
    ];

    if (RoleHelper::isCoordinatorEquivalent($userRole)) {
        $userData['admin_data'] = $this->getAdminData($user);
    }

    return $this->successResponse(['user' => $userData]);
}
```

## 🚀 Avantages de cette Approche

### 1. **Simplicité de Développement**
- Un seul dashboard administrateur à maintenir
- Code unifié pour les permissions
- Logique centralisée dans les services

### 2. **Expérience Utilisateur Cohérente**
- Même interface pour tous les administrateurs
- Navigation prévisible
- Pas de confusion sur les fonctionnalités disponibles

### 3. **Maintenance Facilitée**
- Moins de duplication de code
- Modifications centralisées
- Tests simplifiés

### 4. **Sécurité Renforcée**
- Permissions centralisées
- Moins de risques d'incohérences
- Contrôle unifié des accès

### 5. **Évolutivité**
- Facile d'ajouter de nouveaux rôles équivalents
- Architecture extensible
- Modification des permissions centralisée

## 🔍 Tests de Validation

### Tests Frontend
```typescript
describe('RoleService', () => {
  it('should treat coordinateur and superAdmin as equivalent', () => {
    expect(roleService.isCoordinatorEquivalent('coordinateur')).toBe(true);
    expect(roleService.isCoordinatorEquivalent('superAdmin')).toBe(true);
    expect(roleService.isCoordinatorEquivalent('enseignant')).toBe(false);
  });

  it('should allow both roles for coordinator routes', () => {
    expect(roleService.hasAnyRole('superAdmin', ['coordinateur'])).toBe(true);
    expect(roleService.hasAnyRole('coordinateur', ['superAdmin'])).toBe(true);
  });
});
```

### Tests Backend
```php
public function test_role_equivalence()
{
    $this->assertTrue(RoleHelper::isCoordinatorEquivalent('coordinateur'));
    $this->assertTrue(RoleHelper::isCoordinatorEquivalent('superAdmin'));
    $this->assertFalse(RoleHelper::isCoordinatorEquivalent('enseignant'));

    $this->assertTrue(RoleHelper::hasAnyRole('superAdmin', ['coordinateur']));
    $this->assertTrue(RoleHelper::hasAnyRole('coordinateur', ['superAdmin']));
}
```

## 📝 Migration et Compatibilité

### Données Existantes
- ✅ **Aucune migration de données requise**
- ✅ **Compatibilité totale avec KLASSCI existant**
- ✅ **Les utilisateurs gardent leurs rôles actuels**
- ✅ **Fonctionnement transparent**

### Retrocompatibilité
- ✅ **APIs existantes fonctionnent sans modification**
- ✅ **Rôles existants respectés**
- ✅ **Ajout transparent de l'équivalence**

## 🎯 Recommandations

### Pour les Développeurs
1. **Toujours utiliser** `RoleService.hasAnyRole()` pour les vérifications
2. **Ne jamais** faire de comparaisons directes de rôles
3. **Utiliser** les helpers fournis pour les permissions
4. **Tester** avec les deux types de rôles équivalents

### Pour les Administrateurs
1. **Comprendre** que coordinateur = superAdmin dans le LMS
2. **Former** les utilisateurs sur cette équivalence
3. **Documenter** cette particularité dans les guides utilisateur

---

**Note importante** : Cette équivalence est spécifique au contexte LMS. Dans d'autres modules KLASSCI, les rôles peuvent avoir des significations différentes.