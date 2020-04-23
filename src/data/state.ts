import { combineReducers } from './combineReducers';
import { trainingReducer } from './lessons/training.reducer';
import { userReducer } from './user/user.reducer';

export const initialState: AppState = {
  data: {
    subjects: [],
    lessons: [],
    loading: false,
    menuEnabled: true
  },
  user: {
    darkMode: false,
    isLoggedIn: undefined,
    loading: false,
    username: undefined
  }
};

export const reducers = combineReducers({
  data: trainingReducer,
  user: userReducer
});

export type AppState = ReturnType<typeof reducers>;
