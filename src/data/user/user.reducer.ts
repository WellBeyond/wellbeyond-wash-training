import {UserActions} from './user.actions';
import {UserState} from './user.state';
import {initialState} from "../state";
import {TrainingSessions} from "../training/training.state";

export function userReducer(state: UserState, action: UserActions): UserState {
  switch (action.type) {
    case 'set-user-loading':
      return { ...state, loading: action.isLoading };
    case 'set-user-data':
      return { ...state, ...action.data };
    case 'set-default-language':
      return { ...state, defaultLanguage: action.language };
    case 'set-dark-mode':
      return { ...state, darkMode: action.darkMode };
    case 'set-notifications-on':
      return { ...state, notificationsOn: action.notificationsOn };
    case 'set-accepted-terms':
      return { ...state, acceptedTerms: action.acceptedTerms };
    case 'set-is-loggedin':
      return { ...state, isLoggedIn: action.loggedIn };
    case 'set-is-admin':
      return { ...state, isAdmin: action.isAdmin };
    case 'set-is-maintenance-user':
      return { ...state, isMaintenanceUser: action.isMaintenanceUser };
    case 'set-is-registered':
      return { ...state, isRegistered: action.registered };
    case 'set-user-profile':
      return { ...state, profile: action.profile };
    case 'set-intercom-user':
      return { ...state, intercomUser: action.intercomUser};
    case 'set-organizations':
      return { ...state, organizations: action.organizations };
    case 'set-training-sessions': {
      return { ...state, sessions: action.sessions };
    }
    case 'set-form-sessions': {
      return { ...state, formSessions: action.formSessions };
    }
    case 'set-training-session': {
      let sessions = Object.assign({}, state.sessions);
      if (action.session.id) {
        sessions[action.session.id] = action.session;
      }
      return { ...state, sessions: sessions };
    }
    case 'set-form-session': {
      let formSessions = Object.assign({}, state.formSessions);
      if (action.formSession.id) {
        formSessions[action.formSession.id] = action.formSession;
      }
      return { ...state, formSessions: formSessions };
    }
    case 'set-session-archived': {
      let sessions = {...state.sessions} as TrainingSessions;
      if (action.session.id) {
        delete sessions[action.session.id];
      }
      return { ...state, sessions: sessions};
    }
    case 'reset-user-data':
      let newState = {...initialState.user};
      newState.isLoggedIn = false;
      newState.isRegistered = false;
      newState.acceptedTerms = false;
      newState.profile = undefined;
      newState.intercomUser = undefined;
      newState.sessions = {};
      return newState;
    default:
      return state
  }
}
