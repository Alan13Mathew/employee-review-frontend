import { Component, inject, OnInit } from '@angular/core';
import { Review } from '../../models/review';
import { ReviewService } from '../../services/review.service';
import { EmployeeService } from '../../services/employee.service';
import { DatePipe, NgClass } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Employee } from '../../models/employee';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogComponent } from '../../components/dialog/dialog.component';

@Component({
  selector: 'app-employee-dashboard',
  imports: [NgClass,DatePipe,ReactiveFormsModule,DialogComponent],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.scss'
})
export class EmployeeDashboardComponent implements OnInit{
  pendingReviews: Review[] = [];
  myReviews: Review[] = [];
  employeeNames: Map<string, string> = new Map();

  currentUser: Employee = JSON.parse(localStorage.getItem('currentUser') as string);

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

  }


  ngOnInit(): void {
      this.loadReviews();
      this.loadEmployeeNames();
  }

  loadReviews(){
  const currentUserId = this.currentUser._id;
    this.reviewService.getReviews().subscribe(reviews => {   
      //filter reviews by current user
      this.pendingReviews = reviews.filter(r=>r.reviewerId === currentUserId && r.status === 'pending');
      this.myReviews = reviews.filter(r=>r.employeeId === currentUserId );
    });
  }

  loadEmployeeNames(){
    this.employeeService.getEmployees().subscribe(employees => {
      employees.forEach(employee => {
        this.employeeNames.set(employee._id, employee.full_name);
      });
    });
  }

  getEmployeeName(employeeId: string){
    return this.employeeNames.get(employeeId);
  }

  provideFeedback(review: Review) {
    // TODO: Add provide feedback logic
    this.showFeedbackDialog = true;
    this.selectedReview = review;
  }

  submitFeedback() {
    if (this.feedbackForm.valid && this.selectedReview) {
      this.reviewService.submitFeedback(
        this.selectedReview.id,
        this.feedbackForm.value
      ).subscribe({
        next: ()=>{
          this.showFeedbackDialog = false;
          this.feedbackForm.reset();
          this.selectedReview = null;
        },
        error: (err)=>{
          console.log('Error submitting feedback', err);
        }
      })
      this.showFeedbackDialog = false;
      this.feedbackForm.reset();
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



