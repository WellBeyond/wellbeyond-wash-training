import React, {useEffect, useState} from 'react';
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
} from '@ionic/react';
import {Checklist, MaintenanceLog, System} from '../models/Maintenance';
import {connect} from '../data/connect';
import * as selectors from '../data/selectors';
import './SystemPage.scss';
import {RouteComponentProps} from "react-router";
import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import {Symptom} from "wellbeyond-diagnostic-engine";
import {updateDiagnosticLog} from "../data/diagnostic/diagnostic.actions";

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
}

interface SymptomsProps extends OwnProps, StateProps, DispatchProps { }

const SymptomsPage: React.FC<SymptomsProps> = ({ system,  symptoms,  defaultLanguage, userId, updateDiagnosticLog}) => {

  const { t } = useTranslation(['translation'], {i18n} );

  const start = () => {
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

        </IonContent>
      }

      <IonFooter>
        <IonToolbar>
          <IonButton expand="block" fill="solid" color="primary" onClick={start}>{t('maintenance.buttons.start')}</IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapDispatchToProps: {
    updateDiagnosticLog
  },
  mapStateToProps: (state, ownProps) => ({
    system: selectors.getSystem(state, ownProps),
    symptoms: selectors.getSymptomsForSystem(state, ownProps),
    defaultLanguage: state.user.defaultLanguage,
    userId: selectors.getUserId(state),
  }),
  component: SymptomsPage
});

