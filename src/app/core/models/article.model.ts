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
  id: number
  title: string
  description: string
  author: UserEmbeddedDTO
  createdAt: string
  attachments: string[]
}

export interface ArticleCreateDTO {
  title: string
  description: string
  content: string
  authorId: number
  attachments?: File[]
}

export interface ArticleUpdateDTO {
  title?: string
  description?: string
  content: string
  attachments?: File[]
}


export interface PaginatedResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}
