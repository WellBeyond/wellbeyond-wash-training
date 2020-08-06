import {combineReducers} from './combineReducers';
import {trainingReducer} from './training/training.reducer';
import {userReducer} from './user/user.reducer';

export const initialState: AppState = {
  data: {
    subjects: [],
    lessons: [],
    loading: false,
    menuEnabled: true
  },
  user: {
    darkMode: false,
    notificationsOn: false,
    loading: false,
    sessions: {}
  }
};

export const reducers = combineReducers({
  data: trainingReducer,
  user: userReducer
});

export type AppState = ReturnType<typeof reducers>;
