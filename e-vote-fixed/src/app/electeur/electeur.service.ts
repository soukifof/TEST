import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ElecteurService {
  private apiUrl = 'http://localhost:8080/api/electeurs';

  constructor(private http: HttpClient) {}

  registerElecteur(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }
}
