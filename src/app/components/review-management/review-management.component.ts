import { Component, inject, OnInit } from '@angular/core';
import { Review } from '../../models/review';
import { ReviewService } from '../../services/review.service';
import { EmployeeService } from '../../services/employee.service';
import { DatePipe, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee } from '../../models/employee';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-review-management',
  imports: [NgClass,DatePipe,ReactiveFormsModule,DialogComponent],
  templateUrl: './review-management.component.html',
  styleUrl: './review-management.component.scss'
})
export class ReviewManagementComponent implements OnInit{

  reviews: Review[] = [];
  employeeNames: Map<string, string> = new Map();

 private reviewService = inject(ReviewService);
 private employeeService = inject(EmployeeService);
 private fb = inject(FormBuilder);

 showCreateReviewDialog = false;
 reviewForm!: FormGroup;
 employees: Employee[] = [];

 constructor(){
   this.initReviewForm();
 }

 ngOnInit(): void {
  this.loadReviews();
  this.loadEmployeeNames();
}

 private initReviewForm(){
  this.reviewForm = this.fb.group({
    employeeId: ['', [Validators.required]],
    reviewerId: ['', [Validators.required]],
    period: ['', [Validators.required]],
    dueDate: ['', [Validators.required]]
  });

 }


  openCreateReviewModal() {
    this.showCreateReviewDialog = true;
    this.loadEmployees();
  }

  loadEmployees(){
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
      console.log('Loaded employees:', employees);
    });
  }


  submitReview() {
    if (this.reviewForm.valid) {
      const reviewData = this.reviewForm.value;
      console.log('Submitting review:', reviewData);
      
      this.reviewService.createReview(reviewData).subscribe({
        next: (response) => {
          console.log('Review created:', response);
          this.loadReviews();
          this.showCreateReviewDialog  = false;
          this.reviewForm.reset();
        },
        error: (error) => {
          console.log('Error creating review:', error);
        }
      });
    }
  }
  




  loadReviews(){
    this.reviewService.getReviews().subscribe(reviews => {
      this.reviews = reviews;
    });
  }

  loadEmployeeNames(){
    this.employeeService.getEmployees().subscribe(employees => {
      employees.forEach(employee => {
        this.employeeNames.set(employee._id, employee.full_name);
      });
    });
  }

  getEmployeeName(employeeId: string): string {
    return this.employeeNames.get(employeeId) || 'Unknown Employee';
  }

  assignReviewers(reviewId: string) {
    // TODO: Add assign reviewers logic
    console.log('assign reviewers');
  }

  viewDetails(reviewId: string) {
    // TODO: Add view details logic
    console.log('view details');
  }

}
