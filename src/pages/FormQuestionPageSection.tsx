import React, {useState} from 'react';
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
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRadio,
  IonRadioGroup,
  IonToolbar,
  IonTextarea,
  IonImg,
  IonCheckbox,
} from '@ionic/react'
import {useTranslation} from "react-i18next";
import i18n from '../i18n';

import {connect} from '../data/connect';
import * as selectors from '../data/selectors';
import {Form, FormType, FormQuestion, FormSession} from '../models/Form'

import {startFormSession} from "../data/user/user.actions";
import PhotoUpload from '../components/PhotoUpload';
import { Answer } from '../data/form/form.state';
import {Organization} from "../models/User";

type showWarningType = Record<string, boolean>;


interface OwnProps extends RouteComponentProps {
  idx: number;
  activeSession?: FormSession;
  form: Form;
  formType: FormType;
  questions: FormQuestion[];
  forms: Form[]
  currentIdx: number;
  hasNext: boolean;
  hasPrevious: boolean;
  answer: Answer;
  showWarning : showWarningType;
  setShowWarning: (showWarning: showWarningType) => void;
}

interface StateProps {
  userId?: string;
  organization?: Organization;
  organizations?: Organization[];
  community?: string;
}

interface DispatchProps {
  setAnswer: (ans: Answer) => void;
  getPreviousQuestion: () => void;
  getNextQuestion: () => void;
  startFormSession: (ans: FormSession) => ({ then: (cb: () => void) => void });
  setFormSubmitted: (submitted: boolean) => void;
}

interface FormQuestionPageProps extends OwnProps, StateProps, DispatchProps {}

