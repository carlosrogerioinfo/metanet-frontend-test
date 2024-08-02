import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { AuthenticationGuardService } from './services/authentication-guard.service';

const routes: Routes = [

  {
    path: '', component: AppLayoutComponent,
    children: [
        { path: '', loadChildren: () => import('./components/base/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate:[AuthenticationGuardService] },
        { path: 'product', loadChildren: () => import('./components/product/product.module').then(m => m.ProductModule), canActivate:[AuthenticationGuardService] },
        { path: 'sale', loadChildren: () => import('./components/sale/sale.module').then(m => m.SaleModule), canActivate:[AuthenticationGuardService] },
    ],
  },
  { path: 'login', loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule) },
  { path: '**', redirectTo: '/login' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthenticationGuardService],
  exports: [RouterModule]
})
export class AppRoutingModule { }


