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
})
export class ReviewManagementComponent implements OnInit{

  reviews: Review[] = [];
  employees: Employee[] = [];
  showCreateReviewDialog = false;
  reviewForm!: FormGroup;

  private reviewService = inject(ReviewService);
  private employeeService = inject(EmployeeService);
  private fb = inject(FormBuilder);

  constructor(){
    this.initReviewForm();
  }
  ngOnInit(): void {
    this.loadEmployees();
    this.loadReviews();
  }

  private initReviewForm(){
    this.reviewForm = this.fb.group({
      employeeId: ['', [Validators.required]],
      reviewerIds: [[], [Validators.required]],
      period: ['', [Validators.required]],
      dueDate: ['', [Validators.required]]
    });
  }


  loadReviews(){
    this.reviewService.getReviews().subscribe({
      next: reviews => {
        this.reviews = reviews;
        console.log('Loaded reviews:', reviews);
      },
      error: error => {
        console.log('Error loading reviews:', error);
      }
    })
  }

  loadEmployees(){
    this.employeeService.getEmployees().subscribe({
      next: employees => {
        this.employees = employees;
        console.log('Loaded employees:', employees);
      },
      error: error => {
        console.log('Error loading employees:', error);
      }
    })
  }

  getEmployeeName(review: Review): string {
    if (review.employeeId && typeof review.employeeId === 'object') {
      return review.employeeId.full_name;
    }
    const employee = this.employees.find(emp => emp._id === review.employeeId);
    return employee?.full_name || 'Unknown Employee';
  }

  getReviewerNames(review: Review): string {
    if (Array.isArray(review.reviewerIds)) {
      return review.reviewerIds
        .map(reviewerId => {
          if (typeof reviewerId === 'object') {
            return reviewerId.full_name;
          }
          const reviewer = this.employees.find(emp => emp._id === reviewerId);
          return reviewer?.full_name || 'Unknown';
        })
        .join(', ');
    }
    return 'Not Assigned';
  }
  
  
  submitReview() {
    if (this.reviewForm.valid) {
      const reviewData = this.reviewForm.value;
      this.reviewService.createReview(reviewData).subscribe({
        next: (response) => {
          console.log('Review created:', response);
          this.loadReviews();
          this.showCreateReviewDialog = false;
          this.reviewForm.reset();
        },
        error: (error) => console.error('Error creating review:', error)
      });
    }
  }


}
