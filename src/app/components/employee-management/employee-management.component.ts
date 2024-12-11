import { Component, inject, OnInit } from '@angular/core';
import { Employee } from '../../models/employee';
import { EmployeeService } from '../../services/employee.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-employee-management',
  imports: [DialogComponent,ReactiveFormsModule],
  templateUrl: './employee-management.component.html',
  styleUrl: './employee-management.component.scss'
})
export class EmployeeManagementComponent implements OnInit{

  employees: Employee[] = [];
  private employeeService = inject(EmployeeService);
  private fb = inject(FormBuilder);
  showDialog = false;
  selectedEmployee: Employee | null = null;
  employeeForm: FormGroup;


  constructor() { 
    this.employeeForm = this.fb.group({
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      position: ['', Validators.required],
      role: ['employee', Validators.required],
      password: ['changeme', Validators.required]
    });
  }

  openAddEmployeeModal() {
    this.selectedEmployee = null;
    this.employeeForm.reset({
      role: 'employee',
      password: '123456' //newly added users will have 1234556 as their password
    });
    this.showDialog = true;
  }

  editEmployee(employee: Employee) {
    this.selectedEmployee = employee;
    this.employeeForm.patchValue(employee);
    this.showDialog = true;
  }

  deleteEmployee(id: string) {
    // TODO: Add delete employee logic
    console.log('delete employee');
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(){
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
    });
  }

  handleSubmit() {
    if (this.employeeForm.valid) {
      const employeeData = this.employeeForm.value;
  
      if (this.selectedEmployee) {
        this.employeeService.updateEmployee({
          ...this.selectedEmployee,
          ...employeeData
        }).subscribe({
          next: () => {
            this.loadEmployees();
            this.showDialog = false;
          },
          error: (error) => {
            console.log('Update error:', error);
          }
        });
      } else {
        this.employeeService.createEmployee(employeeData).subscribe({
          next: () => {
            this.loadEmployees();
            this.showDialog = false;
          },
          error: (error) => {
            console.log('Creation error:', error);
          }
        });
      }
    }
  }
  


}