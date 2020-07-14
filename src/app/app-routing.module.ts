import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { GuestGuard } from './guest.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'apps',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/apps/apps.module').then(m => m.AppsPageModule)
  },
  {
    path: 'monitoring',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/monitoring/monitoring.module').then(m => m.MonitoringPageModule)
  },
  {
    path: 'cluster',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/cluster/cluster.module').then(m => m.ClusterPageModule)
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsPageModule)
  },
  {
    path: 'account',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/account/account.module').then( m => m.AccountPageModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
