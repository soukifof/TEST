import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Candidat {
  id: number;
  nom: string;
  photoUrl: string;
  slogan: string;
  parti?: string;
  votesCount?: number;
}

export interface Stats {
  totalVotes: number;
  totalCandidats: number;
  participants: number;
  votingActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CandidatService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getCandidats(): Observable<Candidat[]> {
    return this.http.get<Candidat[]>(`${this.apiUrl}/candidats`);
  }

  getCandidatById(id: number): Observable<Candidat> {
    return this.http.get<Candidat>(`${this.apiUrl}/candidats/${id}`);
  }

  getStats(): Observable<Stats> {
    return this.http.get<Stats>(`${this.apiUrl}/stats`);
  }

  getVotesByCandidat(candidatId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/votes/candidat/${candidatId}/count`);
  }
}