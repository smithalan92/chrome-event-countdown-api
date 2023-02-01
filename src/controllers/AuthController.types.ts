export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginUser {
  id: number;
  email: string;
}

export interface LoginResponse {
  user: LoginUser;
  token: string;
}
