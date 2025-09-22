export interface Meeting {
  $id: string;
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  location?: string;
  contactId?: string;
  dealId?: string;
  tenantId: string;
  $createdAt?: string;
  $updatedAt?: string;
}

export interface MeetingsState {
  ids: string[];
  entities: Record<string, Meeting>;
  loading: boolean;
  error: string | null;
  searchTerm: string;
}
