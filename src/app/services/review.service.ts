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

  getReviews() {
    const userRole = localStorage.getItem('userRole');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser.id;
    
    console.log('Review request details:', {
        userId,
        userRole,
        userName: currentUser.full_name
    });

    // For employees, explicitly include reviews where they are reviewers
    const params = new HttpParams()
        .set('userId', userId)
        .set('role', userRole || '')
        .set('includeAssigned', 'true');  // New flag to include assigned reviews

    return this.http.get<Review[]>(this.apiUrl, { params }).pipe(
        tap(reviews => console.log('Raw reviews from server:', reviews))
    );
}


  
  
  
  

  getReviewById(id: string): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/${id}`);
  }

  createReview(review: CreateReview) {
    console.log('Creating review:', review);
    const payload = {
      employeeId: review.employeeId,
      reviewerId: review.reviewerId, // Currently only handles single reviewer
      period: review.period,
      dueDate: review.dueDate,
      status: 'pending'
     }
    return this.http.post<Review>(this.apiUrl, payload);
  }

  submitFeedback(reviewId: string, feedback: Feedback) {
    return this.http.patch<Review>(`${this.apiUrl}/${reviewId}/feedback`, feedback);
  }


  // private reviews: Review[] = [
  //   {
  //     id: '1',
  //     employeeId: '1',
  //     reviewerId: '2',
  //     period: '2024-Q1',
  //     status: 'pending',
  //     createdAt: new Date('2024-01-01'),
  //     dueDate: new Date('2024-03-31')
  //   },
  //   {
  //     id: '2',
  //     employeeId: '3',
  //     reviewerId: '1',
  //     period: '2024-Q1',
  //     status: 'completed',
  //     rating: 4,
  //     feedback: 'Excellent team player, meets deadlines consistently.',
  //     createdAt: new Date('2024-01-01'),
  //     dueDate: new Date('2024-03-31')
  //   },
  //   {
  //     id: '3',
  //     employeeId: '5',
  //     reviewerId: '4',
  //     period: '2024-Q1',
  //     status: 'pending',
  //     createdAt: new Date('2024-01-01'),
  //     dueDate: new Date('2024-03-31')
  //   },
  //   {
  //     id: '4',
  //     employeeId: '2',
  //     reviewerId: '3',
  //     period: '2024-Q1',
  //     status: 'pending',
  //     createdAt: new Date('2024-01-15'),
  //     dueDate: new Date('2024-03-31')
  //   },
  //   {
  //     id: '5',
  //     employeeId: '4',
  //     reviewerId: '1',
  //     period: '2024-Q1',
  //     status: 'completed',
  //     rating: 5,
  //     feedback: 'Outstanding performance in project deliveries.',
  //     createdAt: new Date('2024-01-10'),
  //     dueDate: new Date('2024-03-31')
  //   },
  //   {
  //     id: '6',
  //     employeeId: '1',
  //     reviewerId: '5',
  //     period: '2024-Q1',
  //     status: 'completed',
  //     rating: 4,
  //     feedback: 'Great communication skills and team collaboration.',
  //     createdAt: new Date('2024-01-05'),
  //     dueDate: new Date('2024-03-31')
  //   },
  //   {
  //     id: '7',
  //     employeeId: '6',
  //     reviewerId: '1',
  //     period: '2024-Q1',
  //     status: 'pending',
  //     createdAt: new Date('2024-01-20'),
  //     dueDate: new Date('2024-03-31')
  //   }
  // ];
  // private reviewsSubject = new BehaviorSubject<Review[]>(this.reviews);

  // constructor() { }

  // getReviews() {
  //   return this.reviewsSubject.asObservable();
  // }

  // getReviewById(id: string) {
  //   return of(this.reviews.find(review => review.id === id));
  // }

  // submitFeedback(reviewId: string, feedback: Feedback) {
  //   const review = this.reviews.find(r => r.id === reviewId);
  //   if (review) {
  //     review.status = 'completed';
  //     review.rating = feedback.rating;
  //     review.feedback = feedback.feedback;
  //     this.reviewsSubject.next([...this.reviews]);
  //     return of(review);
  //   }
  //   return throwError(() => new Error('Review not found'));
  // }

  // createReview(review: Omit<Review, 'id' | 'status' | 'createdAt'>) {
  //   const newReview = {
  //     id: (this.reviews.length + 1).toString(),
  //     employeeId: review.employeeId,
  //     reviewerId: review.reviewerId,
  //     period: review.period,
  //     status: 'pending' as const,  // Type assertion
  //     createdAt: new Date(),
  //     dueDate: new Date(review.dueDate)
  //   };
    
  //   this.reviews.push(newReview);
  //   this.reviewsSubject.next([...this.reviews]);
  //   return of(newReview);
  // }
  
  

}
