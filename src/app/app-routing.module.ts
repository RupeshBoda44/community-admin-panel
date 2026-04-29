import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { BusinessComponent } from './category/business/business.component';
import { CityComponent } from './category/city/city.component';
import { CountryComponent } from './category/country/country.component';
import { StateComponent } from './category/state/state.component';
import { JillaComponent } from './category/jilla/jilla.component';
import { TalukaComponent } from './category/taluka/taluka.component';
import { VillageComponent } from './category/village/village.component';
import { CastComponent } from './category/cast/cast.component';
import { SubCastComponent } from './category/sub-cast/sub-cast.component';
import { SurnameComponent } from './category/surname/surname.component';
import { OccupationComponent } from './category/occupation/occupation.component';
import { EducationComponent } from './category/education/education.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { AuthGuard } from './auth.guard';
import { GuestGuard } from './guest.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'verify-otp', component: VerifyOtpComponent, canActivate: [GuestGuard] },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard',           component: DashboardComponent },
      { path: 'user',                component: UserComponent },
      { path: 'category/business',   component: BusinessComponent },
      { path: 'category/city',       component: CityComponent },
      { path: 'category/country',    component: CountryComponent },
      { path: 'category/state',      component: StateComponent },
      { path: 'category/jilla',      component: JillaComponent },
      { path: 'category/taluka',     component: TalukaComponent },
      { path: 'category/village',    component: VillageComponent },
      { path: 'category/cast',       component: CastComponent },
      { path: 'category/sub-cast',   component: SubCastComponent },
      { path: 'category/surname',    component: SurnameComponent },
      { path: 'category/occupation', component: OccupationComponent },
      { path: 'category/education',  component: EducationComponent },
      { path: 'announcement',           component: AnnouncementComponent },
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
