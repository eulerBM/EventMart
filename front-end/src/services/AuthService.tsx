import { api } from "./api";

interface LoginResponse {
  token: string;
  user: {
    name: string;
    email: string;
  };
}

export async function loginService(email: string, password: string) {
  const response = await api.post<LoginResponse>("auth/login", {
    email,
    password,
  });

  return response.data;
}


export async function registerService(name: string, email: string, password: string) {
  const response = await api.post("auth/register", {
    name,
    email,
    password,
  });

  return response.data;
}
