import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { map, catchError, tap, retry, shareReplay } from 'rxjs/operators';
import { environment } from '@environments/environment';

// Interfaces KLASSCI
export interface KlassciUser {
  id: number;
  nom: string;
  email: string;
  role: 'enseignant' | 'etudiant' | 'coordinateur' | 'secretaire' | 'super_admin';
  is_enseignant?: boolean;
  enseignant_data?: {
    nb_matieres: number;
    nb_classes: number;
    matieres_principales: string[];
  };
}

export interface KlassciAuthResponse {
  success: boolean;
  data: {
    token: string;
    token_type: string;
    user: KlassciUser;
  };
  meta: {
    annee_universitaire_courante: {
      id: number;
      nom: string;
    };
  };
}

export interface KlassciClasse {
  id: number;
  name: string;
  libelle: string;
  filiere_id: number;
  niveau_etude_id: number;
  places_totales: number;
  places_occupees: number;
  is_active: boolean;
  filiere?: {
    id: number;
    name: string;
    libelle: string;
    code: string;
  };
  niveau?: {
    id: number;
    name: string;
    libelle: string;
    code: string;
    type: string;
    year: number;
  };
}

export interface KlassciEtudiant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  matricule: string;
  date_naissance: string;
  photo_url?: string;
}

export interface KlassciMatiere {
  id: number;
  nom: string;
  code: string;
  coefficient: number;
  credit: number;
  is_active: boolean;
}

export interface KlassciNote {
  etudiant_id: number;
  note: number;
  is_absent: boolean;
  commentaire?: string;
}

export interface KlassciEvaluation {
  id: number;
  titre: string;
  type: 'CC' | 'PARTIEL' | 'EXAMEN' | 'TP';
  matiere_id: number;
  classe_id: number;
  date_evaluation: string;
  duree: number;
  note_max: number;
  coefficient: number;
}

@Injectable({
  providedIn: 'root'
})
export class KlassciApiService {
  private http = inject(HttpClient);

  private readonly baseUrl = environment.klassciApiUrl;
  private readonly tokenKey = 'klassci_token';

  // État global
  private currentUserSubject = new BehaviorSubject<KlassciUser | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor() {
    this.initializeFromStorage();
  }

