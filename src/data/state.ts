import {combineReducers} from './combineReducers';
import {maintenanceReducer} from './maintenance/maintenance.reducer';
import {diagnosticReducer} from './diagnostic/diagnostic.reducer';
import {trainingReducer} from './training/training.reducer';
import {userReducer} from './user/user.reducer';
import {formReducer} from './form/form.reducer';

export const initialState: AppState = {
  data: {
    topics: [],
    subjects: [],
    lessons: [],
    loading: false,
    menuEnabled: true
  },
  maintenance: {
    systems: [],
    systemTypes: [],
    checklists: [],
    maintenanceLogs: {}
  },
  diagnostic: {
    symptoms: [],
    solutions: [],
    diagnostics: [],
    diagnosticLogs: {},
    engine: undefined,
    almanac: undefined
  },
  user: {
    darkMode: false,
    notificationsOn: true,
    loading: false,
    sessions: {},
    formSessions: {}
  },
  form: {
    loading:  false,
    formTypes: [],
    forms: [],
    menuEnabled: true
  }
};

export const reducers = combineReducers({
  data: trainingReducer,
  maintenance: maintenanceReducer,
  diagnostic: diagnosticReducer,
  user: userReducer,
  form: formReducer
});

export type AppState = ReturnType<typeof reducers>;
