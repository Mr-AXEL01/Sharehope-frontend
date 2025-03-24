import {CategoryEmbeddedDTO} from './category.model';
import {UserEmbeddedDTO} from './user.model';

export enum NeedStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  REJECTED = "REJECTED",

}

export interface NeedResponseDTO {
  id: number;
  amount: number;
  description: string;
  needStatus: NeedStatus;
  category: CategoryEmbeddedDTO;
  user: UserEmbeddedDTO;
  createdAt: string;
  attachmentUrls: string[];
  paymentIntentClientSecret?: string;
}
