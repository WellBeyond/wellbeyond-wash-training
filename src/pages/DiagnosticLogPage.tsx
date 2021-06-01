import React from 'react';
import {IonButtons, IonContent, IonHeader, IonList, IonListHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import StepItem from '../components/StepItem';
import {Checklist, System} from '../models/Maintenance';
import {DiagnosticLog} from '../models/Diagnostic';
import {connect} from '../data/connect';
import * as selectors from '../data/selectors';
import './MaintenancePage.scss';
import {RouteComponentProps} from "react-router";
import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import BackToSystemLink from "../components/BackToSystem";

interface OwnProps extends RouteComponentProps {
  system: System;
  checklist: Checklist;
  log: DiagnosticLog;
}

interface StateProps {
}

interface DispatchProps { }

interface SystemProps extends OwnProps, StateProps, DispatchProps { }

const DiagnosticLogPage: React.FC<SystemProps> = ({ system, checklist,  log}) => {

  const { t } = useTranslation(['translation'], {i18n} );

  return (
    <IonPage id="step-list">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <BackToSystemLink system={system}/>
          </IonButtons>
          <IonTitle>{system ? system.name : t('resources.systems.name')}</IonTitle>
        </IonToolbar>
      </IonHeader>

      { system && checklist && log ?
        <IonContent fullscreen={true}>
          <IonListHeader>
            <h2>
              {checklist ? checklist.name : 'maintenance.checklist.notfound'}
              <br/>
              <small>
                {log.completed ?
                  <div>{t('maintenance.logs.completedOn', {date: log.completed})}</div>
                  :
                  log.started ?
                    <div>{t('maintenance.logs.startedOn', {date: log.started})}</div>
                  : undefined
                }
              </small>
            </h2>
          </IonListHeader>
          <IonList>
          </IonList>
        </IonContent>
        : undefined
      }
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state, ownProps) => ({
    system: selectors.getSystemForLog(state, ownProps),
    checklist: selectors.getChecklistForLog(state, ownProps),
    log: selectors.getDiagnosticLog(state, ownProps),
  }),
  component: DiagnosticLogPage
});

