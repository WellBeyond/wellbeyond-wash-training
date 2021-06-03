import React, {useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';

import './LessonPage.scss';

import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonFooter,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react'
import {useTranslation} from "react-i18next";
import i18n from '../i18n';

import {connect} from '../data/connect';
import * as selectors from '../data/selectors';

import {Lesson, LessonProgress, Subject, TrainingSession} from '../models/Training';
import BackToLessonsLink from "../components/BackToLessons";
import {updateTrainingLesson, updateTrainingSession} from "../data/user/user.actions";

interface OwnProps extends RouteComponentProps {
  subject: Subject;
  lesson: Lesson;
  lessonProgress: LessonProgress;
  activeSession?: TrainingSession;
}

interface StateProps {
  lessons: Lesson[];
}

interface DispatchProps {
  updateTrainingLesson: typeof updateTrainingLesson;
  updateTrainingSession: typeof updateTrainingSession;
}

interface LessonSummaryProps extends OwnProps, StateProps, DispatchProps {}

const LessonSummaryPage: React.FC<LessonSummaryProps> = ({ history, subject, lesson, lessons, lessonProgress,  activeSession, updateTrainingLesson, updateTrainingSession }) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const [nextUrl, setNextUrl] = useState<string>('/tabs/training');
  const [prevUrl, setPrevUrl] = useState<string>('/tabs/training');
  const [nextLesson, setNextLesson] = useState<Lesson>();

  useEffect(() => {
    if (subject && lesson && lessons && lessonProgress) {
      i18n.changeLanguage(subject.locale || 'en');
      const lastPage = ('/tabs/subjects/' + subject.id + '/lessons/' + lesson.id) + ((lesson.pages && lesson.pages.length ?  ('/page/' + lesson.pages.length) : '/intro'));
      const lastQuestion = lesson.questions && lesson.questions.length ? ('/tabs/subjects/' + subject.id + '/lessons/' + lesson.id + '/question/' + lesson.questions.length) : lastPage;

      const idx = subject.lessons.findIndex((l) => l.lessonId === lesson.id);
      const nextLessonId = (idx < (subject.lessons.length - 1)) ? subject.lessons[idx + 1].lessonId : undefined;
      const nextLesson = nextLessonId ? lessons.find(l => l.id === nextLessonId) : undefined;
      setNextLesson(nextLesson);

      setPrevUrl(lastQuestion + (activeSession && activeSession.id ? ('?tsId=' + activeSession.id) : ''));
      setNextUrl('/tabs/subjects/' + subject.id + (nextLesson ? ('/lessons/' + nextLesson.id + '/intro') : '/progress')  + (activeSession && activeSession.id ? ('?tsId=' + activeSession.id) : ''));
      if (!lessonProgress.completed) {
        lessonProgress.completed = new Date();
        updateTrainingLesson(activeSession, lessonProgress);
      }
    }
  },[subject, lesson, lessons, lessonProgress, activeSession, updateTrainingLesson]);


  const handleNext = () => {
    if (activeSession && !activeSession.completed && subject && subject.lessons) {
      const lessonsCompleted = subject.lessons.reduce((count, l) => {
        return count + ((activeSession.lessons && activeSession.lessons[l.lessonId] && activeSession.lessons[l.lessonId].completed) ? 1 : 0);
      }, 0);
      if (lessonsCompleted === subject.lessons.length) {
        activeSession.completed = new Date();
        updateTrainingSession(activeSession);
      }
    }
    history.push(nextUrl);
  }


  return (
    <IonPage id="lesson-summary">
        <IonHeader translucent={true}>
          {subject && lesson &&
          <IonToolbar><IonButtons slot="start">
            <BackToLessonsLink subject={subject} session={activeSession}/>
          </IonButtons>
            <IonTitle>{lesson.name}</IonTitle>
          </IonToolbar>
          }
        </IonHeader>
        {subject && lesson && lessonProgress &&
        <IonContent fullscreen={true}>
          <IonCard className='lesson-card'>
            <IonCardHeader>
              <IonCardSubtitle>{t('resources.lessons.summary.title')}</IonCardSubtitle>
              <IonCardTitle><h2>{lesson.name}</h2></IonCardTitle>
            </IonCardHeader>
            <IonCardContent className='lesson-text'>
              {nextLesson ?
                <p>{t('resources.lessons.summary.completed', {score: lessonProgress.score})}</p>
                :
                <p>{t('resources.lessons.summary.completed2')}</p>
              }
              {nextLesson ?
                <p>{t('resources.lessons.summary.nextLesson', {lesson: nextLesson.name})}</p>
                :
                <p>{t('resources.lessons.summary.allDone', {subject: subject.name})}</p>
              }
            </IonCardContent>
          </IonCard>
        </IonContent>
        }
      <IonFooter>
        <IonToolbar>
          <IonButtons slot={'start'}>
            <IonButton fill="solid" color="primary" routerLink={prevUrl} routerDirection='back'>{t('buttons.previous')}</IonButton>
            <IonButton fill="solid" color="primary" onClick={handleNext}>{t(nextLesson ? 'buttons.next' : 'buttons.done')}</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonPage>);
};

export default connect({
  mapDispatchToProps: {
    updateTrainingLesson: updateTrainingLesson,
    updateTrainingSession: updateTrainingSession
  },
  mapStateToProps: (state, ownProps) => ({
    subject: selectors.getSubject(state, ownProps),
    lesson: selectors.getLesson(state, ownProps),
    lessonProgress: selectors.getLessonProgress(state, ownProps),
    activeSession: selectors.getTrainingSession(state, ownProps),
    lessons: selectors.getLessons(state),
  }),
  component: LessonSummaryPage
});
