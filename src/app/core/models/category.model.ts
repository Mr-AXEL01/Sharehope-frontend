import {ActionEmbeddedDTO} from './action.model';

export interface CategoryEmbeddedDTO {
  id: number;
  categoryName: string;
  description: string;
}

export interface CategoryResponseDTO extends CategoryEmbeddedDTO{
actions: ActionEmbeddedDTO[];
icon: string;
}
