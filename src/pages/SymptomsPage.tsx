import React, {
  // useContext,
  // useState,
  useEffect,
} from 'react';
import {
  // IonButton,
  // IonCheckbox,
  // IonFooter,
  // IonItem,
  // IonLabel,
  // IonList,
  // IonListHeader,
  // IonText,
  // NavContext,
  IonContent,
  IonButtons,
  IonHeader,
  IonMenuButton,
  IonPage, 
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { Widget } from '@typeform/embed-react'

import {System} from '../models/Maintenance';
import {connect} from '../data/connect';
import * as selectors from '../data/selectors';
import './SystemPage.scss';
import {RouteComponentProps} from "react-router";
import {
  // Trans, 
  useTranslation
} from "react-i18next";
import i18n from '../i18n';
import {
  // DiagnosticEngine, 
  Symptom
} from "wellbeyond-diagnostic-engine";
import {loadDiagnosticLogs, setDiagnosticEngine, updateDiagnosticLog} from "../data/diagnostic/diagnostic.actions";
// import {DiagnosticLog} from "../models/Diagnostic";

// interface SymptomMap {
//   [id: string]: boolean;
// }

interface OwnProps extends RouteComponentProps {
  system: System;
  systemTypes: System[];
}

interface StateProps {
  symptoms: Symptom[];
  defaultLanguage?: string;
  userId?: string;
  userProfile?: any
}

interface DispatchProps {
  updateDiagnosticLog: typeof updateDiagnosticLog
  loadDiagnosticLogs: typeof loadDiagnosticLogs
  setDiagnosticEngine: typeof setDiagnosticEngine
}

interface SymptomsProps extends OwnProps, StateProps, DispatchProps { }

const SymptomsPage: React.FC<SymptomsProps> = ({ system,  symptoms,  defaultLanguage, userId, userProfile, systemTypes, updateDiagnosticLog, loadDiagnosticLogs, setDiagnosticEngine}) => {

  // const {navigate} = useContext(NavContext);
  const { t } = useTranslation(['translation'], {i18n} );

  // const [currentSymptoms, setCurrentSymptoms] = useState<SymptomMap>({});
  // const [error, setError] = useState<string>('');

  useEffect(() => {
    if (system && symptoms) {
      i18n.changeLanguage(defaultLanguage || 'en');
      loadDiagnosticLogs(system);
    }

  }, [system, symptoms, defaultLanguage, loadDiagnosticLogs]);

  let systemTypeObjectArray = systemTypes && systemTypes.filter((stId)=> system && system.systemTypeIds.includes(stId.id))

  // const setSymptomChecked = (symptom:Symptom, checked:boolean) => {
  //   const updated = {...currentSymptoms};
  //   updated[symptom.id] = checked;
  //   setCurrentSymptoms(updated);
  //   if (checked) {
  //     setError('');
  //   }
  // }

  // const validate = ():boolean => {
  //   for (const symptom in currentSymptoms) {
  //     if (currentSymptoms[symptom]) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  // const start = () => {
  //   if (validate()) {
  //     const now = new Date();
  //     const log:DiagnosticLog = {
  //       id: system.id + ':' + now.getTime(),
  //       started: now,
  //       name: system.name + ' - ' + now.toLocaleDateString(),
  //       organizationId: system.organizationId,
  //       community: system.community,
  //       systemId: system.id,
  //       userId: userId,
  //       archived: false,
  //       status: 'open',
  //       symptoms: symptoms.filter(s =>{return currentSymptoms[s.id]}).map(s => {
  //         return {
  //           symptomId: s.id,
  //           symptom: s.name,
  //           resolved: false
  //         }
  //       }),
  //       diagnosticResults: [],
  //       solutionResults: []
  //     };
  //     setError('');
  //     updateDiagnosticLog(log);
  //     setDiagnosticEngine(new DiagnosticEngine());
  //     navigate('/tabs/diagnostic/'+ log.id, 'forward');
  //   }
  //   else {
  //     setError('diagnostic.errors.selectSymptom');
  //   }
  // }

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

      { system && symptoms && systemTypes &&
        <IonContent fullscreen={true}>
          {
          systemTypeObjectArray.filter(function(e) { return e.name === 'Rainwater System'; }).length > 0 ? 
          <Widget id="gPMM68sX" style={{ width: '100%', height: '65vw', display: 'flex' }} className="my-form"  hidden={{ userid: `${(userProfile && userProfile.name) || userId}`, systemtype: 'Rainwater System'}}/> :
          systemTypeObjectArray.filter(function(e) { return e.name === 'Borehole System'; }).length > 0 ?
          <Widget id="CqTjx0gc" style={{ width: '100%', height: '65vw', display: 'flex' }} className="my-form"  hidden={{ userid: `${(userProfile && userProfile.name) || userId}`, systemtype: 'Borehole System'}}/> :
          <Widget id="gPMM68sX" style={{ width: '100%', height: '65vw', display: 'flex' }} className="my-form"  hidden={{ userid: `${(userProfile && userProfile.name) || userId}`, systemtype: 'System no specified'}}/>
          }

            {/* <IonList>
              <IonListHeader>
                <h4>{t('diagnostic.headers.symptoms', {systemName: system.name})}</h4>
              </IonListHeader>
              {symptoms.length ? symptoms.map((symptom, index: number) => (
                  <IonItem key={`symptom-${index}`}>
                    <IonLabel className="ion-text-wrap">{symptom.name}</IonLabel>
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
          </IonText>} */}
        </IonContent>
      }

      {/* <IonFooter>
        <IonToolbar>
          <IonButton expand="block" fill="solid" color="primary" onClick={start}>{t('diagnostic.buttons.start')}</IonButton>
        </IonToolbar>
      </IonFooter> */}
    </IonPage>
  );
}

export default connect<OwnProps, StateProps, DispatchProps>({
  mapDispatchToProps: {
    updateDiagnosticLog,
    loadDiagnosticLogs,
    setDiagnosticEngine,
  },
  mapStateToProps: (state, ownProps) => ({
    system: selectors.getSystem(state, ownProps),
    symptoms: selectors.getSymptomsForSystem(state, ownProps),
    defaultLanguage: state.user.defaultLanguage,
    userId: selectors.getUserId(state),
    userProfile: selectors.getUserProfile(state),
    systemTypes: selectors.getSystemTypes(state)
  }),
  component: SymptomsPage
});

