export interface User {
  $id: string;
  email: string;
  name: string;
  tenantId: string;
  role: 'admin' | 'user' | 'super_admin';
  permissions: string[];
  $createdAt?: string;
  $updatedAt?: string;
}

export interface UserPrefs {
  tenantId: string;
  role: 'admin' | 'user' | 'super_admin';
  permissions: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
