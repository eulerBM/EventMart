import { api } from "./api";

interface LoginResponse {
  status: number;
  nameError: string;
  token: string;
  user: {
    idPublic: string;
    name: string;
    email: string;
  };
}

interface RegisterResponse {
  status: number;
  nameError: string;
  data: string;
}

export async function loginService(email: string, password: string) {
  const response = await api.post<LoginResponse>("auth/login", {
    email,
    password,
  });

  return response.data;
}


export async function registerService(name: string, email: string, password: string) {
  const response = await api.post<RegisterResponse>("auth/register", {
    name,
    email,
    password,
  });
  
  return response.data;
}
