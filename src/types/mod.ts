export interface SessionData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  systemAdmin: boolean;
  [key: string]: unknown;
}

export type IDValue = string | number;
