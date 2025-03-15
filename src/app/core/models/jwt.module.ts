import {JwtPayload} from 'jwt-decode';

export interface CustomJwtPayload extends JwtPayload {
  roles?: string[] | { role: string }[];
}
