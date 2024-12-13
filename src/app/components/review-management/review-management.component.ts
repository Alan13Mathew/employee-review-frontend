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
      reviewerId: ['', [Validators.required]],
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

  getReviewerName(review: Review): string {
    if (review.reviewerId && typeof review.reviewerId === 'object') {
      return review.reviewerId.full_name;
    }
    const reviewer = this.employees.find(emp => emp._id === review.reviewerId);
    return reviewer?.full_name || 'Not Assigned';
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








//   reviews: Review[] = [];
//   employeeNames: Map<string, string> = new Map();

//  private reviewService = inject(ReviewService);
//  private employeeService = inject(EmployeeService);
//  private fb = inject(FormBuilder);

//  showCreateReviewDialog = false;
//  reviewForm!: FormGroup;
//  employees: Employee[] = [];

//  constructor(){
//    this.initReviewForm();
//  }

//  ngOnInit(): void {
//   this.loadReviews();
//   this.loadEmployeeNames();
// }

//  private initReviewForm(){
//   this.reviewForm = this.fb.group({
//     employeeId: ['', [Validators.required]],
//     reviewerId: ['', [Validators.required]],
//     period: ['', [Validators.required]],
//     dueDate: ['', [Validators.required]]
//   });

//  }


//   openCreateReviewModal() {
//     this.showCreateReviewDialog = true;
//     this.loadEmployees();
//   }

//   loadEmployees(){
//     this.employeeService.getEmployees().subscribe(employees => {
//       this.employees = employees;
//       console.log('Loaded employees:', employees);
//     });
//   }


//   submitReview() {
//     if (this.reviewForm.valid) {
//       const reviewData = this.reviewForm.value;
//       console.log('Submitting review:', reviewData);
      
//       this.reviewService.createReview(reviewData).subscribe({
//         next: (response) => {
//           console.log('Review created:', response);
//           this.loadReviews();
//           this.showCreateReviewDialog  = false;
//           this.reviewForm.reset();
//         },
//         error: (error) => {
//           console.log('Error creating review:', error);
//         }
//       });
//     }
//   }
  


//   loadReviews() {
//     this.reviewService.getReviews().subscribe(reviews => {
//       // Map the reviews to ensure consistent structure
//       this.reviews = reviews.map(review => ({
//         ...review,
//         employeeId: review.employeeId || { full_name: 'Unknown Employee' }
//       }));
//       console.log('Mapped reviews:', this.reviews);
//     });
//   }

// loadEmployeeNames() {
//   this.employeeService.getEmployees().subscribe(employees => {
//     // Clear existing map before adding new values
//     this.employeeNames.clear();
//     employees.forEach(employee => {
//       if (employee._id) {
//         this.employeeNames.set(employee._id, employee.full_name);
//       }
//     });
//     // Force change detection
//     this.reviews = [...this.reviews];
//   });
// }

// getEmployeeName(employeeId: any): string {
//   // Handle populated employee object
//   if (employeeId && typeof employeeId === 'object' && employeeId.full_name) {
//     return employeeId.full_name;
//   }
  
//   // Handle ID-only case
//   const name = this.employeeNames.get(employeeId);
//   console.log(`Getting name for ID ${employeeId}:`, name);
//   return name || 'Unknown Employee';
// }


//   assignReviewers(reviewId: string) {
//     // TODO: Add assign reviewers logic
//     console.log('assign reviewers');
//   }

//   viewDetails(reviewId: string) {
//     // TODO: Add view details logic
//     console.log('view details');
//   }

}
