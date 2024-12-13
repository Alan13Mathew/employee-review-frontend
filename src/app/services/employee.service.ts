import { inject, Injectable } from '@angular/core';
import { Employee } from '../models/employee';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = `${environment.backendUrl}/employees`;

  private http = inject(HttpClient);

  getEmployees() {
    console.log('Fetching employees from:', this.apiUrl);
    return this.http.get<Employee[]>(this.apiUrl);
  }

  getEmployeeById(id: string) {
    console.log('Fetching employee by id:', id);
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  getEmployeeByEmail(email: string){
    console.log('Fetching employee by email:', email);
    return this.http.get<Employee>(`${this.apiUrl}/email/${email}`);
  }

  createEmployee(employee: Employee) {
    console.log('Creating employee:', employee);
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  updateEmployee(employee: Employee) {
    console.log('Updating employee:', employee);
    return this.http.put<Employee>(`${this.apiUrl}/${employee._id}`, employee);
  }

  deleteEmployee(id: string) {
    console.log('Deleting employee by id:', id);
    return this.http.delete<Employee>(`${this.apiUrl}/${id}`);
  }


  updatePassword(userId: string, passwordData: any) {
    return this.http.patch(`${this.apiUrl}/${userId}/password`, passwordData);
  }

}
