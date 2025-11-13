export interface User {
  id: string;
  email: string;
  phone: string;
  password: string | null;
  name: string;
  email_is_verified: boolean;
  phone_is_verified: boolean;
  fcm_token: string | null;
  profile: string;
  active_status: boolean;
  block_status: boolean;
  google_id: string | null;
  current_location: any | null;
  last_login: string;
  tokenVersion: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsData {
  averageRating: string;
  totalReviews: string;
}

export interface RiderProfile {
  user: User;
  reviewsData: ReviewsData;
}

export interface UpdateRiderProfile {
  user: User;
}

export interface MiniProfileCardProps {
  name: string;
  email: string;
  profile: string;
  rating: string;
  totalReviews: string;
}

export interface updateRiderProfileParams {
  name?: string;
  phone?: string;
  profile?: string;
}
