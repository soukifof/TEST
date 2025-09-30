import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BackendService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getElecteurs(): Observable<any> {
    return this.http.get(`${this.baseUrl}/electeurs`);
  }

  createElecteur(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/electeurs`, data);
  }

  getVotes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/votes`);
  }

  createVote(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/votes`, data);
  }

  sendOtp(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/otp/send`, data);
  }

  verifyOtp(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/otp/verify`, data);
  }
}
