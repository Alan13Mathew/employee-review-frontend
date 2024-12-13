import { Component, inject } from '@angular/core';
import { Review } from '../../models/review';
import { ReviewService } from '../../services/review.service';
import { EmployeeService } from '../../services/employee.service';
import { DatePipe, NgClass } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Employee } from '../../models/employee';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogComponent } from '../../components/dialog/dialog.component';


interface PopulatedUser {
  _id: string;
  full_name: string;
  email: string;
  position: string;
}
@Component({
  selector: 'app-employee-dashboard',
  imports: [NgClass,DatePipe,ReactiveFormsModule,DialogComponent],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.scss'
})
export class EmployeeDashboardComponent{
  pendingReviews: Review[] = [];
  myReviews: Review[] = [];
  employeeNames: Map<string, string> = new Map();
  currentUser = this.getCurrentUser();


  private reviewService = inject(ReviewService);
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  //reusable dialog for feedback form
  showFeedbackDialog = false;
  selectedReview: Review | null = null;
  feedbackForm: FormGroup;

  //reusable dialog for logout
  showLogoutDialog = false;

  constructor() {
    this.feedbackForm = this.fb.group({
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      feedback: ['', [Validators.required, Validators.minLength(5)]]
    });

    this.loadReviews();
    this.loadEmployeeNames();
    this.initializeUserAndLoadData();

  }



  private getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : {
      _id: '',
      full_name: '',
      email: '',
      position: ''
    };
  }



  loadReviews() {
    const userId = this.currentUser.id;
    
    this.reviewService.getReviews().subscribe({
      next: (reviews) => {
        this.pendingReviews = reviews.filter(review => {
          const reviewerId = typeof review.reviewerId === 'string' 
            ? review.reviewerId 
            : (review.reviewerId as PopulatedUser)._id;
          return reviewerId === userId && review.status === 'pending';
        });
        
        this.myReviews = reviews.filter(review => {
          const employeeId = typeof review.employeeId === 'string' 
            ? review.employeeId 
            : (review.employeeId as PopulatedUser)._id;
          return employeeId === userId;
        });
      }
    });
  }
  
  
  
  
  
  private processReviews(reviews: Review[]) {
    this.pendingReviews = reviews.filter(r => 
      r.reviewerId === this.currentUser._id && 
      r.status === 'pending'
    );
    this.myReviews = reviews.filter(r => 
      r.employeeId === this.currentUser._id
    );
  }


  private initializeUserAndLoadData() {
    // First ensure user data is loaded
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
      console.log('User loaded successfully:', this.currentUser);
      this.loadReviews();
      this.loadEmployeeNames();
    } else {
      // Redirect to login if no user data
      this.router.navigate(['/login']);
    }
  }
  

  loadEmployeeNames() {
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employeeNames.clear();
        employees.forEach(employee => {
          this.employeeNames.set(employee._id, employee.full_name);
        });
      },
      error: (error) => console.error('Error loading employee names:', error)
    });
  }

  getEmployeeName(employee: any): string {
    return employee?.full_name || 'Unknown Employee';
  }

  provideFeedback(review: Review) {
    this.selectedReview = review;
    this.showFeedbackDialog = true;
  }

  submitFeedback() {
    if (this.feedbackForm.valid && this.selectedReview) {
      this.reviewService.submitFeedback(
        this.selectedReview._id,
        this.feedbackForm.value
      ).subscribe({
        next: () => {
          this.loadReviews();
          this.showFeedbackDialog = false;
          this.feedbackForm.reset();
          this.selectedReview = null;
        },
        error: (error) => console.error('Error submitting feedback:', error)
      });
    }
  }

  handleLogout() {
    this.showLogoutDialog = true;
  }

  confirmLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.showLogoutDialog = false;
  }




}



