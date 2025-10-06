import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfilComponent } from './profil/profil.component';
import { RegisterComponent } from './register/register.component';
import { PrincipaleComponent } from './principale/principale.component';
import { VoteComponent } from './vote/vote.component';
import { PersoComponent } from './perso/perso.component';
import { ConseilsComponent } from './conseils/conseils.component';
import { FavorisComponent } from './favoris/favoris.component';
import { FaitsMaliComponent } from './faits-mali/faits-mali.component';
import { ElecteurComponent } from './electeur/electeur.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';


export const routes: Routes = [
  // Route par défaut - Page d'accueil
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  
  // Page d'accueil principale
  { path: 'home', component: HomeComponent, title: 'Accueil - E-Vote Mali' },
  
  // Authentification
  { path: 'login', component: LoginComponent, title: 'Connexion - E-Vote Mali' },
  { path: 'register', component: RegisterComponent, title: 'Inscription - E-Vote Mali' },
  
  // Tableau de bord principal après connexion
  { path: 'principale', component: PrincipaleComponent, title: 'Tableau de Bord - E-Vote Mali' },
  
  // Fonctionnalités de vote
  { path: 'vote', component: VoteComponent, title: 'Vote - E-Vote Mali' },
  { path: 'favoris', component: FavorisComponent, title: 'Candidats Favoris - E-Vote Mali' },
  
  // Profil utilisateur
  { path: 'profil', component: ProfilComponent, title: 'Mon Profil - E-Vote Mali' },
  { path: 'perso', component: PersoComponent, title: 'Informations Personnelles - E-Vote Mali' },
  
  // Éducation et informations
  { path: 'conseils', component: ConseilsComponent, title: 'Conseils de Vote - E-Vote Mali' },
  { path: 'faits-mali', component: FaitsMaliComponent, title: 'Faits sur le Mali - E-Vote Mali' },
  { path: 'electeurs', component: ElecteurComponent, title: 'Espace Électeur - E-Vote Mali' },
  
  // Page 404 - Route wildcard (à créer)
  { path: '**', redirectTo: 'home', pathMatch: 'full' },

{  path: 'confirmation', 
    component: ConfirmationComponent, 
    title: 'Confirmation de Vote - E-Vote Mali' 
  },

];