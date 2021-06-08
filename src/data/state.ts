import {combineReducers} from './combineReducers';
import {maintenanceReducer} from './maintenance/maintenance.reducer';
import {diagnosticReducer} from './diagnostic/diagnostic.reducer';
import {trainingReducer} from './training/training.reducer';
import {userReducer} from './user/user.reducer';

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
    checklists: [],
    maintenanceLogs: {}
  },
  diagnostic: {
    symptoms: [],
    solutions: [],
    facts: [],
    diagnosticLogs: {},
    engine: undefined,
    almanac: undefined
  },
  user: {
    darkMode: false,
    notificationsOn: true,
    loading: false,
    sessions: {}
  }
};

export const reducers = combineReducers({
  data: trainingReducer,
  maintenance: maintenanceReducer,
  diagnostic: diagnosticReducer,
  user: userReducer
});

export type AppState = ReturnType<typeof reducers>;
