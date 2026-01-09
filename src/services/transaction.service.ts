import api from "./api";

interface TransactionPayload {
  accountId: string;
  toAccountId?: string;
  amount: number;
  type: "income" | "expense" | "transfer";
  category: string;
  date: string;
  description?: string;
}

export const createTransaction = async (data: TransactionPayload) => {
  const res = await api.post("/api/trans", data);
  return res.data;
};

export const getAllTransactions = async () => {
  const res = await api.get("/api/trans");
  return res.data;
};

export const getTransactionById = async (id: string) => {
  const res = await api.get(`/api/trans/${id}`);
  return res.data;
};

export const updateTransaction = async (id: string, data: Partial<TransactionPayload>) => {
  const res = await api.put(`/api/trans/${id}`, data);
  return res.data;
};

export const deleteTransaction = async (id: string) => {
  const res = await api.delete(`/api/trans/${id}`);
  return res.data;
};
