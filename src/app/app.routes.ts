import { Routes } from '@angular/router';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { HomeComponent } from './pages/home/home.component';
import { CotizaSeguroComponent } from './pages/cotiza-seguro/cotiza-seguro.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'contacto', component: ContactoComponent },
    { path: 'cotiza-seguro', component: CotizaSeguroComponent },
    { path: '**', redirectTo: '' }
];
