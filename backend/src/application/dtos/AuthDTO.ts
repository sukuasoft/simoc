export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  user: {
    id: string;
    email: string;
    name: string;
  };
  accessToken: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
}
