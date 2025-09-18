import { Injectable } from '@angular/core';

/**
 * Service de gestion des rôles et permissions
 * Gère l'équivalence entre coordinateur et superAdmin
 */
@Injectable({
  providedIn: 'root'
})
export class RoleService {

  /**
   * Rôles considérés comme équivalents au coordinateur
   * coordinateur et superAdmin ont exactement les mêmes permissions
   */
  private readonly COORDINATOR_EQUIVALENT_ROLES = ['coordinateur', 'superAdmin'];

  /**
   * Rôles considérés comme des administrateurs
   * Inclut tous les rôles avec des privilèges d'administration
   */
  private readonly ADMIN_ROLES = ['coordinateur', 'superAdmin'];

  /**
   * Rôles considérés comme des enseignants
   */
  private readonly TEACHER_ROLES = ['enseignant'];

  /**
   * Rôles considérés comme des étudiants
   */
  private readonly STUDENT_ROLES = ['etudiant'];

  /**
   * Vérifie si un rôle est équivalent au coordinateur
   * @param role Le rôle à vérifier
   * @returns true si le rôle est équivalent au coordinateur
   */
  isCoordinatorEquivalent(role: string): boolean {
    return this.COORDINATOR_EQUIVALENT_ROLES.includes(role);
  }

  /**
   * Vérifie si un utilisateur a l'un des rôles requis
   * Traite automatiquement l'équivalence coordinateur/superAdmin
   * @param userRole Le rôle de l'utilisateur
   * @param requiredRoles Les rôles requis
   * @returns true si l'utilisateur a l'un des rôles requis
   */
  hasAnyRole(userRole: string, requiredRoles: string[]): boolean {
    // Si l'utilisateur a directement l'un des rôles requis
    if (requiredRoles.includes(userRole)) {
      return true;
    }

    // Si les rôles requis incluent coordinateur et que l'utilisateur est superAdmin
    if (requiredRoles.includes('coordinateur') && this.isCoordinatorEquivalent(userRole)) {
      return true;
    }

    // Si les rôles requis incluent superAdmin et que l'utilisateur est coordinateur
    if (requiredRoles.includes('superAdmin') && this.isCoordinatorEquivalent(userRole)) {
      return true;
    }

    return false;
  }

  /**
   * Normalise un rôle vers son équivalent standardisé
   * Convertit superAdmin vers coordinateur pour uniformiser
   * @param role Le rôle à normaliser
   * @returns Le rôle normalisé
   */
  normalizeRole(role: string): string {
    if (this.isCoordinatorEquivalent(role)) {
      return 'coordinateur'; // Normaliser vers coordinateur
    }
    return role;
  }

  /**
   * Vérifie si un rôle est un rôle d'administration
   * @param role Le rôle à vérifier
   * @returns true si c'est un rôle d'administration
   */
  isAdmin(role: string): boolean {
    return this.ADMIN_ROLES.includes(role);
  }

  /**
   * Vérifie si un rôle est un rôle d'enseignant
   * @param role Le rôle à vérifier
   * @returns true si c'est un rôle d'enseignant
   */
  isTeacher(role: string): boolean {
    return this.TEACHER_ROLES.includes(role);
  }

  /**
   * Vérifie si un rôle est un rôle d'étudiant
   * @param role Le rôle à vérifier
   * @returns true si c'est un rôle d'étudiant
   */
  isStudent(role: string): boolean {
    return this.STUDENT_ROLES.includes(role);
  }

  /**
   * Détermine la route de redirection par défaut après connexion
   * @param role Le rôle de l'utilisateur
   * @returns La route de redirection
   */
  getDefaultRedirectRoute(role: string): string {
    // Coordinateur et superAdmin -> même dashboard d'administration
    if (this.isCoordinatorEquivalent(role)) {
      return '/dashboard';
    }

    // Enseignant -> dashboard enseignant
    if (this.isTeacher(role)) {
      return '/dashboard';
    }

    // Étudiant -> dashboard étudiant
    if (this.isStudent(role)) {
      return '/dashboard';
    }

    // Par défaut
    return '/dashboard';
  }

  /**
   * Obtient le libellé d'affichage pour un rôle
   * @param role Le rôle
   * @returns Le libellé d'affichage
   */
  getRoleDisplayName(role: string): string {
    switch (role) {
      case 'coordinateur':
      case 'superAdmin':
        return 'Coordinateur/Administrateur';
      case 'enseignant':
        return 'Enseignant';
      case 'etudiant':
        return 'Étudiant';
      default:
        return role;
    }
  }

  /**
   * Obtient les permissions d'un rôle
   * @param role Le rôle
   * @returns La liste des permissions
   */
  getRolePermissions(role: string): string[] {
    if (this.isCoordinatorEquivalent(role)) {
      return [
        'view_all_courses',
        'manage_evaluations',
        'view_all_students',
        'manage_schedules',
        'admin_access',
        'generate_reports'
      ];
    }

    if (this.isTeacher(role)) {
      return [
        'view_own_courses',
        'manage_own_evaluations',
        'view_course_students',
        'record_attendance'
      ];
    }

    if (this.isStudent(role)) {
      return [
        'view_own_courses',
        'view_own_grades',
        'access_chat'
      ];
    }

    return [];
  }
}