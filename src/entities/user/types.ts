export interface UserInterface {
  id: number;
  username: string;
  provider: string;
  provider_id: string;
  avatar: string | null;
  created_at: Date;
  updated_at: Date;
}
