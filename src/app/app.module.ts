import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgOtpInputComponent } from 'ng-otp-input';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { UserComponent } from './user/user.component';
import { UserDrawerComponent } from './user/user-drawer/user-drawer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
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
import { DeleteDialogComponent } from './shared/delete-dialog/delete-dialog.component';
import { BusinessDrawerComponent } from './category/business/business-drawer/business-drawer.component';
import { JillaDrawerComponent } from './category/jilla/jilla-drawer/jilla-drawer.component';
import { TalukaDrawerComponent } from './category/taluka/taluka-drawer/taluka-drawer.component';
import { VillageDrawerComponent } from './category/village/village-drawer/village-drawer.component';
import { CastDrawerComponent } from './category/cast/cast-drawer/cast-drawer.component';
import { SubCastDrawerComponent } from './category/sub-cast/sub-cast-drawer/sub-cast-drawer.component';
import { SurnameDrawerComponent } from './category/surname/surname-drawer/surname-drawer.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    VerifyOtpComponent,
    DashboardComponent,
    LayoutComponent,
    UserComponent,
    UserDrawerComponent,
    BusinessComponent,
    CityComponent,
    CountryComponent,
    StateComponent,
    JillaComponent,
    TalukaComponent,
    VillageComponent,
    CastComponent,
    SubCastComponent,
    SurnameComponent,
    OccupationComponent,
    EducationComponent,
    DeleteDialogComponent,
    BusinessDrawerComponent,
    JillaDrawerComponent,
    TalukaDrawerComponent,
    VillageDrawerComponent,
    CastDrawerComponent,
    SubCastDrawerComponent,
    SurnameDrawerComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgOtpInputComponent,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSidenavModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
