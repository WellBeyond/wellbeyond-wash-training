import React, {useEffect, useState} from 'react';
import {
  IonButtons, IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonContent,
  IonHeader, IonItem, IonLabel,
  IonList,
  IonListHeader,
  IonPage, IonRadio,
  IonRadioGroup,
  IonTitle,
  IonToolbar,
  IonCardContent, IonCard, IonFooter, IonButton
} from '@ionic/react';
import {System} from '../models/Maintenance';
import {DiagnosticLog} from '../models/Diagnostic';
import {connect} from '../data/connect';
import * as selectors from '../data/selectors';
import './DiagnosticPage.scss';
import {RouteComponentProps} from "react-router";
import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import BackToSystemLink from "../components/BackToSystem";
import {DiagnosticEngine, Diagnostic, Solution, Symptom, EngineResult} from "wellbeyond-diagnostic-engine";
import {Answer} from "../models/Training";

interface ResolveFunc {
  (answer:string): void;
}

interface NextQuestion {
  symptom?: Symptom;
  diagnostic?: Diagnostic;
  solution?: Solution;
  resolve?: ResolveFunc;
}

interface OwnProps extends RouteComponentProps {
  system: System;
  log: DiagnosticLog;
}

interface StateProps {
  symptoms: Symptom[]
  diagnostics: Diagnostic[];
  solutions: Solution[];
  engine?: DiagnosticEngine
}

interface DispatchProps { }

interface SystemProps extends OwnProps, StateProps, DispatchProps { }

const DiagnosticLogPage: React.FC<SystemProps> = ({ system,  log, symptoms, diagnostics, solutions, engine}) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const [nextQuestion, setNextQuestion] = useState<NextQuestion>();
  const [result, setResult] = useState<EngineResult>();
  const [answer, setAnswer] = useState<string>();
  const [showNext, setShowNext] = useState<boolean>(false);

  const diagnosticCallback = async function (diagnostic:Diagnostic) {
    const promise = new Promise<string>((resolve, _reject) => {
      console.log('Asking question ...', diagnostic);
      const symptom = symptoms && symptoms.find(s => s.id === diagnostic.symptomId);
      const nextQuestion = {
        symptom: symptom,
        diagnostic: diagnostic,
        resolve: resolve
      };
      setNextQuestion(nextQuestion);
    });
    return promise;
  }

  const solutionCallback = async function (solution:Solution) {
    const promise = new Promise<string>((resolve, _reject) => {
      console.log('Checking to see if this worked...', solution);
      const symptom = symptoms && symptoms.find(s => s.id === solution.symptomId);
      const nextQuestion = {
        symptom: symptom,
        solution: solution,
        resolve: resolve
      };
      setNextQuestion(nextQuestion);
    });
    return promise;
  }

  const handleAnswer = (value:(string)) => {
    if (value) {
      setAnswer(value);
      setShowNext(true);
    }
  }

  const handleNext = () => {
    if (nextQuestion && nextQuestion.resolve && answer) {
      nextQuestion.resolve(answer);
      setAnswer(undefined);
      setShowNext(false);
    }
  }


  useEffect(() => {
    if (system && engine && log && symptoms && diagnostics && solutions) {
      if (!engine.initialized) {
        engine.initialize(symptoms, solutions, diagnostics, diagnosticCallback, solutionCallback);
        if (log.symptoms && log.symptoms.length) {
          engine.run(log.symptoms, system.systemTypeIds).then((result) => {
            setNextQuestion(undefined);
            setResult(result);
          });
        }
      }
    }
  }, [system, symptoms, engine, log, diagnostics, solutions, diagnosticCallback, solutionCallback]);


  return (
    <IonPage id="step-list">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <BackToSystemLink system={system} target="symptoms"/>
          </IonButtons>
          <IonTitle>{system ? system.name : t('resources.systems.name')}</IonTitle>
        </IonToolbar>
      </IonHeader>

      { system && log ?
        <IonContent fullscreen={true}>
          {(result &&
            <IonCard>
              <IonCardHeader>
                <IonCardTitle><h2>Diagnostic Engine Complete</h2></IonCardTitle>
              </IonCardHeader>
            </IonCard>
          )}
          {(nextQuestion && nextQuestion.diagnostic &&
            <IonCard>
              <IonCardHeader>
                <IonCardTitle><h2>{nextQuestion.diagnostic.name}</h2></IonCardTitle>
              </IonCardHeader>
              <IonCardContent className='question-answer'>
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
              </IonCardContent>
            </IonCard>
          )}

          {(nextQuestion && nextQuestion.solution &&
            <IonCard className='lesson-card'>
              <IonCardHeader>
                <IonCardSubtitle>{nextQuestion.solution.name}</IonCardSubtitle>
                <IonCardTitle><h2>Did this fix the problem?</h2></IonCardTitle>
              </IonCardHeader>
              <IonCardContent className='question-answer'>
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
              </IonCardContent>
            </IonCard>
          )}
        </IonContent>
        : undefined
      }
      <IonFooter>
        <IonToolbar>
            <IonButton  expand="block" fill="solid" color="primary" disabled={!showNext} onClick={handleNext}>{t('buttons.next')}</IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state, ownProps) => ({
    system: selectors.getSystemForDiagnostic(state, ownProps),
    log: selectors.getDiagnosticLog(state, ownProps),
    symptoms: selectors.getSymptoms(state),
    diagnostics: selectors.getDiagnostics(state),
    solutions: selectors.getSolutions(state),
    engine: selectors.getDiagnosticEngine(state)
  }),
  component: DiagnosticLogPage
});

