import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { RoomDetailsComponent } from './features/rooms/room-details.component';
import { RoomsListComponent } from './features/rooms/rooms-list.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { authGuard } from './core/guards/auth.guard';        // ⭐️ هذا المهم

import { UserReservationsComponent } from './features/account/reservations/user-reservations.component';


export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'rooms', component: RoomsListComponent },
  { path: 'rooms/:id', component: RoomDetailsComponent },
   // ✅ Auth
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'account/reservations', component: UserReservationsComponent, canActivate: [authGuard] },


  { path: '**', redirectTo: '' },
];




