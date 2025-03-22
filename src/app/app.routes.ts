import {Routes} from '@angular/router';
import {authRoutes} from './features/auth';
import {AdminGuard} from './core/guards/admin.guard';
import {AuthGuard} from './core/guards/auth.guard';
import {DashboardComponent} from './features/dashboard/pages/dashboard/dashboard.component';
import {NotAuthGuard} from './core/guards/not-auth.guard';
import {LayoutComponent} from './core/layout/pages/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/public/pages/home/home.component')
            .then(m => m.HomeComponent)
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/public/pages/about/about.component')
            .then(m => m.AboutComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/user/pages/profile/profile.component')
            .then(m => m.ProfileComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'articles',
        loadComponent: () =>
          import('./features/public/pages/articles/articles.component')
            .then(m => m.ArticlesComponent)
      },
      {
        path: 'articles/:id',
        loadComponent: () =>
          import('./features/public/pages/article-detail/article-detail.component')
            .then(m => m.ArticleDetailComponent)
      },
      {
        path: 'donate',
        loadComponent: () =>
          import('./features/donate/pages/donate/donate.component')
            .then(m => m.DonateComponent),
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'auth',
    children: authRoutes,
    canActivate: [NotAuthGuard],
  },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard, AdminGuard] },
  {
    path: "**",
    redirectTo: ""
  }
];
