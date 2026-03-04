export interface Item {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}

export interface ItemCreate {
  name: string;
  description?: string | null;
}

export interface ItemUpdate {
  name?: string;
  description?: string | null;
}
