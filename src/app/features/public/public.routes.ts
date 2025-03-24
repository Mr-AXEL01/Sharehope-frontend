import {Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';

export const publicRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component')
            .then(m => m.HomeComponent)
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./pages/about/about.component')
            .then(m => m.AboutComponent)
      },
    ]
  },
];
