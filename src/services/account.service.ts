import api from "./api";

interface AccountPayload {
  name: string;
  balance: number;
  currency?: string;
}

export const createAccount = async (data: AccountPayload) => {
  const res = await api.post("/api/accounts/create-account", data);
  return res.data;
};

export const getAllAccounts = async () => {
  const res = await api.get("/api/accounts/get-accounts");
  return res.data;
};

export const getAccountById = async (id: string) => {
  const res = await api.get(`/api/accounts/get-account/${id}`);
  return res.data;
};

export const updateAccount = async (id: string, data: Partial<AccountPayload>) => {
  const res = await api.put(`/api/accounts/update-account/${id}`, data);
  return res.data;
};

export const deleteAccount = async (id: string) => {
  const res = await api.delete(`/api/accounts/delete-account/${id}`);
  return res.data;
};

export const getAccountBalance = async (id: string) => {
  const res = await api.get(`/api/accounts/get-account-balance/${id}`);
  return res.data;
};

export const transferBetweenAccounts = async (data: {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
}) => {
  const res = await api.post("/api/accounts/transfer", data);
  return res.data;
};

export const getAccountTransactions = async (id: string) => {
  const res = await api.get(`/api/accounts/get-account-transactions/${id}`);
  return res.data;
};
