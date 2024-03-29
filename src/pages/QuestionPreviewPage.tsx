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
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import {useTranslation} from "react-i18next";
import i18n from '../i18n';

import {connect} from '../data/connect';
import * as selectors from '../data/selectors';

import {Answer, Lesson, LessonProgress, Question, Subject, TrainingSession} from '../models/Training';
import {updateTrainingLesson} from "../data/user/user.actions";
import BackToLessonsLink from "../components/BackToLessons";

interface OwnProps extends RouteComponentProps {
  subject: Subject;
  lesson: Lesson;
  question: Question;
  idx: number;
  lessonProgress: LessonProgress;
  activeSession?: TrainingSession;
}

interface StateProps {
}

interface DispatchProps {
  updateTrainingLesson: typeof updateTrainingLesson;
}

interface QuestionPageProps extends OwnProps, StateProps, DispatchProps {}

const QuestionPreviewPage: React.FC<QuestionPageProps> = ({ history, subject, lesson, question, idx, lessonProgress, activeSession, updateTrainingLesson }) => {

  const { t } = useTranslation(['translation'], {i18n} );

  const [nextUrl, setNextUrl] = useState<string>('/tabs/training');
  const [prevUrl, setPrevUrl] = useState<string>('/tabs/training');
  const [answer, setAnswer] = useState<string|number|undefined>();
  const [showNext, setShowNext] = useState<boolean>();

  useEffect(() => {
    let priorAnswer;
    if (question && lessonProgress) {
      const a = lessonProgress.answers.find(element => element.question === question.questionText);
      if (a) {
        priorAnswer = a.answerBefore;
      }
    }
    setAnswer(priorAnswer);
    setShowNext(!!priorAnswer);
  },[lessonProgress, question]);

  useEffect(() => {
    if (subject && lesson && idx > -1) {
      i18n.changeLanguage(subject.locale || 'en');
      const path = '/tabs/subjects/' + subject.id + '/lessons/' + lesson.id;
      const prev = idx - 1;
      const next = idx + 1;
      if (prev < 0) {
          setPrevUrl(path + '/intro' + (activeSession && activeSession.id ? ('?tsId=' + activeSession.id) : ''));
      }
      else {
        setPrevUrl(path + '/preview/' + (prev+1) + (activeSession && activeSession.id ? ('?tsId=' + activeSession.id) : ''));
      }
      if (next > lesson.questions.length - 1) {
        if (lesson.pages && lesson.pages.length) {
          setNextUrl(path + '/page/1' + (activeSession && activeSession.id ? ('?tsId=' + activeSession.id) : ''));
        }
        else {
          setNextUrl(path + '/summary' + (activeSession && activeSession.id ? ('?tsId=' + activeSession.id) : ''));
        }
      }
      else {
        setNextUrl(path + '/preview/' + (next+1) + (activeSession && activeSession.id ? ('?tsId=' + activeSession.id) : ''));
      }
    }
  },[subject, lesson, idx, activeSession])

  const handleAnswer = (value:(string|number|undefined)) => {
    setAnswer(value);
    if (value) {
      lessonProgress.answers = lessonProgress.answers || new Array<Answer>();
      let ans = lessonProgress.answers.find(element => element.question === question.questionText);
      if (!ans) {
        ans = {
          question: question.questionText,
          correctAnswer: question.correctAnswer
        };
        lessonProgress.answers.push(ans);
      }
      ans.answerBefore = value;
      setShowNext(true);
    }
  }

  const handleNext = () => {
    if (answer) {
      const allAnswered = lessonProgress.answers.every((a) => {
        return a.answerBefore;
      });
      if (allAnswered) {
        let preCorrect = 0;
        lessonProgress.answers.forEach(a => {
          if (a.answerBefore === a.correctAnswer) preCorrect++;
        });
        lessonProgress.preScore = lessonProgress.answers.length ? Math.round((100*preCorrect) / lesson.questions.length) : 0;
      }
      updateTrainingLesson(activeSession, lessonProgress);
    }
    history.push(nextUrl);
  }

  return (
    <IonPage id="question-page">
      <IonHeader translucent={true}>
        {subject && lesson &&
        <IonToolbar><IonButtons slot="start">
          <BackToLessonsLink subject={subject} session={activeSession}/>
        </IonButtons>
          <IonTitle>{lesson.name}</IonTitle>
        </IonToolbar>
        }
      </IonHeader>
      {subject && lesson && lessonProgress && question &&
      <IonContent fullscreen={true}>
        <IonCard className='lesson-card'>
          <IonCardHeader>
            <IonCardSubtitle>{t('resources.lessons.questions.title', {num: idx+1, count:lesson.questions.length})}</IonCardSubtitle>
            <IonCardTitle><h2>{question.questionText}</h2></IonCardTitle>
          </IonCardHeader>
          <IonCardContent className='question-answer'>
            {
              (question && question.questionType === 'yes-no' &&
                <IonList>
                  <IonRadioGroup value={answer} onIonChange={e => handleAnswer(e.detail.value)}>
                    <IonItem>
                      <IonLabel>{t('training.labels.yes')}</IonLabel>
                      <IonRadio slot="start" value="yes" />
                    </IonItem>
                    <IonItem>
                      <IonLabel>{t('training.labels.no')}</IonLabel>
                      <IonRadio slot="start" value="no" />
                    </IonItem>
                  </IonRadioGroup>
                </IonList>
              )
            }
            {
              (question && question.questionType === 'choose-one' && question.choices &&
                <IonList>
                  <IonRadioGroup value={answer} onIonChange={e => handleAnswer(e.detail.value)}>
                    {question.choices.map((choice, idx) =>  {
                      return <IonItem key={`choice-${idx}`}>
                        <IonLabel className="ion-text-wrap">{choice.value}</IonLabel>
                        <IonRadio slot="start" value={choice.value} />
                      </IonItem>
                    })}
                  </IonRadioGroup>
                </IonList>
              )
            }
            {
              (question && question.questionType === 'number' &&
                <IonList>
                  <IonItem>
                    <IonInput type="number" value={answer} placeholder={t('questions.enterNumber')} onIonChange={e => handleAnswer(parseInt(e.detail.value!, 10))}/>
                  </IonItem>
                </IonList>
              )
            }
          </IonCardContent>
        </IonCard>
      </IonContent>
      }
      <IonFooter>
        <IonToolbar>
          <IonButtons slot={'start'}>
            <IonButton fill="solid" color="primary" routerLink={prevUrl} routerDirection='back'>{t('buttons.previous')}</IonButton>
            <IonButton fill="solid" color="primary"  disabled={!showNext} onClick={handleNext}>{t('buttons.next')}</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonPage>);
};


export default connect({
  mapDispatchToProps: {
    updateTrainingLesson: updateTrainingLesson
  },
  mapStateToProps: (state, ownProps) => ({
    subject: selectors.getSubject(state, ownProps),
    lesson: selectors.getLesson(state, ownProps),
    question: selectors.getQuestion(state, ownProps),
    idx: selectors.getQuestionIdx(state, ownProps),
    lessonProgress: selectors.getLessonProgress(state, ownProps),
    activeSession: selectors.getTrainingSession(state, ownProps)
  }),
  component: QuestionPreviewPage
});
