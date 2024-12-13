import { Component, inject, signal } from '@angular/core';
import { Review } from '../../models/review';
import { ReviewService } from '../../services/review.service';
import { EmployeeService } from '../../services/employee.service';
import { DatePipe, NgClass } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Employee } from '../../models/employee';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { DialogComponent } from '../../components/dialog/dialog.component';




@Component({
  selector: 'app-employee-dashboard',
  imports: [NgClass,DatePipe,ReactiveFormsModule,DialogComponent],
  templateUrl: './employee-dashboard.component.html'
})
export class EmployeeDashboardComponent{
  pendingReviews: Review[] = [];
  myReviews: Review[] = [];
  employeeNames: Map<string, string> = new Map();
  currentUser = this.getCurrentUser();
  showPasswordDialog = false;
  showSuccessMessage = false;
  successMessage = '';


  private reviewService = inject(ReviewService);
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  //reusable dialog for feedback form
  showFeedbackDialog = false;
  selectedReview: Review | null = null;
  feedbackForm: FormGroup;
  passwordForm: FormGroup;

  //reusable dialog for logout
  showLogoutDialog = false;

  constructor() {
    this.feedbackForm = this.fb.group({
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      feedback: ['', [Validators.required, Validators.minLength(5)]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    },{ validators : this.passwordMatchValidator });

    this.loadReviews();
    this.loadEmployeeNames();
    this.initializeUserAndLoadData();

  }

  private passwordMatchValidator(g: FormGroup) {
    return (control: AbstractControl): ValidationErrors | null => {
      const newPassword = control.get('newPassword');
      const confirmPassword = control.get('confirmPassword');

      if (!newPassword || !confirmPassword) {
        return null;
      }

      return newPassword.value === confirmPassword.value ? null : { mismatch: true };
    };
    
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

  updatePassword() {
    if (this.passwordForm.valid) {
      const passwordData = {
        currentPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword
      };

      this.employeeService.updatePassword(this.currentUser.id, passwordData)
        .subscribe({
          next: (response: any) => {
            this.showPasswordDialog = false;
            this.passwordForm.reset();
            this.successMessage = response.message || 'Password updated successfully';
            this.showSuccessMessage = true;
            
            setTimeout(() => {
              this.showSuccessMessage = false;
            }, 3000);
          },
          error: (error) => {
            this.successMessage = error.message || 'Password update failed';
            this.showSuccessMessage = true;
            setTimeout(() => {
              this.showSuccessMessage = false;
            }, 3000);
            console.error('Password update failed:', error);
          }
        });
    }
  }

  cancelPasswordChange() {
    this.showPasswordDialog = false;
    this.passwordForm.reset();
  }


  loadReviews() {
    this.reviewService.getReviews().subscribe({
      next: (reviews) => {
        // Reviews where user is a reviewer
        this.pendingReviews = reviews.filter(review => {
          const reviewerIds = Array.isArray(review.reviewerIds) ? review.reviewerIds : [];
          return reviewerIds.some(reviewer => {
            const reviewerId = typeof reviewer === 'object' ? reviewer._id : reviewer;
            return reviewerId === this.currentUser.id;
          }) && review.status === 'pending';
        });

        // Reviews where user is being reviewed
        this.myReviews = reviews.filter(review => {
          const employeeId = typeof review.employeeId === 'object' 
            ? review.employeeId._id 
            : review.employeeId;
          return employeeId === this.currentUser.id;
        });
      }
    });
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
    if (typeof employee === 'object' && employee?.full_name) {
      return employee.full_name;
    }
    return this.employeeNames.get(employee) || 'Unknown Employee';
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



