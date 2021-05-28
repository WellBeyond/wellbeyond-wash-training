import {ActionType} from '../../util/types';
import {listenForTrainingTopics,listenForTrainingSubjects,listenForTrainingLessons} from './trainingApi'
import {TrainingState} from './training.state';
import {Lesson, Subject, Topic} from '../../models/Training';

export const loadTrainingData = (organizationId:string) => (async (dispatch: React.Dispatch<any>) => {

  listenForTrainingTopics((topics: Topic[]) => {
    dispatch(setTopics(topics));
  });

  listenForTrainingSubjects( organizationId, (subjects: Subject[]) => {
    dispatch(setSubjects(subjects));
    listenForTrainingLessons( subjects, (lessons: Lesson[]) => {
      dispatch(setLessons(lessons));
    });
  });
});

export const setData = (data: Partial<TrainingState>) => ({
  type: 'set-training-data',
  data
} as const);

export const setTopics = (topics: Topic[]) => ({
  type: 'set-training-topics',
  topics
} as const);

export const setSubjects = (subjects: Subject[]) => ({
  type: 'set-training-subjects',
  subjects
} as const);

export const setLessons = (lessons: Lesson[]) => ({
  type: 'set-training-lessons',
  lessons
} as const);

export const setLoading = (isLoading: boolean) => ({
  type: 'set-training-loading',
  isLoading
} as const);

export const setMenuEnabled = (menuEnabled: boolean) => ({
  type: 'set-menu-enabled',
  menuEnabled
} as const);


export type TrainingActions =
  | ActionType<typeof setData>
  | ActionType<typeof setTopics>
  | ActionType<typeof setSubjects>
  | ActionType<typeof setLessons>
  | ActionType<typeof setLoading>
  | ActionType<typeof setMenuEnabled>
