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
  roles: {role: string} [];
  // articles: number[];
  avatar: string;
}

export interface UserUpdateDTO {
  username?: string;
  email?: string;
  phone?: string;
}

export interface UserAuthResponse extends UserResponse {
  token: string;
}
