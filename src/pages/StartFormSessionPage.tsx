import React, {useEffect, useState, useCallback, useContext} from 'react';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  NavContext
} from '@ionic/react';
import './Login.scss';
import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import {connect} from '../data/connect';
import {RouteComponentProps} from 'react-router';
import {Form, FormType} from "../models/Form";

import * as selectors from "../data/selectors";
import {startFormSession} from "../data/user/user.actions";
import {Organization} from "../models/User";
import FormQuestionPage from './FormQuestionPage';
import SFormQuestionPage from './FormQuestionPageSection';
import { Answer, AnswerExt } from '../data/form/form.state';
import FormSubmitSuccessPage from './FormSubmitSuccessPage';
import { arrowBack } from 'ionicons/icons';
import BackToFormLink from '../components/BackToForm';

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
  startFormSession: typeof startFormSession;
}

interface StartFormSessionProps extends OwnProps, StateProps, DispatchProps { }

const MultiStepQuestion: React.FC<any> = ({ question, ...props}: { question: { "multi-step-question": Array<typeof FormQuestionPage>}, currentIdx: number }) => {
  return <SFormQuestionPage  {...props} questions={question["multi-step-question"]} />
}

const StartFormSession: React.FC<StartFormSessionProps> = ({ form, formType, userId, organization, community, startFormSession }) => {

  const { t } = useTranslation(['translation'], {i18n} );

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [question, setQuestion] = useState<any>({});
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [answer, setAnswer] = useState<AnswerExt<Answer>>({});
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [hasPrevious, setHasPrevious] = useState<boolean>(false);
  const [showWarning, setShowWarning] = useState<Record<string, boolean>>({});

  const nextExists = useCallback((idx: number) => (idx + 1) < (form?.questions?.length || 0), [form]);
  const prevExists = (idx: number) => (idx - 1) >= 0;

  useEffect(() => {
    i18n.changeLanguage(formType.locale || 'en');
  }, [formType]);

  const {navigate} = useContext(NavContext);

  useEffect(() => {
    const initialIdx = 0;
    if (form?.questions?.length <= initialIdx) return;
    if (!form.questions) {navigate('/tabs/water-systems/', 'forward'); return}
    setQuestion(form.questions[initialIdx])
    setHasNext(nextExists(initialIdx))
    setCurrentIdx(initialIdx)
  }, [form, nextExists]);

  const getNextQuestion = () => {
    if (!hasNext) return;
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

  const Component: React.FC<any> = question?.["multi-step-question"] ? MultiStepQuestion : FormQuestionPage;
  return (
    <IonPage id="start-session-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
          <IonTitle>
            {
              hasPrevious ? <IonButton onClick={getPreviousQuestion} fill="solid" color="primary">
              <IonIcon icon={arrowBack} />
            </IonButton> :
            <BackToFormLink formType={formType} />
            }
            {formType?.name}
            </IonTitle>
          </IonButtons>
          {/* <IonTitle>{t('resources.forms.pages.start')}</IonTitle> */}
          <IonTitle>{t('resources.forms.pages.start')} {form.name} {t('resources.forms.pages.questions')}</IonTitle>

        </IonToolbar>
      </IonHeader>
      <IonContent>
        {formSubmitted && <FormSubmitSuccessPage />}
        {!formSubmitted && (
          <Component
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
    startFormSession
  },
  mapStateToProps: (state, ownProps) => ({
    formType: selectors.getFormType(state, ownProps) || {},
    form: selectors.getForm(state, ownProps) || {},
    userId: selectors.getUserId(state),
    organization: selectors.getUserOrganization(state),
    community: selectors.getUserCommunity(state),
  }),
  component: StartFormSession
})
