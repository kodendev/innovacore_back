export interface AuthenticatedUser {
  id: number;
  username: string;
  email: string;
  role: number; // userTypeId
  active: boolean;
}
