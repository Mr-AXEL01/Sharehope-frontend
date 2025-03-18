import {Routes} from '@angular/router';
import {authRoutes} from './features/auth';
import {AdminGuard} from './core/guards/admin.guard';
import {AuthGuard} from './core/guards/auth.guard';
import {DashboardComponent} from './features/dashboard/pages/dashboard/dashboard.component';
import {ProfileComponent} from './features/user/pages/profile/profile.component';
import {NotAuthGuard} from './core/guards/not-auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: authRoutes,
    canActivate: [NotAuthGuard],
  },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
];
