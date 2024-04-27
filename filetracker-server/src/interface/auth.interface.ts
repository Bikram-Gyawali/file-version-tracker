export interface RegisterUserRequestBody {
  name: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  device_id: string;
}

export interface RegisterUserResponse {
  success: boolean;
  message: string;
}


export interface LoginUserRequest   {
  email: string;
  password: string;
}

export interface LoginUserResponse {
  success: boolean;
  message: string;
  token: string;
  user: any;
}