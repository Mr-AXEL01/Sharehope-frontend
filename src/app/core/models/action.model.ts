export interface ActionCreateDTO {
  amount: number;
  description: string;
  categoryId: number;
  attachments?: File[];
}

export interface ActionEmbeddedDTO {
  id: number;
  amount: number;
  description: string;
  createdAt: string;
  actionType: string;
  status: string;
}
