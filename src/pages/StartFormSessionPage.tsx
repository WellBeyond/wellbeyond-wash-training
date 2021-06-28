import React, {useEffect, useState, useCallback} from 'react';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import './Login.scss';
import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import {connect} from '../data/connect';
import {RouteComponentProps} from 'react-router';
import {Form, FormType} from "../models/Form";

import * as selectors from "../data/selectors";
import {startTrainingSession} from "../data/user/user.actions";
import {Organization} from "../models/User";
import FormQuestionPage from './FormQuestionPage';
import { Answer } from '../data/form/form.state';
import BackToFormLink from '../components/BackToForm';
import FormSubmitSuccessPage from './FormSubmitSuccessPage';

interface OwnProps extends RouteComponentProps {
  formType: FormType;
  form: Form;
}

interface StateProps {
  userId?: string;
  organization?: Organization;
  community?: string;
}

interface DispatchProps {
  startTrainingSession: typeof startTrainingSession;
}

interface StartTrainingSessionProps extends OwnProps, StateProps, DispatchProps { }

const StartTrainingSession: React.FC<StartTrainingSessionProps> = ({ form, formType, userId, organization, community, startTrainingSession }) => {

  const { t } = useTranslation(['translation'], {i18n} );

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [question, setQuestion] = useState<any>({});
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [answer, setAnswer] = useState<Answer>({});
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [hasPrevious, setHasPrevious] = useState<boolean>(false);
  const [showWarning, setShowWarning] = useState<Record<string, boolean>>({});

  const nextExists = useCallback((idx: number) => (idx + 1) < (form?.questions?.length || 0), [form]);
  const prevExists = (idx: number) => (idx - 1) >= 0;

  useEffect(() => {
    i18n.changeLanguage(formType.locale || 'en');
  }, [formType]);

  useEffect(() => {
    const initialIdx = 0;
    if (form?.questions.length <= initialIdx) return;
    setQuestion(form.questions[initialIdx])
    setHasNext(nextExists(initialIdx))
    setCurrentIdx(initialIdx)
  }, [form, nextExists]);

  const getNextQuestion = () => {
    if (!hasNext) return;
    console.log(question.isRequired)
    setCurrentIdx(currentIdx + 1)
    setQuestion(form?.questions[currentIdx + 1])
    setHasNext(nextExists(currentIdx + 1))
    setHasPrevious(prevExists(currentIdx + 1))
  }

  const getPreviousQuestion = () => {
    if (!hasPrevious) return;
    setCurrentIdx(currentIdx - 1)
    setQuestion(form?.questions[currentIdx - 1])
    setHasNext(nextExists(currentIdx - 1))
    setHasPrevious(prevExists(currentIdx - 1))
  }

  return (
    <IonPage id="start-session-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <BackToFormLink formType={formType}/>
          </IonButtons>
          {/* <IonTitle>{t('resources.forms.pages.start')}</IonTitle> */}
          <IonTitle>{t('resources.forms.pages.start')} {form.name} {t('resources.forms.pages.questions')}</IonTitle>

        </IonToolbar>
      </IonHeader>
      <IonContent>
        {formSubmitted && <FormSubmitSuccessPage />}
        {!formSubmitted && (
          <FormQuestionPage
            form={form}
            question={question}
            currentIdx={currentIdx}
            answer={answer}
            setAnswer={setAnswer}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            showWarning={showWarning}
            setShowWarning={setShowWarning}
            getNextQuestion={getNextQuestion}
            getPreviousQuestion={getPreviousQuestion}
            setFormSubmitted={setFormSubmitted} />
        )}
      </IonContent>

    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapDispatchToProps: {
    startTrainingSession
  },
  mapStateToProps: (state, ownProps) => ({
    formType: selectors.getFormType(state, ownProps),
    form: selectors.getForm(state, ownProps),
    userId: selectors.getUserId(state),
    organization: selectors.getUserOrganization(state),
    community: selectors.getUserCommunity(state),
  }),
  component: StartTrainingSession
})
