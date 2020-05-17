import React, {useContext, useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';

import './LessonPage.scss';

import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCheckbox,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenuButton,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  NavContext
} from '@ionic/react'
import {useTranslation} from "react-i18next";
import i18n from '../i18n';

import {connect} from '../data/connect';
import * as selectors from '../data/selectors';

import {Lesson, LessonPage, LessonProgress, PageView, Subject, TrainingSession} from '../models/Training';
import VideoPlayer from "../components/VideoPlayer";
import ImageZoomModal from "../components/ImageZoomModal";
import {updateTrainingLesson} from "../data/training/training.actions";
import {updateUserLesson} from "../data/user/user.actions";
import BackToLessonsLink from "../components/BackToLessons";

interface OwnProps extends RouteComponentProps {
  subject: Subject;
  lesson: Lesson;
  page: LessonPage;
  idx: number;
  lessonProgress: LessonProgress;
  activeSession?: TrainingSession;
}

interface StateProps {
}

interface DispatchProps {
  updateUserLesson: typeof updateUserLesson;
  updateTrainingLesson: typeof updateTrainingLesson;
}

interface LessonPageProps extends OwnProps, StateProps, DispatchProps {}

const LessonPagePage: React.FC<LessonPageProps> = ({ subject, lesson, page, idx, lessonProgress, activeSession, updateUserLesson, updateTrainingLesson }) => {

  const {navigate} = useContext(NavContext);
  const { t } = useTranslation(['translation'], {i18n} );

  const [nextUrl, setNextUrl] = useState();
  const [prevUrl, setPrevUrl] = useState();
  const [videoPlayed, setVideoPlayed] = useState();
  const [showNext, setShowNext] = useState();
  const [showModal, setShowModal] = useState();
  const [pageView, setPageView] = useState();

  useEffect(() => {
    let pageView:PageView = {};
    if (lesson && page && lessonProgress) {
      lessonProgress.pageViews = lessonProgress.pageViews || [];
      if (lessonProgress.pageViews.length !== lesson.pages.length) {
        lessonProgress.pageViews.length = 0;
        lesson.pages.map((p) => {lessonProgress.pageViews.push({})});
        if (activeSession) {
          updateTrainingLesson(activeSession, lessonProgress);
        }
        else {
          updateUserLesson(lessonProgress);
        }
      }
      const pageView = lessonProgress.pageViews[idx];
      setPageView(pageView);
      if (pageView.attestationChecked || !page.attestation) {
        setShowNext(true);
      }
    }
  },[lesson, page, lessonProgress, idx]);

  useEffect(() => {
    if (subject && lesson && idx > -1) {
      const path = '/tabs/subjects/' + subject.id + '/lessons/' + lesson.id;
      const prev = idx - 1;
      const next = idx + 1;
      if (prev < 0) {
        if (lesson.questions && lesson.questions.length && !lessonProgress.completed) {
          setPrevUrl(path + '/question/' + lesson.questions.length + '/preview' + (activeSession && activeSession.id ? ('?tsId=' + activeSession.id) : ''));
        }
        else {
          setPrevUrl(path + '/intro' + (activeSession && activeSession.id ? ('?tsId=' + activeSession.id) : ''));
        }
      }
      else {
        setPrevUrl(path + '/page/' + (prev+1) + (activeSession && activeSession.id ? ('?tsId=' + activeSession.id) : ''));
      }
      if (next > lesson.pages.length - 1) {
        if (lesson.questions && lesson.questions.length) {
          setNextUrl(path + '/question/1' + (activeSession && activeSession.id ? ('?tsId=' + activeSession.id) : ''));
        }
        else {
          setNextUrl(path + '/summary' + (activeSession && activeSession.id ? ('?tsId=' + activeSession.id) : ''));
        }
      }
      else {
        setNextUrl(path + '/page/' + (next+1) + (activeSession && activeSession.id ? ('?tsId=' + activeSession.id) : ''));
      }
    }
  },[subject, lesson, idx, activeSession]);

  useEffect(() => {
    if (videoPlayed) {
        pageView.videoWatched = true;
        setPageView(pageView);
      }
  }, [videoPlayed]);

  const openModal = () => {setShowModal(true)};
  const closeModal = () => {setShowModal(false)};
  const setAttestationChecked = (checked:boolean) => {
    pageView.attestationChecked = checked;
    setPageView(pageView);
    setShowNext(checked);
  }
  const savePageView = () => {
    if (pageView) {
      if (page.video) {
        pageView.videoWatched = !!pageView.videoWatched;
      }
      if (page.attestation) {
        pageView.attestationChecked = !!pageView.attestationChecked;
      }
      if (page.video || page.attestation) {
        lessonProgress.pageViews[idx] = pageView;
        if (activeSession) {
          updateTrainingLesson(activeSession, lessonProgress);
        } else {
          updateUserLesson(lessonProgress);
        }
      }
    }
  }
  const handleNext = (e:any) => {
    e.preventDefault();
    savePageView();
    navigate(nextUrl, 'forward');
  }
  const handlePrev = (e:any) => {
    e.preventDefault();
    savePageView();
    navigate(prevUrl, 'back');
  }

  return (
    <IonPage id="lesson-page">
        <IonHeader translucent={true}>
          <IonToolbar>
            <IonButtons slot="start">
              <BackToLessonsLink subject={subject} session={activeSession}/>
            </IonButtons>
            <IonTitle>{lesson && lesson.name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        {lesson && lessonProgress && page &&
        <IonContent fullscreen={true}>
          <IonCard>
            <IonCardHeader>
              <IonCardSubtitle>Page {idx+1} of {lesson.pages.length}</IonCardSubtitle>
              <h2>{page.title}</h2>
            </IonCardHeader>
            <IonCardContent class='lesson-text'>
              <div dangerouslySetInnerHTML={{__html: page.text}}></div>
              {page.photo &&
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <img src={page.photo} crossOrigin='anonymous' onClick={openModal} alt={page.title}/>
                    </IonCol>
                  </IonRow>
                  {page.photoCaption &&
                    <IonRow>
                      <IonCol>
                        <IonText color='medium'>
                          <div className='ion-text-center'>{page.photoCaption}</div>
                        </IonText>
                      </IonCol>
                    </IonRow>
                  }
                </IonGrid>
              }
              {page.video &&
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <VideoPlayer id={`video-${lesson.id}-${idx}`} src={page.video} setVideoPlayed={setVideoPlayed} />
                    </IonCol>
                  </IonRow>
                  {page.videoCaption &&
                  <IonRow>
                    <IonCol>
                      <IonText color='medium'>
                        <div className='ion-text-center'>{page.videoCaption}</div>
                      </IonText>
                    </IonCol>
                  </IonRow>
                  }
                </IonGrid>
              }
            </IonCardContent>
          </IonCard>
          {page.attestation && pageView &&
            <IonList>
              <IonListHeader>
                {t('resources.lessons.attestationHeader')}
              </IonListHeader>
              <IonItem>
                <IonLabel>
                  {page.attestation}
                </IonLabel>
                <IonCheckbox color="primary" checked={pageView.attestationChecked} slot="start" onIonChange={(e:CustomEvent) => setAttestationChecked(e.detail.checked)}>
                </IonCheckbox>
              </IonItem>
            </IonList>
          }
          {page.photo &&
            <ImageZoomModal showModal={showModal} closeModal={closeModal} image={page.photo || ''} title={page.title} />
          }
        </IonContent>
        }
      <IonFooter>
        <IonToolbar>
          <IonButtons slot={'start'}>
            <IonButton fill="solid" color="primary" onClick={handlePrev}>{t('buttons.previous')}</IonButton>
            <IonButton fill="solid" color="primary" disabled={!showNext} onClick={handleNext}>{t('buttons.next')}</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonPage>);
};

export default connect({
  mapDispatchToProps: {
    updateUserLesson: updateUserLesson,
    updateTrainingLesson: updateTrainingLesson
  },
  mapStateToProps: (state, ownProps) => ({
    subject: selectors.getSubject(state, ownProps),
    lesson: selectors.getLesson(state, ownProps),
    page: selectors.getLessonPage(state, ownProps),
    idx: selectors.getPageIdx(state, ownProps),
    lessonProgress: selectors.getLessonProgress(state, ownProps),
    activeSession: selectors.getTrainingSession(state, ownProps),
  }),
  component: LessonPagePage
});
