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
};