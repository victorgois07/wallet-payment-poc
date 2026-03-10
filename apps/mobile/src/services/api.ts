import type { PaginatedResponse, PaymentRequest, PaymentResponse } from '@wallet/shared';
import axios from 'axios';
import { Platform } from 'react-native';
import { useBackdropStore } from '../stores/backdrop.store';

const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:3000',
  ios: 'http://localhost:3000',
  default: 'http://localhost:3000',
});

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (config.method?.toLowerCase() === 'post') {
    useBackdropStore.getState().show();
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    useBackdropStore.getState().hide();
    return response;
  },
  (error) => {
    useBackdropStore.getState().hide();
    if (axios.isAxiosError(error) && error.response?.data) {
      const problem = error.response.data as { title?: string; detail?: string; status?: number };
      const message = problem.detail ?? problem.title ?? 'Erro desconhecido';
      return Promise.reject(new Error(message));
    }
    if (error instanceof Error && error.message === 'Network Error') {
      return Promise.reject(new Error('Sem conexao com o servidor'));
    }
    return Promise.reject(error);
  },
);

export const paymentApi = {
  create: async (data: PaymentRequest): Promise<PaymentResponse> => {
    const response = await api.post<PaymentResponse>('/v1/payments', data);
    return response.data;
  },

  getById: async (transactionId: string): Promise<PaymentResponse> => {
    const response = await api.get<PaymentResponse>(`/v1/payments/${transactionId}`);
    return response.data;
  },

  list: async (page = 1, limit = 10): Promise<PaginatedResponse<PaymentResponse>> => {
    const response = await api.get<PaginatedResponse<PaymentResponse>>('/v1/payments', {
      params: { page, limit },
    });
    return response.data;
  },
};
