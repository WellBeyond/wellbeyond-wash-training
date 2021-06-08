import React, {useContext, useEffect, useState} from 'react';
import {
  IonButton,
  IonButtons,
  IonContent, IonFooter,
  IonHeader,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCheckbox, NavContext,
} from '@ionic/react';
import {Checklist, MaintenanceLog, System} from '../models/Maintenance';
import {connect} from '../data/connect';
import * as selectors from '../data/selectors';
import './SystemPage.scss';
import {RouteComponentProps} from "react-router";
import {Trans, useTranslation} from "react-i18next";
import i18n from '../i18n';
import {Diagnostics, Symptom} from "wellbeyond-diagnostic-engine";
import {loadDiagnosticLogs, setEngine, updateDiagnosticLog} from "../data/diagnostic/diagnostic.actions";
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
  setEngine: typeof setEngine
}

interface SymptomsProps extends OwnProps, StateProps, DispatchProps { }

const SymptomsPage: React.FC<SymptomsProps> = ({ system,  symptoms,  defaultLanguage, userId, updateDiagnosticLog, loadDiagnosticLogs, setEngine}) => {

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
        symptoms: symptoms.filter(s =>{return currentSymptoms[s.id]}).map(s => {return s.id})
      };
      updateDiagnosticLog(log);
      setEngine(new Diagnostics());
      navigate('/tabs/diagnostic/'+ log.id, 'forward');
    }
    else {
      setError('maintenance.errors.selectSymptom');
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
                        i18nKey="maintenance.messages.noSymptoms"/>
                    </p>
                  </IonItem>
              }
            </IonList>
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
    setEngine
  },
  mapStateToProps: (state, ownProps) => ({
    system: selectors.getSystem(state, ownProps),
    symptoms: selectors.getSymptomsForSystem(state, ownProps),
    defaultLanguage: state.user.defaultLanguage,
    userId: selectors.getUserId(state),
  }),
  component: SymptomsPage
});

