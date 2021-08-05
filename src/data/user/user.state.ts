import {IntercomUser, Organization, UserProfile} from "../../models/User";
import {TrainingSessions} from "../training/training.state";
import { FormSessions } from "../form/form.state";

export interface UserState {
  id?: string;
  defaultLanguage?: string;
  isAdmin?: boolean;
  isMaintenanceUser?: boolean;
  isLoggedIn?: boolean;
  isRegistered?: boolean;
  acceptedTerms?: boolean;
  darkMode: boolean;
  loading: boolean;
  notificationsOn: boolean;
  intercomUser?: IntercomUser;
  profile?: UserProfile;
  organizations?: Organization[];
  sessions?: TrainingSessions;
  formSessions?: FormSessions;
}
