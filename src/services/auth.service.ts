import api from "./api";

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  username: string;
  email: string;
  password: string;
}

export const loginRequest = async (data: LoginPayload) => {
  const res = await api.post("/api/auth/login", data);
  return res.data; // { token }
};

export const signupRequest = async (data: SignupPayload) => {
  const res = await api.post("/api/auth/signup", data);
  return res.data; // { message: "User created successfully" }
};

