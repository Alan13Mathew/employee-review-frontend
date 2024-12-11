import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { EmployeeManagementComponent } from './components/employee-management/employee-management.component';
import { ReviewManagementComponent } from './components/review-management/review-management.component';
import { EmployeeDashboardComponent } from './pages/employee-dashboard/employee-dashboard.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'admin-dashboard',
        component: AdminDashboardComponent,
        children: [
            {
                path: 'employees', component: EmployeeManagementComponent
            },
            {
                path: 'reviews', component: ReviewManagementComponent
            }
        ]
    },
    {
        path: 'employee-dashboard',
        component: EmployeeDashboardComponent
    }
];
