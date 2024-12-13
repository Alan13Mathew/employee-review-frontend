export interface Review {
  _id: string;
  employeeId: string | {
      _id: string;
      full_name: string;
      email: string;
      position: string;
  };
  reviewerIds: string[] | {
      _id: string;
      full_name: string;
      email: string;
      position: string;
  }[];
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