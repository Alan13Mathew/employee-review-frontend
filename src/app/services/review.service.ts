import { inject, Injectable } from '@angular/core';
import { CreateReview, Review } from '../models/review';
import { BehaviorSubject, Observable, of, tap, throwError } from 'rxjs';
import { Feedback } from '../models/feedback';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private apiUrl = `${environment.backendUrl}/reviews`;

  private http = inject(HttpClient);

  getReviews(): Observable<Review[]> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userRole = localStorage.getItem('userRole');

    // Direct API call for admin users
    if (userRole === 'admin') {
      return this.http.get<Review[]>(`${this.apiUrl}/all`);
    }

    // User-specific API call with valid MongoDB ID
    if (currentUser.id) {
      const params = new HttpParams()
        .set('userId', currentUser.id)
        .set('role', userRole || 'employee');
      
      return this.http.get<Review[]>(this.apiUrl, { params });
    }

    // Return empty array if no valid user context
    return of([]);
  }

  getReviewById(id: string): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/${id}`);
  }

  createReview(review: CreateReview) {
    console.log('Creating review:', review);
    const payload = {
      employeeId: review.employeeId,
      reviewerIds: review.reviewerIds, 
      period: review.period,
      dueDate: review.dueDate,
      status: 'pending'
     }
    return this.http.post<Review>(this.apiUrl, payload).pipe(
      tap(review => console.log('Created review:', review))
    )
  }

  submitFeedback(reviewId: string, feedback: Feedback) {
    return this.http.patch<Review>(`${this.apiUrl}/${reviewId}/feedback`, feedback);
  }
  

}
