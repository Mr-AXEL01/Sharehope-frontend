import {UserEmbeddedDTO} from './user.model';

export interface ArticleResponseDTO {
  id: number;
  title: string;
  description: string;
  content: string;
  createdAt: string;
  author: UserEmbeddedDTO;
  attachments?: string[];
}

export interface ArticleProjectionDTO {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  author: UserEmbeddedDTO;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
