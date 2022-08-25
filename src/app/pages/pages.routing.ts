import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from "../guards/auth.guard";

import { AccountSettingsComponent } from "./account-settings/account-settings.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { DoctorsComponent } from "./maintenance/doctors/doctors.component";
import { DoctorComponent } from "./maintenance/doctors/doctor.component";
import { Grafica1Component } from "./grafica1/grafica1.component";
import { HospitalsComponent } from "./maintenance/hospitals/hospitals.component";
import { PagesComponent } from "./pages.component";
import { ProgressComponent } from "./progress/progress.component";
import { PromisesComponent } from "./promises/promises.component";
import { RxjsComponent } from "./rxjs/rxjs.component";
import { UsersComponent } from "./maintenance/users/users.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";

const routes: Routes = [

    {
        path: 'dashboard',
        component: PagesComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DashboardComponent, data: {title: 'Dashboard'} },
            { path: 'account-settings', component: AccountSettingsComponent, data: { title: 'Ajustes' } },
            { path: 'charts', component: Grafica1Component, data: { title: 'Gráfica' } },
            { path: 'progress', component: ProgressComponent, data: { title: 'Progress Bar' } },
            { path: 'promises', component: PromisesComponent, data: { title: 'Promesas' } },
            { path: 'profile', component: UserProfileComponent, data: { title: 'Perfil de Usuario' } },
            { path: 'rxjs', component: RxjsComponent, data: { title: 'Observables' } },

            // MANTEINANCE
            { path: 'usuarios', component: UsersComponent, data: { title: 'Usuarios' } },
            { path: 'hospitales', component: HospitalsComponent, data: { title: 'Hospitales' } },
            { path: 'medicos', component: DoctorsComponent, data: { title: 'Médicos' } },
            { path: 'medico/:id', component: DoctorComponent, data: { title: 'Médicos' } },
        ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {

}