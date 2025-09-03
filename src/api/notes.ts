import { apiClient } from './client';
import type { Note, CreateNoteRequest, UpdateNoteRequest } from '../types';

export const notesApi = {
  getAllNotes: async (): Promise<Note[]> => {
    const response = await apiClient.get('/api/v1/notes');
    return response.data;
  },

  createNote: async (data: CreateNoteRequest): Promise<Note> => {
    const response = await apiClient.post('/api/v1/notes', data);
    return response.data;
  },

  getNoteById: async (id: number): Promise<Note> => {
    const response = await apiClient.get(`/api/v1/notes/${id}`);
    return response.data;
  },

  updateNote: async (id: number, data: UpdateNoteRequest): Promise<Note> => {
    const response = await apiClient.put(`/api/v1/notes/${id}`, data);
    return response.data;
  },

  deleteNote: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/api/v1/notes/${id}`);
    return response.data;
  },
};