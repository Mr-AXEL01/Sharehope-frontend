import {DonationStatus} from './donation.model';

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

export interface ActionStatusDTO {
  status: DonationStatus
}
