import { UserLesson} from "../../models/User";

export interface UserState {
  id?: string;
  email?: string;
  username?: string;
  displayName?: string;
  isLoggedIn?: boolean;
  darkMode: boolean;
  loading: boolean;
  lessons?: Array<UserLesson>;
};
