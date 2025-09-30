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



export const routes: Routes = [

 { path: 'home', component: HomeComponent },
{ path: 'login', component: LoginComponent },
{ path: 'register', component: RegisterComponent },
{ path: 'principale', component: PrincipaleComponent },
{ path: 'vote', component: VoteComponent },
{ path: 'profil', component: ProfilComponent },
{ path: 'perso', component: PersoComponent },
{ path: 'conseils', component: ConseilsComponent },
{ path: 'favoris', component: FavorisComponent },
{ path: 'faits-mali', component: FaitsMaliComponent },
{ path: 'electeurs', component: ElecteurComponent },


   
  { path: '', redirectTo: 'principale'  , pathMatch: 'full' }

];
