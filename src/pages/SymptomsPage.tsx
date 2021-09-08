import React, {useContext, useEffect, useState} from 'react';
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenuButton,
  IonPage, IonText,
  IonTitle,
  IonToolbar,
  NavContext,
} from '@ionic/react';
import {System} from '../models/Maintenance';
import {connect} from '../data/connect';
import * as selectors from '../data/selectors';
import './SystemPage.scss';
import {RouteComponentProps} from "react-router";
import {Trans, useTranslation} from "react-i18next";
import i18n from '../i18n';
import {DiagnosticEngine, Symptom} from "wellbeyond-diagnostic-engine";
import {loadDiagnosticLogs, setDiagnosticEngine, updateDiagnosticLog} from "../data/diagnostic/diagnostic.actions";
import {DiagnosticLog} from "../models/Diagnostic";

interface SymptomMap {
  [id: string]: boolean;
}

interface OwnProps extends RouteComponentProps {
  system: System;
}

interface StateProps {
  symptoms: Symptom[];
  defaultLanguage?: string;
  userId?: string;
}

interface DispatchProps {
  updateDiagnosticLog: typeof updateDiagnosticLog
  loadDiagnosticLogs: typeof loadDiagnosticLogs
  setDiagnosticEngine: typeof setDiagnosticEngine
}

interface SymptomsProps extends OwnProps, StateProps, DispatchProps { }

const SymptomsPage: React.FC<SymptomsProps> = ({ system,  symptoms,  defaultLanguage, userId, updateDiagnosticLog, loadDiagnosticLogs, setDiagnosticEngine}) => {

  const {navigate} = useContext(NavContext);
  const { t } = useTranslation(['translation'], {i18n} );

  const [currentSymptoms, setCurrentSymptoms] = useState<SymptomMap>({});
  const [error, setError] = useState<string>('');


  useEffect(() => {
    if (system && symptoms) {
      i18n.changeLanguage(defaultLanguage || 'en');
      loadDiagnosticLogs(system);
    }

  }, [system, symptoms, defaultLanguage, loadDiagnosticLogs]);


  const setSymptomChecked = (symptom:Symptom, checked:boolean) => {
    const updated = {...currentSymptoms};
    updated[symptom.id] = checked;
    setCurrentSymptoms(updated);
    if (checked) {
      setError('');
    }
  }

  const validate = ():boolean => {
    for (const symptom in currentSymptoms) {
      if (currentSymptoms[symptom]) {
        return true;
      }
    }
    return false;
  }

  const start = () => {
    if (validate()) {
      const now = new Date();
      const log:DiagnosticLog = {
        id: system.id + ':' + now.getTime(),
        started: now,
        name: system.name + ' - ' + now.toLocaleDateString(),
        organizationId: system.organizationId,
        community: system.community,
        systemId: system.id,
        userId: userId,
        archived: false,
        status: 'open',
        symptoms: symptoms.filter(s =>{return currentSymptoms[s.id]}).map(s => {
          return {
            symptomId: s.id,
            symptom: s.name,
            resolved: false
          }
        }),
        diagnosticResults: [],
        solutionResults: []
      };
      setError('');
      updateDiagnosticLog(log);
      setDiagnosticEngine(new DiagnosticEngine());
      navigate('/tabs/diagnostic/'+ log.id, 'forward');
    }
    else {
      setError('diagnostic.errors.selectSymptom');
    }
  }

  return (
    <IonPage id="symptoms-page">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{system ? system.name : t('resources.systems.name')}</IonTitle>
        </IonToolbar>
      </IonHeader>

      { system && symptoms &&
        <IonContent fullscreen={true}>
            <IonList>
              <IonListHeader>
                <h4>{t('diagnostic.headers.symptoms', {systemName: system.name})}</h4>
              </IonListHeader>
              {symptoms.length ? symptoms.map((symptom, index: number) => (
                  <IonItem key={`symptom-${index}`}>
                    <IonLabel>{symptom.name}</IonLabel>
                    <IonCheckbox color="primary" checked={!!currentSymptoms[symptom.id]} slot="start" onIonChange={e => setSymptomChecked(symptom, !!e.detail.checked)} ></IonCheckbox>
                  </IonItem>))
                :
                  <IonItem>
                    <p>
                      <Trans
                        i18nKey="diagnostic.messages.noSymptoms"/>
                    </p>
                  </IonItem>
              }
            </IonList>

          {error && <IonText color="danger">
            <p className="ion-padding-start">
              {t(error)}
            </p>
          </IonText>}
        </IonContent>
      }

      <IonFooter>
        <IonToolbar>
          <IonButton expand="block" fill="solid" color="primary" onClick={start}>{t('diagnostic.buttons.start')}</IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
}

export default connect<OwnProps, StateProps, DispatchProps>({
  mapDispatchToProps: {
    updateDiagnosticLog,
    loadDiagnosticLogs,
    setDiagnosticEngine
  },
  mapStateToProps: (state, ownProps) => ({
    system: selectors.getSystem(state, ownProps),
    symptoms: selectors.getSymptomsForSystem(state, ownProps),
    defaultLanguage: state.user.defaultLanguage,
    userId: selectors.getUserId(state),
  }),
  component: SymptomsPage
});

