import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VoteRequest {
  utilisateurId?: number;
  candidatId?: number;
  candidatNom: string;
  numeroElecteur: string;
  email: string;
  telephone: string;
  otp: string;
  photoCarte: string | ArrayBuffer | null;
  dateVote: string;
}

export interface VoteResponse {
  success: boolean;
  message: string;
  reference?: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class VoteService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  enregistrerVote(voteData: VoteRequest): Observable<VoteResponse> {
    return this.http.post<VoteResponse>(`${this.apiUrl}/vote`, voteData);
  }

  getCandidats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/candidats`);
  }

  getCandidatById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/candidats/${id}`);
  }

  getVotesByUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/votes/utilisateur/${userId}`);
  }
}