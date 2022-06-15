import { UserDisplay } from "../interfaces/userDisplay";

export const USER_DISPLAY_REPO_Symbol = Symbol("UserDisplayRepository");


export interface UserDisplayRepository {
  geUserById: (userId: string) => Promise<UserDisplay>;
}
