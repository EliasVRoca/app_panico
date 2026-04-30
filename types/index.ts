export interface User {
  id: number;
  username: string;
  email: string;
  phone_number?: string;
  tier?: 'free' | 'premium'; // Assuming common tiers
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  roles: Role[];
  nombre?: string; // Kept for compatibility with existing code
}

export interface CreateUserPayload {
  username: string;
  email: string;
  phone_number?: string;
  tier?: 'free' | 'premium';
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  role_ids: number[];
}

export type PatchUserPayload = Partial<CreateUserPayload>;

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface CreateRolePayload {
  name: string;
  description: string;
}

export type PatchRolePayload = Partial<CreateRolePayload>;

export interface AuthResponse {
  access: string;
  refresh?: string;
  user?: User;
}

export interface Contact {
  id: number;
  name: string;
  phone_number: string;
  priority: number;
}

export interface CreateContactPayload {
  name: string;
  phone_number: string;
  priority: number;
}

export type PatchContactPayload = Partial<CreateContactPayload>;

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface PanicActivatePayload {
  latitude: string;
  longitude: string;
}

export interface PanicEvent {
  id: number;
  user: number;
  latitude: string;
  longitude: string;
  timestamp: string;
  status: string;
}

export interface PanicActivateResponse {
  message: string;
  event: PanicEvent;
  simulated_logs: string[];
}
