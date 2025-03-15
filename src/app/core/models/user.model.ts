export interface UserRegister {
  username: string;
  email: string;
  password: string;
  avatar?: File;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  phone: string;
  roles: string[];
  // articles: number[];
  avatar: string;
}
