import axios from 'axios';

export interface FieldType {
  name: string;
  email: string;
  password: string;
  newPassword?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  auth: boolean;
}

export const db = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
