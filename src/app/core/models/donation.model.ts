import {CategoryEmbeddedDTO} from './category.model';
import {UserEmbeddedDTO} from './user.model';

export interface DonationResponseDTO {
  id: number;
  amount: number;
  description: string;
  donationStatus: string;
  category: CategoryEmbeddedDTO;
  user: UserEmbeddedDTO;
  createdAt: string;
  attachmentUrls: string[];
  paymentIntentClientSecret?: string;
}
