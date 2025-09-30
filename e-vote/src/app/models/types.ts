export interface Electeur {
  nom: string;
  numeroNina: string;
  telephone: string;
  langue: string;
  otp?: string;
}

export interface Vote {
  numeroNina: string;
  telephone: string;
  candidat: string;
}