  // Authentification
  login(username: string, password: string): Observable<KlassciAuthResponse> {
    this.isLoadingSubject.next(true);

    return this.http.post<KlassciAuthResponse>(`${this.baseUrl}/lms/auth/login`, {
      username,
      password
    }).pipe(
      tap(response => {
        if (response.success) {
          this.setAuthToken(response.data.token);
          this.currentUserSubject.next(response.data.user);
        }
      }),
      catchError(error => this.handleError('Erreur de connexion', error)),
      tap(() => this.isLoadingSubject.next(false))
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/lms/auth/logout`, {}).pipe(
      tap(() => {
        this.clearAuthToken();
        this.currentUserSubject.next(null);
      }),
      catchError(() => {
        // Même en cas d'erreur, on nettoie localement
        this.clearAuthToken();
        this.currentUserSubject.next(null);
        return of(null);
      })
    );
  }

  getCurrentUser(): Observable<KlassciUser> {
    return this.http.get<{success: boolean, data: KlassciUser}>(`${this.baseUrl}/lms/auth/me`).pipe(
      map(response => response.data),
      tap(user => this.currentUserSubject.next(user)),
      catchError(error => this.handleError('Erreur récupération utilisateur', error))
    );
  }

  // Structure organisationnelle
  getStructure(): Observable<any> {
    return this.http.get(`${this.baseUrl}/lms/structure`).pipe(
      shareReplay(1),
      catchError(error => this.handleError('Erreur récupération structure', error))
    );
  }

  // Classes
  getClasses(anneeId?: number): Observable<KlassciClasse[]> {
    let params = new HttpParams();
    if (anneeId) {
      params = params.set('annee_id', anneeId.toString());
    }

    return this.http.get<{success: boolean, data: KlassciClasse[]}>(`${this.baseUrl}/lms/classes`, { params }).pipe(
      map(response => response.data),
      shareReplay(1),
      catchError(error => this.handleError('Erreur récupération classes', error))
    );
  }

  getClasseEtudiants(classeId: number, anneeId?: number): Observable<KlassciEtudiant[]> {
    let params = new HttpParams();
    if (anneeId) {
      params = params.set('annee_id', anneeId.toString());
    }

    return this.http.get<{success: boolean, data: KlassciEtudiant[]}>(`${this.baseUrl}/lms/classes/${classeId}/etudiants`, { params }).pipe(
      map(response => response.data),
      catchError(error => this.handleError('Erreur récupération étudiants', error))
    );
  }

  // Enseignants
  getEnseignants(): Observable<any[]> {
    return this.http.get<{success: boolean, data: any[]}>(`${this.baseUrl}/lms/enseignants`).pipe(
      map(response => response.data),
      shareReplay(1),
      catchError(error => this.handleError('Erreur récupération enseignants', error))
    );
  }

  // Filières
  getFilieres(): Observable<any[]> {
    return this.http.get<{success: boolean, data: any[]}>(`${this.baseUrl}/lms/filieres`).pipe(
      map(response => response.data),
      shareReplay(1),
      catchError(error => this.handleError('Erreur récupération filières', error))
    );
  }

  // Niveaux d'études
  getNiveauxEtudes(): Observable<any[]> {
    return this.http.get<{success: boolean, data: any[]}>(`${this.baseUrl}/lms/niveaux-etudes`).pipe(
      map(response => response.data),
      shareReplay(1),
      catchError(error => this.handleError('Erreur récupération niveaux d\'études', error))
    );
  }

  // Matières
  getMatieres(): Observable<KlassciMatiere[]> {
    return this.http.get<{success: boolean, data: KlassciMatiere[]}>(`${this.baseUrl}/lms/matieres`).pipe(
      map(response => response.data),
      shareReplay(1),
      catchError(error => this.handleError('Erreur récupération matières', error))
    );
  }

  // Évaluations
  getEvaluations(filters?: { matiere_id?: number, classe_id?: number }): Observable<KlassciEvaluation[]> {
    let params = new HttpParams();
    if (filters?.matiere_id) {
      params = params.set('matiere_id', filters.matiere_id.toString());
    }
    if (filters?.classe_id) {
      params = params.set('classe_id', filters.classe_id.toString());
    }

    return this.http.get<{success: boolean, data: KlassciEvaluation[]}>(`${this.baseUrl}/lms/evaluations`, { params }).pipe(
      map(response => response.data),
      catchError(error => this.handleError('Erreur récupération évaluations', error))
    );
  }

  // Sauvegarde des notes
  saveNotes(evaluationId: number, notes: KlassciNote[]): Observable<any> {
    this.isLoadingSubject.next(true);

    return this.http.post(`${this.baseUrl}/lms/evaluations/${evaluationId}/notes`, {
      notes
    }).pipe(
      retry(2),
      catchError(error => this.handleError('Erreur sauvegarde notes', error)),
      tap(() => this.isLoadingSubject.next(false))
    );
  }

  // Emploi du temps
  getEmploiTemps(filters?: { classe_id?: number, enseignant_id?: number }): Observable<any> {
    let params = new HttpParams();
    if (filters?.classe_id) {
      params = params.set('classe_id', filters.classe_id.toString());
    }
    if (filters?.enseignant_id) {
      params = params.set('enseignant_id', filters.enseignant_id.toString());
    }

    return this.http.get(`${this.baseUrl}/lms/emploi-temps`, { params }).pipe(
      map((response: any) => response.data),
      shareReplay(1),
      catchError(error => this.handleError('Erreur récupération emploi du temps', error))
    );
  }

  // Présences
  savePresences(coursId: number, presences: { etudiant_id: number, status: 'present' | 'absent' | 'retard' }[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/lms/cours/${coursId}/presences`, {
      presences
    }).pipe(
      catchError(error => this.handleError('Erreur sauvegarde présences', error))
    );
  }

  // Utilitaires
  private initializeFromStorage(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.getCurrentUser().subscribe({
        next: () => {}, // User set in tap
        error: () => this.clearAuthToken()
      });
    }
  }

  private setAuthToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private clearAuthToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getAuthToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken() && !!this.currentUserSubject.value;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  private handleError(operation: string, error: any): Observable<never> {
    console.error(`${operation} failed:`, error);

    // Si erreur 401, déconnecter l'utilisateur
    if (error.status === 401) {
      this.clearAuthToken();
      this.currentUserSubject.next(null);
    }

    return throwError(() => ({
      operation,
      error: error.error?.message || error.message || 'Une erreur est survenue',
      status: error.status
    }));
  }
}