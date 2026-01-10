import api from "./api";

interface CurrencyRates {
  date: string;
  baseCurrency: string;
  rates: Record<string, number>;
}

interface ConversionResult {
  originalAmount: number;
  fromCurrency: string;
  toCurrency: string;
  convertedAmount: number;
  rate: number;
}

export const getCurrencyRates = async (): Promise<CurrencyRates> => {
  const res = await api.get("/api/currency/get-rates");
  return res.data;
};

export const convertCurrency = async (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<ConversionResult> => {
  const res = await api.get("/api/currency/convert", {
    params: { amount, fromCurrency, toCurrency },
  });
  return res.data;
};

export const getSupportedCurrencies = async (): Promise<string[]> => {
  const res = await api.get("/api/currency/supported");
  return res.data.currencies;
};

export const refreshCurrencyRates = async (): Promise<CurrencyRates> => {
  const res = await api.post("/api/currency/refresh");
  return res.data;
};
