import { apiClient } from './client';
import type { User, AuthResponse, SignupRequest, LoginRequest } from '../types';

export const authApi = {
  signup: async (data: SignupRequest): Promise<User> => {
    const response = await apiClient.post('/api/v1/auth/signup', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/v1/auth/login', data);
    return response.data;
  },
};