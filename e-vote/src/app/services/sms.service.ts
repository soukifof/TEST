import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SmsService {
  constructor(private http: HttpClient) {}

  sendSms(numero: string, message: string): Observable<any> {
    console.log('📡 Envoi du SMS via API :', numero, message);

    const url = 'https://api.orange.mali/sms/send'; // Remplace par l’URL réelle
    const body = {
      to: numero, // ou 'numero' selon le fournisseur
      message: message
    };

    const headers = new HttpHeaders({
      'Authorization': 'Bearer VOTRE_TOKEN_ICI', // Remplace par ton vrai token
      'Content-Type': 'application/json'
    });

    return this.http.post(url, body, { headers });
  }
}
