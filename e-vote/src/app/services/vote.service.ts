import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VoteService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getVotes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/votes`);
  }
}
