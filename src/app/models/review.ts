export interface Review {
    id: string;
    employeeId: string;
    reviewerId: string;
    period: string;
    status: 'pending' | 'completed';
    rating?: number;
    feedback?: string;
    createdAt: Date;
    dueDate: Date;
  }
  
  export interface CreateReview {
    employeeId: string;
    reviewerIds: string[];
    period: string;
    dueDate: Date;
  }