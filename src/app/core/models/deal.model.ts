export interface Deal {
  $id: string;
  title: string;
  description?: string;
  value: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  probability: number;
  expectedCloseDate?: string;
  contactId?: string;
  tenantId: string;
  $createdAt?: string;
  $updatedAt?: string;
}

export interface DealsState {
  ids: string[];
  entities: Record<string, Deal>;
  loading: boolean;
  error: string | null;
  searchTerm: string;
}
