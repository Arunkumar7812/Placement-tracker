export interface JwtPayload {
  userId: number;
  email: string;
}

export interface AuthenticatedRequest {
  userId?: number;
}
