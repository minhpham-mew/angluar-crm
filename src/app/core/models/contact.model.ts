export interface Contact {
  $id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  notes?: string;
  tenantId: string;
  $createdAt?: string;
  $updatedAt?: string;
}

export interface ContactsState {
  ids: string[];
  entities: { [id: string]: Contact };
  loading: boolean;
  error: string | null;
  searchTerm: string;
}
