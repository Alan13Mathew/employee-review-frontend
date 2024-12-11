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

//  private employees: Employee[] =  [{
//     "id": "1",
//     "full_name": "Caty Hallihane",
//     "email": "challihane0@woothemes.com",
//     "password": "123456",
//     "gender": "Female",
//     "role": "employee",
//     "position": "Software Engineer"
//   }, {
//     "id": "2",
//     "full_name": "Morey Schmidt",
//     "email": "mschmidt1@sogou.com",
//     "password": "123456",
//     "gender": "Male",
//     "role": "employee",
//     "position": "Quality Assurance"
//   }, {
//     "id": "3",
//     "full_name": "Kore MacNulty",
//     "email": "kmacnulty2@usatoday.com",
//     "password": "123456",
//     "gender": "Female",
//     "role": "employee",
//     "position": "Financial Analyst"
//   }, {
//     "id": "4",
//     "full_name": "Alanah Audibert",
//     "email": "aaudibert3@multiply.com",
//     "password": "123456",
//     "gender": "Female",
//     "role": "employee",
//     "position": "Data Coordiator"
//   }, {
//     "id": "5",
//     "full_name": "Guido Guttridge",
//     "email": "gguttridge4@wired.com",
//     "password": "123456",
//     "gender": "Male",
//     "role": "employee",
//     "position": "Programmer Analyst II"
//   }, {
//     "id": "6",
//     "full_name": "Walker Beauchop",
//     "email": "wbeauchop5@seattletimes.com",
//     "password": "123456",
//     "gender": "Male",
//     "role": "employee",
//     "position": "Programmer II"
//   }, {
//     "id": "7",
//     "full_name": "Brana Brisset",
//     "email": "bbrisset6@technorati.com",
//     "password": "123456",
//     "gender": "Female",
//     "role": "employee",
//     "position": "Database Administrator I"
//   }, {
//     "id": "8",
//     "full_name": "Belita Cattanach",
//     "email": "bcattanach7@addthis.com",
//     "password": "123456",
//     "gender": "Female",
//     "role": "employee",
//     "position": "Senior Developer"
//   }, {
//     "id": "9",
//     "full_name": "Jolee Vaughn",
//     "email": "jvaughn8@clickbank.net",
//     "password": "123456",
//     "gender": "Female",
//     "role": "employee",
//     "position": "Software Consultant"
//   }, {
//     "id": "10",
//     "full_name": "Reider Dono",
//     "email": "rdono9@123-reg.co.uk",
//     "password": "123456",
//     "gender": "Male",
//     "role": "employee",
//     "position": "ML Engineer" 
//   },{
//     "id": "11",
//     "full_name": "Alan C Mathew",
//     "email": "alan@gmail.com",
//     "password": "123456",
//     "gender": "Male",
//     "role": "employee",
//     "position": "Software Engineer"
//   }]

//   constructor() { }

//   getEmployees(){
//     return of(this.employees);
//   }

//   getEmployeeById(id: string) {
//     return this.employees.find(employee => employee.id === id);
//   }

//   getEmployeeByEmail(email: string) {
//     return this.employees.find(employee => employee.email === email);
//   }

}
