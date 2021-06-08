import React, {useEffect} from 'react';
import {IonButtons, IonContent, IonHeader, IonList, IonListHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import {System} from '../models/Maintenance';
import {DiagnosticLog} from '../models/Diagnostic';
import {connect} from '../data/connect';
import * as selectors from '../data/selectors';
import './DiagnosticPage.scss';
import {RouteComponentProps} from "react-router";
import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import BackToSystemLink from "../components/BackToSystem";
import {Diagnostics, FactQuestion, Solution, Symptom} from "wellbeyond-diagnostic-engine";

interface OwnProps extends RouteComponentProps {
  system: System;
  log: DiagnosticLog;
}

interface StateProps {
  symptoms: Symptom[]
  facts: FactQuestion[];
  solutions: Solution[];
  engine?: Diagnostics
}

interface DispatchProps { }

interface SystemProps extends OwnProps, StateProps, DispatchProps { }

const DiagnosticLogPage: React.FC<SystemProps> = ({ system,  log, symptoms, facts, solutions, engine}) => {

  const { t } = useTranslation(['translation'], {i18n} );

  const questionCallback = async function (_question:FactQuestion) {
    const promise = new Promise<string>((resolve, _reject) => {
      setTimeout(() => {
        resolve('yes');
      }, 1000);
    });
    return promise;
  }

  const areYouAbleCallback = async function (_solution:Solution) {
    const promise = new Promise<string>((resolve, _reject) => {
      setTimeout(() => {
        resolve('no');
      }, 1000);
    });
    return promise;
  }

  const didItWorkCallback = async function (_solution:Solution) {
    const promise = new Promise<string>((resolve, _reject) => {
      setTimeout(() => {
        resolve('no');
      }, 1000);
    });
    return promise;
  }


  useEffect(() => {
    if (system && engine && log && symptoms && facts && solutions) {
      if (!engine.initialized) {
        engine.initialize(symptoms, solutions, facts, questionCallback, areYouAbleCallback, didItWorkCallback);
        if (log.symptoms && log.symptoms.length) {
          engine.run(log.symptoms);
        }
      }
    }
  }, [system, symptoms, engine, log, facts, solutions]);


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
        </IonContent>
        : undefined
      }
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state, ownProps) => ({
    system: selectors.getSystemForDiagnostic(state, ownProps),
    log: selectors.getDiagnosticLog(state, ownProps),
    symptoms: selectors.getSymptomsForDiagnosis(state, ownProps),
    facts: selectors.getFacts(state),
    solutions: selectors.getSolutions(state),
    engine: selectors.getDiagnosticEngine(state)
  }),
  component: DiagnosticLogPage
});

