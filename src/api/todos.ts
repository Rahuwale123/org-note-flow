import { apiClient } from './client';
import type { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types';

export const todosApi = {
  getAllTodos: async (): Promise<Todo[]> => {
    const response = await apiClient.get('/api/v1/todos');
    return response.data;
  },

  getMyTodos: async (): Promise<Todo[]> => {
    const response = await apiClient.get('/api/v1/todos/my-todos');
    return response.data;
  },

  createTodo: async (data: CreateTodoRequest): Promise<Todo> => {
    const response = await apiClient.post('/api/v1/todos', data);
    return response.data;
  },

  getTodoById: async (id: number): Promise<Todo> => {
    const response = await apiClient.get(`/api/v1/todos/${id}`);
    return response.data;
  },

  updateTodo: async (id: number, data: UpdateTodoRequest): Promise<Todo> => {
    const response = await apiClient.put(`/api/v1/todos/${id}`, data);
    return response.data;
  },

  deleteTodo: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/api/v1/todos/${id}`);
    return response.data;
  },
};