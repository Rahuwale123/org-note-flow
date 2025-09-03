export interface User {
  id: number;
  username: string;
  role: 'ADMIN' | 'MEMBER';
  organization_id: number;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  organization_id: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  created_by_username?: string;
}

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  organization_id: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  created_by_username?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface SignupRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
}

export interface UpdateNoteRequest {
  title: string;
  content: string;
}

export interface CreateTodoRequest {
  title: string;
}

export interface UpdateTodoRequest {
  title: string;
  completed: boolean;
}