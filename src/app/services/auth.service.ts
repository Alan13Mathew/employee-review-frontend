import { inject, Injectable } from '@angular/core';
import { EmployeeService } from './employee.service';
import { catchError, map, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  employeeService = inject(EmployeeService);


  login(email: string, password: string) {
    return this.employeeService.getEmployeeByEmail(email).pipe(
      map((employee) => {
        if (!employee || !employee.password) {
          return 'invalid email';
        }

        // Check password (demo logic; replace with proper authentication in production)
        if (password === employee.password) {
          const currentUser = {
            id: employee._id,
            email: employee.email,
            full_name: employee.full_name,
            role: employee.role,
          };

          // Save user data to localStorage
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          localStorage.setItem('userRole', employee.role);
          return 'success';
        }

        return 'invalid password';
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  logout() {
    localStorage.clear()
  }

}
