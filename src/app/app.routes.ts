import {Routes} from '@angular/router';
import {authRoutes} from './features/auth';
import {AdminGuard} from './core/guards/admin.guard';
import {AuthGuard} from './core/guards/auth.guard';
import {NotAuthGuard} from './core/guards/not-auth.guard';
import {LayoutComponent} from './core/layout/pages/layout/layout.component';
import {AdminLayoutComponent} from './core/layout/pages/admin-layout/admin-layout.component';

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
      },
      {
        path: 'my-donations',
        loadComponent: () =>
          import('./features/donate/pages/my-donations/my-donations.component')
            .then(m=>m.MyDonationsComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'request',
        loadComponent: () =>
          import('./features/request/pages/request/request.component')
            .then(m => m.RequestComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'my-requests',
        loadComponent: () =>
          import('./features/request/pages/my-requests/my-requests.component')
            .then(m=>m.MyRequestsComponent),
        canActivate: [AuthGuard]
      },
    ]
  },
  {
    path: 'auth',
    children: authRoutes,
    canActivate: [NotAuthGuard],
  },
  {
    path: 'dashboard',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/admin/pages/dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      },
      {
        path: "articles",
        loadComponent: () =>
          import("./features/admin/pages/article-list/article-list.component")
            .then((m) => m.ArticleListComponent),
      },
      {
        path: "articles/create",
        loadComponent: () =>
          import("./features/admin/components/article-form/article-form.component")
            .then((m) => m.ArticleFormComponent),
      },
      {
        path: "articles/edit/:id",
        loadComponent: () =>
          import("./features/admin/components/article-form/article-form.component")
            .then((m) => m.ArticleFormComponent),
      },
      // {
      //   path: "donations",
      //   loadComponent: () =>
      //     import("./features/admin/pages/donation-list/donation-list.component").then(
      //       (m) => m.DonationListComponent,
      //     ),
      // },
    ],
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: "**",
    redirectTo: ""
  }
];
