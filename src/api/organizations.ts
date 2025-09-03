import { apiClient } from './client';
import type { Organization, User } from '../types';

export const organizationsApi = {
  getMyOrganization: async (): Promise<Organization> => {
    const response = await apiClient.get('/api/v1/organizations/me');
    return response.data;
  },

  getOrganizationUsers: async (organizationId: number): Promise<User[]> => {
    const response = await apiClient.get(`/api/v1/organizations/${organizationId}/users`);
    return response.data;
  },

  updateUserRole: async (organizationId: number, userId: number, data: { role: string }): Promise<{ message: string }> => {
    const response = await apiClient.put(`/api/v1/organizations/${organizationId}/users/${userId}`, data);
    return response.data;
  },

  removeUser: async (organizationId: number, userId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/api/v1/organizations/${organizationId}/users/${userId}`);
    return response.data;
  },
};