
interface LoginResponse {
  token: string;
  user: {
    name: string;
    email: string;
  };
}



export async function login(email: string, password: string) {
  const response = await api.post<LoginResponse>("/login", {
    email,
    password,
  });

  return response.data;
}

export async function register(name: string, email: string, password: string) {
  const response = await api.post<LoginResponse>("/login", {
    email,
    password,
  });

  return response.data;
}