const FormQuestionPage: React.FC<FormQuestionPageProps> = ({
  form,
  questions,
  idx,
  currentIdx,
  activeSession,
  answer,
  setAnswer,
  organization,
  organizations,
  community,
  userId,
  hasNext,
  hasPrevious,
  showWarning,
  setShowWarning,
  getNextQuestion,
  getPreviousQuestion,
  startFormSession,
  setFormSubmitted,
}) => {

  const { t } = useTranslation(['translation'], {i18n} );

  const [lockAnswer] = useState<boolean>();
  const [photos, setPhotos] = useState<any[]>([]);
  const [photoChanged, setPhotoChanged] = useState(false);

  const handleAnswer = (value:(string|number|undefined | null), index: number) => {
    if (currentIdx !== 0 && !currentIdx) return
    if (index !== 0 && !index) return
    if (!answer[`${currentIdx}`]) answer[`${currentIdx}`] = {}
    // @ts-ignore
    if (value === answer[`${currentIdx}`][`${index}`]) return
    // @ts-ignore
    const nestedAnswer = {...answer[`${currentIdx}`], [`${index}`]: value }
    setAnswer({...answer, [`${currentIdx}`]: nestedAnswer })
  }

  const handleMultiSelect = (key: string) => (event: any) => {
    // @ts-ignore
    let ans = { ...answer[currentIdx] }
    if (!event.detail.checked) {
      delete ans[key]
    } else {
      ans = {...ans, [key]: event.detail.value }
    }
    handleAnswer(ans, idx)
  }

  const setPhoto = (url:string, index: number) => {
    if (photos.find(p => p === url)) return
    if (photos.length === 0 && photoChanged) {
      setPhotoChanged(false);
      return;
    }
    setPhotos([...photos, url])
    // @ts-ignore
    const nestedAnswer = {...answer[`${currentIdx}`], [`${index}`]: [...photos, url] }
    setAnswer({...answer, [`${currentIdx}`]: nestedAnswer })
    setPhotoChanged(true);
    // setAnswer({ ...answer, [`${currentIdx}`]: url });
  };

  const handleSubmit = async () => {
   if (activeSession) {
   } else {
    let questionsWithoutAnswers= form.questions
    let answersToQuestions = answer
    questionsWithoutAnswers && questionsWithoutAnswers.forEach((question, index) => {
      // @ts-ignore
      question.answer = answersToQuestions[index] || ''
   })
    const activeSession = {
      id: '',
      name: '',
      archived: false,
      userId: userId || '',
      formId: form.id,
      organizationId: organization && organization.id,
      organization: organization && organization.name,
      community: community || '',
      formTypeId: form.formTypeId,
      started: new Date(),
      formQuestionsWithAnswers: form.questions,
      forms: {
        [form.id] : {
          formId: form.id,
          answers: answer
        }
      },
    }
    console.log('Aaaaaaaaaaaaactive session',{activeSession})
    activeSession.id = userId + ':' + activeSession.formId + ':' + (activeSession.started && activeSession.started.getTime());
    await startFormSession(activeSession)
    setFormSubmitted(true);
   }
  }

  const handleNext = () => {
    if (questions?.[0].isRequired && !answer[`${currentIdx}`]) {
      setShowWarning({ [`${currentIdx}`]: true });
      return;
    }
    getNextQuestion();
    return;
  }

  const removePhoto = (photo: string) => () => {
    const photoList = photos.filter(p => p !== photo)
    setPhotos(photoList);
    setAnswer({...answer, [`${currentIdx}`]: photoList })
  }

  return (
    <>
        <IonContent fullscreen={true} id={`form-question-page-${currentIdx}`}>
        {form && questions?.map((question, idx) => (
          <IonCard className='lesson-card'>
            <IonCardHeader>
              <IonCardSubtitle>{t('resources.forms.questions.title', {num: (currentIdx + 1 + (idx + 1)/10), count:form.questions.length})}</IonCardSubtitle>
              <IonCardTitle><h2>{question.questionText}</h2></IonCardTitle>
            </IonCardHeader>
            <IonCardContent className='question-answer'>
              {
                (question && (question.questionType === 'yes-no') &&
                  <IonList>
                    {/*@ts-ignore*/}
                    <IonRadioGroup key={`l-${form.id}-q${currentIdx}`} value={answer[`${currentIdx}`]?.[`${idx}`]} onIonChange={e => { handleAnswer(e.detail.value, idx)}}>
                      <IonItem>
                        <IonLabel className="ion-text-wrap">{t('resources.forms.labels.yes')}</IonLabel>
                        <IonRadio disabled={lockAnswer} slot="start" value="yes" />
                      </IonItem>
                      <IonItem>
                        <IonLabel>{t('resources.forms.labels.no')}</IonLabel>
                        <IonRadio disabled={lockAnswer} slot="start" value="no" />
                      </IonItem>
                    </IonRadioGroup>
                  </IonList>
                )
              }
              {
                (question && question.questionType === 'choose-one' && question.choices &&
                  <IonList>
                    <IonRadioGroup key={`l-${form.id}-q${currentIdx}`} onIonChange={e => handleAnswer(e.detail.value, idx)}>
                      {question.choices.map((choice, cidx) =>  {
                        return <IonItem key={`l-${form.id}-q${idx}-choice-${cidx}`}>
                          <IonLabel>{choice.value}</IonLabel>
                          <IonRadio disabled={lockAnswer} slot="start" value={choice.value} />
                        </IonItem>
                      })}
                    </IonRadioGroup>
                    <IonInput disabled={lockAnswer} type="text" value={answer[`${currentIdx}`]?.toString()} placeholder={t('resources.forms.questions.placeholder.detail')} onIonChange={e => handleAnswer(e.detail.value, idx)}/>


                  </IonList>
                )
              }
               {
                (question && question.questionType === 'multi-select' && question.choices &&
                  <IonList>
                      {question.choices.map((choice, cidx) =>  {
                        return (
                          <IonItem key={`l-${form.id}-q${currentIdx}-choice-${cidx}`}>
                            <IonLabel>{choice.value}</IonLabel>
                            <IonCheckbox disabled={lockAnswer} slot="start"
                              value={choice.value}
                              onIonChange={handleMultiSelect(cidx.toString())}
                              // @ts-ignore
                              checked={ !!answer[`${currentIdx}`]?.[cidx.toString()] }
                            />
                          </IonItem>
                        )
                      })}
                  </IonList>
                )
              }
              {
                (question && question.questionType === 'number' &&
                  <IonList>
                    <IonItem key={`l-${form.id}-q${currentIdx}`}>
                      {/* @ts-ignore */}
                      <IonInput required={question.isRequired} disabled={lockAnswer} type="number" value={answer[`${currentIdx}`]?.[`${idx}`]?.toString()} placeholder={t('resources.forms.questions.placeholder.enterNumber')} onIonChange={e => handleAnswer(parseInt(e.detail.value!, 10), idx)}/>
                    </IonItem>
                  </IonList>
                )
              }
              {
                (question && question.questionType === 'open-ended' &&
                  <IonList>
                    <IonItem key={`l-${form.id}-q${currentIdx}`}>
                      {/* @ts-ignore */}
                      <IonInput required={question.isRequired} disabled={lockAnswer} type="text" value={answer[`${currentIdx}`]?.[`${idx}`]?.toString()} placeholder={t('resources.forms.questions.placeholder.openEnded')} onIonChange={e => handleAnswer(e.detail.value, idx)}/>
                    </IonItem>
                  </IonList>
                )
              }
               {
                (question && question.questionType === 'additional-info' &&
                  <IonList>
                    <IonItem key={`l-${form.id}-q${currentIdx}`}>
                      {/* @ts-ignore */}
                      <IonTextarea required={question.isRequired} disabled={lockAnswer} value={answer[`${currentIdx}`]?.[`${idx}`]?.toString()} placeholder={t('resources.forms.questions.placeholder.more')} onIonChange={e => handleAnswer(e.detail.value, idx)}/>
                    </IonItem>
                  </IonList>
                )
              }
              {
                (question && question.questionType === 'photo' &&
                  <IonList>
                    <IonItem className="photo-gallery" key={`l-${form.id}-q${currentIdx}`}>
                      {photos?.map(photo => (
                        <IonContent className="photo">
                          <IonItem>
                            <IonImg src={photo} alt={photo}></IonImg>
                          </IonItem>
                          <IonItem>
                            <IonButton fill="solid" color="primary" onClick={removePhoto(photo)}>{t('buttons.removePhoto')}</IonButton>
                          </IonItem>
                        </IonContent>
                      ))}
                    </IonItem>

                    <IonItem>
                      <PhotoUpload setPhotoUrl={(url: string) => setPhoto(url, idx)} ></PhotoUpload>
                    </IonItem>
                  </IonList>
                )
              }
              {question.isRequired && showWarning[`${currentIdx}`] && <IonLabel className="warning">This question is required.</IonLabel>}
            </IonCardContent>
          </IonCard>
        ))}
        </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButtons slot={'start'}>
            <IonButton fill="solid" color="primary" disabled={!hasPrevious} onClick={getPreviousQuestion}>{t('buttons.previous')}</IonButton>
            <IonButton fill="solid" color="primary"  disabled={!hasNext} onClick={handleNext}>{t('buttons.next')}</IonButton>
            {!hasNext &&
              <IonButton fill="solid" color="primary" onClick={handleSubmit}>{t('buttons.submit')}</IonButton>
            }
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </>
    );
};

export default connect({
  mapDispatchToProps: {
    startFormSession: startFormSession,
  },
  mapStateToProps: (state, ownProps) => ({
    formType: selectors.getFormType(state, ownProps),
    idx: selectors.getFormQuestionIdx(state, ownProps),
    userId: selectors.getUserId(state),
    activeSession: selectors.getFormSession(state, ownProps),
    organizations: selectors.getOrganizations(state),
    organization: selectors.getUserOrganization(state),
    community: selectors.getUserCommunity(state),
  }),
  component: FormQuestionPage
});
