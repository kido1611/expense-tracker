export interface ApiResponse<T> {
  error: boolean;
  url?: string;
  statusCode: number;
  statusMessage: string;
  message?: string;
  data?: T;
}
